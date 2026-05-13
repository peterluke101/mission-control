'use client';

/**
 * ChatDock — in-dashboard chat with the NanoClaw "Ares" agent.
 *
 * UX:
 *   - Collapsed: 48px tall bar.
 *       * Mobile: pinned above the bottom-nav (which is ~56px tall + safe-area).
 *       * Desktop: floating bottom-right (24px from edges).
 *   - Expanded: full-width sheet on mobile (~70vh), 400x600 card on desktop.
 *
 * Transport:
 *   - POST /api/chat -> Cloudflare Pages Function proxies to NanoClaw via Tailscale Funnel.
 *   - Response is SSE (Cloudflare Workers can't hold a 60-90s request).
 *   - GET /api/chat/health drives the status dot.
 *   - POST /api/upload streams file uploads to NanoClaw.
 *
 * Persistence:
 *   - localStorage['mc-chat-messages']         JSON, capped at last 200.
 *   - localStorage['mc-chat-conversationId']   UUID, regenerated on "New chat".
 *
 * Voice:
 *   - Web Speech API (Chrome / Safari). Disabled with tooltip in unsupported browsers.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChevronUp,
  X,
  Paperclip,
  Mic,
  Send,
  RefreshCw,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Role = 'user' | 'assistant';

interface AttachmentRef {
  url: string;
  filename: string;
}

interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  ts: number;
  attachments?: AttachmentRef[];
  /** true while the assistant message is still streaming */
  streaming?: boolean;
  /** true if the message ended in an error */
  error?: boolean;
}

interface SSEEvent {
  type: 'chunk' | 'done' | 'error';
  text?: string;
  message?: string;
}

// Minimal SpeechRecognition typing so we don't depend on lib.dom additions.
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STORAGE_MESSAGES = 'mc-chat-messages';
const STORAGE_CONV_ID = 'mc-chat-conversationId';
const MESSAGE_CAP = 200;
const HEALTH_INTERVAL_MS = 30_000;
const HEALTH_STALE_MS = 30_000;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeLoadMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_MESSAGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MESSAGE_CAP);
  } catch {
    return [];
  }
}

function safeSaveMessages(msgs: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  try {
    const trimmed = msgs.slice(-MESSAGE_CAP);
    window.localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(trimmed));
  } catch {
    /* quota; ignore */
  }
}

function loadConvId(): string {
  if (typeof window === 'undefined') return uuid();
  const existing = window.localStorage.getItem(STORAGE_CONV_ID);
  if (existing) return existing;
  const fresh = uuid();
  window.localStorage.setItem(STORAGE_CONV_ID, fresh);
  return fresh;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Tiny markdown -> HTML for **bold**, `code`, [link](url), code fences, newlines.
 * Output is already escaped first, so it is safe to dangerouslySetInnerHTML.
 */
function renderMarkdown(input: string): string {
  // Pull out fenced code blocks first so their contents aren't transformed.
  const fences: string[] = [];
  let escaped = escapeHtml(input).replace(/```([\s\S]*?)```/g, (_m, body: string) => {
    fences.push(body);
    return `\u0000FENCE${fences.length - 1}\u0000`;
  });

  escaped = escaped
    // inline code
    .replace(/`([^`\n]+)`/g, '<code class="mc-inline-code">$1</code>')
    // bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // markdown links — value is already html-escaped so quotes are &quot;
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="mc-link">$1</a>',
    )
    // line breaks
    .replace(/\n/g, '<br />');

  // Put fenced code blocks back.
  escaped = escaped.replace(/\u0000FENCE(\d+)\u0000/g, (_m, idx: string) => {
    const body = fences[Number(idx)] ?? '';
    return `<pre class="mc-code-block">${body}</pre>`;
  });

  return escaped;
}

function formatTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [interim, setInterim] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [healthOk, setHealthOk] = useState<boolean>(false);
  const [lastHealthAt, setLastHealthAt] = useState<number>(0);

  // Refs for resources that shouldn't trigger re-renders.
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ---------------------------------------------------------------------------
  // Init: load persisted state, set up conversation id.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setMessages(safeLoadMessages());
    setConversationId(loadConvId());
  }, []);

  // Persist messages whenever they change.
  useEffect(() => {
    if (messages.length === 0) return;
    safeSaveMessages(messages);
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Health polling — only while mounted + visible.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let stopped = false;

    async function ping() {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const r = await fetch('/api/chat/health', { cache: 'no-store' });
        const data = await r.json().catch(() => ({ ok: false }));
        if (stopped) return;
        setHealthOk(Boolean(data?.ok));
        setLastHealthAt(Date.now());
      } catch {
        if (stopped) return;
        setHealthOk(false);
        setLastHealthAt(Date.now());
      }
    }

    ping();
    const id = window.setInterval(ping, HEALTH_INTERVAL_MS);
    const onVis = () => {
      if (!document.hidden) ping();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stopped = true;
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Auto-scroll on new content.
  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, interim]);

  // Auto-grow textarea (max 4 rows ~ 96px).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, 96);
    el.style.height = `${next}px`;
  }, [input, interim]);

  // ---------------------------------------------------------------------------
  // Speech recognition setup (lazy).
  // ---------------------------------------------------------------------------
  const speechSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
  }, []);

  const toggleMic = useCallback(() => {
    if (!speechSupported) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Rec = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Rec) return;
    const rec = new Rec();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e: SpeechRecognitionEventLike) => {
      let finalText = '';
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      if (finalText) {
        setInput((prev) => (prev ? `${prev} ${finalText}`.trim() : finalText.trim()));
        setInterim('');
      } else {
        setInterim(interimText);
      }
    };
    rec.onerror = () => {
      setListening(false);
      setInterim('');
    };
    rec.onend = () => {
      setListening(false);
      setInterim('');
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [listening, speechSupported]);

  // Stop recognition on unmount / abort any inflight stream.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      abortRef.current?.abort();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Conversation reset
  // ---------------------------------------------------------------------------
  const newChat = useCallback(() => {
    if (sending) return;
    const fresh = uuid();
    setConversationId(fresh);
    window.localStorage.setItem(STORAGE_CONV_ID, fresh);
    setMessages([]);
    safeSaveMessages([]);
    setPendingFiles([]);
    setInput('');
    setInterim('');
  }, [sending]);

  // ---------------------------------------------------------------------------
  // Sending
  // ---------------------------------------------------------------------------
  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed && pendingFiles.length === 0) return;
    if (sending) return;

    // 1. Upload pending attachments serially. Each POST returns { url, filename }.
    const uploaded: AttachmentRef[] = [];
    if (pendingFiles.length > 0) {
      setUploading(true);
      try {
        for (const f of pendingFiles) {
          const fd = new FormData();
          fd.append('file', f, f.name);
          const r = await fetch('/api/upload', { method: 'POST', body: fd });
          if (!r.ok) throw new Error(`Upload failed: ${r.status}`);
          const data = await r.json();
          if (!data?.url) throw new Error('Upload response missing url');
          uploaded.push({ url: String(data.url), filename: String(data.filename ?? f.name) });
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Upload error';
        setMessages((prev) => [
          ...prev,
          {
            id: uuid(),
            role: 'assistant',
            text: `Attachment upload failed: ${errMsg}`,
            ts: Date.now(),
            error: true,
          },
        ]);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // 2. Append user message + empty streaming assistant message.
    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      text: trimmed,
      ts: Date.now(),
      attachments: uploaded.length ? uploaded : undefined,
    };
    const assistantId = uuid();
    const assistantStub: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      text: '',
      ts: Date.now(),
      streaming: true,
    };
    setMessages((prev) => [...prev, userMsg, assistantStub]);
    setInput('');
    setPendingFiles([]);
    setInterim('');
    setSending(true);

    // 3. Open SSE stream.
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          conversationId,
          message: trimmed,
          attachments: uploaded,
        }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`Chat error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      // Read loop. We use the SSE format documented in the prompt:
      //   data: { "type":"chunk","text":"..." }
      //   <blank line>
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';
        for (const part of parts) {
          // An SSE event can have multiple `data:` lines — join them.
          const lines = part.split('\n').filter((l) => l.startsWith('data: '));
          if (lines.length === 0) continue;
          const payload = lines.map((l) => l.slice(6)).join('\n').trim();
          if (!payload) continue;
          let evt: SSEEvent | null = null;
          try {
            evt = JSON.parse(payload) as SSEEvent;
          } catch {
            // Malformed event — skip rather than break the whole stream.
            continue;
          }
          if (!evt) continue;
          if (evt.type === 'chunk' && evt.text) {
            const chunk = evt.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, text: m.text + chunk } : m,
              ),
            );
          } else if (evt.type === 'done') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      streaming: false,
                      text: evt!.text ?? m.text,
                      ts: Date.now(),
                    }
                  : m,
              ),
            );
          } else if (evt.type === 'error') {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      streaming: false,
                      error: true,
                      text: m.text + (m.text ? '\n\n' : '') +
                        `Error: ${evt!.message ?? 'unknown'}`,
                    }
                  : m,
              ),
            );
          }
        }
      }

      // Stream ended without an explicit `done` event — mark complete.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.streaming
            ? { ...m, streaming: false, ts: Date.now() }
            : m,
        ),
      );
    } catch (err) {
      if (controller.signal.aborted) {
        // Aborted by us (e.g. unmount). Mark as not-streaming, leave text.
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m,
          ),
        );
      } else {
        const errMsg = err instanceof Error ? err.message : 'Network error';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, streaming: false, error: true, text: `Error: ${errMsg}` }
              : m,
          ),
        );
      }
    } finally {
      abortRef.current = null;
      setSending(false);
    }
  }, [conversationId, input, pendingFiles, sending]);

  // Keyboard shortcut: Enter = send, Shift+Enter = newline.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void send();
      }
    },
    [send],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Status dot: green if last health check OK and not stale.
  const statusGreen =
    healthOk &&
    lastHealthAt > 0 &&
    Date.now() - lastHealthAt < HEALTH_STALE_MS + HEALTH_INTERVAL_MS;

  const dotColor = statusGreen ? '#00ff88' : '#ff4466';

  // Collapsed bar — visible only when !open.
  const collapsedBar = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open chat"
      className="fixed z-40 flex items-center justify-between px-4 transition-all active:opacity-80"
      style={{
        height: '48px',
        // mobile: full width above bottom-nav. desktop: floating bottom-right.
        left: '12px',
        right: '12px',
        bottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 8px)',
        backgroundColor: '#13151c',
        border: '1px solid #1e2030',
        borderRadius: '12px',
        color: '#e8eaf0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        touchAction: 'manipulation',
      }}
    >
      <span className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{
            backgroundColor: dotColor,
            boxShadow: statusGreen ? '0 0 6px rgba(0,255,136,0.6)' : 'none',
          }}
        />
        <span
          className="text-[11px] font-mono font-bold uppercase tracking-wider"
          style={{ color: '#3DE8C3' }}
        >
          Chat with Ares
        </span>
      </span>
      <ChevronUp size={16} style={{ color: '#8b92a8' }} />
    </button>
  );

  // We position the collapsed bar differently on desktop via responsive styles.
  // To keep this self-contained without Tailwind arbitrary values for `bottom`,
  // we render two variants and toggle with hidden/md:hidden.
  const collapsedDesktop = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open chat"
      className="hidden md:flex fixed z-40 items-center justify-between px-4 transition-all hover:border-[#3DE8C3]/30"
      style={{
        height: '48px',
        width: '280px',
        right: '24px',
        bottom: '24px',
        backgroundColor: '#13151c',
        border: '1px solid #1e2030',
        borderRadius: '12px',
        color: '#e8eaf0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <span className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{
            backgroundColor: dotColor,
            boxShadow: statusGreen ? '0 0 6px rgba(0,255,136,0.6)' : 'none',
          }}
        />
        <span
          className="text-[11px] font-mono font-bold uppercase tracking-wider"
          style={{ color: '#3DE8C3' }}
        >
          Chat with Ares
        </span>
      </span>
      <ChevronUp size={16} style={{ color: '#8b92a8' }} />
    </button>
  );

  // Header inside the expanded panel.
  const header = (
    <div
      className="flex items-center justify-between px-3 py-2"
      style={{ borderBottom: '1px solid #1e2030', backgroundColor: '#0d0e14' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{
            backgroundColor: dotColor,
            boxShadow: statusGreen ? '0 0 6px rgba(0,255,136,0.6)' : 'none',
          }}
          title={statusGreen ? 'Online' : 'Offline'}
        />
        <span
          className="text-[11px] font-mono font-bold uppercase tracking-wider truncate"
          style={{ color: '#3DE8C3', textShadow: '0 0 8px rgba(61,232,195,0.4)' }}
        >
          Ares · MC Chat
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={newChat}
          disabled={sending}
          aria-label="New chat"
          className="p-1.5 rounded-md transition-colors hover:bg-white/[0.05] disabled:opacity-40"
          style={{ color: '#8b92a8', minHeight: '32px', minWidth: '32px' }}
          title="New chat"
        >
          <RefreshCw size={14} />
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close chat"
          className="p-1.5 rounded-md transition-colors hover:bg-white/[0.05]"
          style={{ color: '#8b92a8', minHeight: '32px', minWidth: '32px' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );

  const messageList = (
    <div
      ref={scrollerRef}
      className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
      style={{ backgroundColor: '#0a0b0f' }}
    >
      {messages.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: '#3DE8C3' }}>
            Ready
          </p>
          <p className="text-[11px]" style={{ color: '#4a4f65' }}>
            Ask Ares anything. Attach files with the paperclip, or press the mic to dictate.
          </p>
        </div>
      )}
      {messages.map((m) => {
        const isUser = m.role === 'user';
        return (
          <div
            key={m.id}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="group max-w-[85%] px-3 py-2 rounded-lg"
              style={{
                backgroundColor: isUser ? 'rgba(61,232,195,0.10)' : '#13151c',
                border: isUser
                  ? '1px solid rgba(61,232,195,0.25)'
                  : '1px solid #1e2030',
                color: m.error ? '#ff4466' : '#e8eaf0',
              }}
              title={formatTime(m.ts)}
            >
              {m.attachments && m.attachments.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-1">
                  {m.attachments.map((a, i) => (
                    <a
                      key={`${m.id}-att-${i}`}
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid #2a2d42',
                        color: '#8b92a8',
                      }}
                    >
                      {a.filename}
                    </a>
                  ))}
                </div>
              )}
              <div
                className={
                  isUser
                    ? 'text-[13px] leading-relaxed whitespace-pre-wrap break-words'
                    : 'text-[13px] leading-relaxed break-words mc-md'
                }
                // Assistant text is rendered with our tiny markdown renderer.
                // User text is plain (already-escaped via React text node).
                {...(isUser
                  ? { children: m.text }
                  : { dangerouslySetInnerHTML: { __html: renderMarkdown(m.text) } })}
              />
              {m.streaming && (
                <span
                  className="inline-block ml-0.5 w-1.5 h-3 align-middle animate-pulse"
                  style={{ backgroundColor: '#3DE8C3' }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const inputRow = (
    <div
      className="flex flex-col gap-1.5 px-3 py-2"
      style={{ borderTop: '1px solid #1e2030', backgroundColor: '#0d0e14' }}
    >
      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pendingFiles.map((f, i) => (
            <span
              key={`pf-${i}`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{
                backgroundColor: 'rgba(61,232,195,0.08)',
                border: '1px solid rgba(61,232,195,0.25)',
                color: '#3DE8C3',
              }}
            >
              {f.name}
              <button
                type="button"
                onClick={() =>
                  setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
                aria-label={`Remove ${f.name}`}
                className="opacity-70 hover:opacity-100"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-end gap-1.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending || uploading}
          aria-label="Attach files"
          className="p-2 rounded-md transition-colors hover:bg-white/[0.05] disabled:opacity-40"
          style={{ color: '#8b92a8', minHeight: '36px', minWidth: '36px' }}
        >
          <Paperclip size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            setPendingFiles((prev) => [...prev, ...Array.from(files)]);
            // Reset so selecting the same file again re-fires onChange.
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={toggleMic}
          disabled={!speechSupported || sending}
          aria-label={listening ? 'Stop dictation' : 'Start dictation'}
          title={
            speechSupported ? 'Dictate' : 'Voice not supported in this browser'
          }
          className="p-2 rounded-md transition-colors hover:bg-white/[0.05] disabled:opacity-40"
          style={{
            color: listening ? '#ff4466' : '#8b92a8',
            minHeight: '36px',
            minWidth: '36px',
            animation: listening ? 'mc-pulse 1.2s ease-in-out infinite' : 'none',
          }}
        >
          <Mic size={16} />
        </button>
        <textarea
          ref={textareaRef}
          value={interim ? `${input}${input ? ' ' : ''}${interim}` : input}
          onChange={(e) => {
            // Interim text is dropped on user typing; final transcript merges
            // into `input` via onresult, so this is safe.
            setInput(e.target.value);
            if (interim) setInterim('');
          }}
          onKeyDown={onKeyDown}
          placeholder={listening ? 'Listening…' : 'Message Ares…'}
          rows={1}
          className="flex-1 resize-none rounded-md px-2.5 py-1.5 text-[13px] outline-none"
          style={{
            backgroundColor: '#0a0b0f',
            border: '1px solid #1e2030',
            color: interim ? '#8b92a8' : '#e8eaf0',
            maxHeight: '96px',
          }}
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending || uploading || (!input.trim() && pendingFiles.length === 0)}
          aria-label="Send message"
          className="p-2 rounded-md transition-colors disabled:opacity-40"
          style={{
            color: '#0a0b0f',
            backgroundColor: '#3DE8C3',
            minHeight: '36px',
            minWidth: '36px',
            boxShadow: '0 0 12px rgba(61,232,195,0.3)',
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );

  // Expanded panel — fullscreen-sheet on mobile, floating card on desktop.
  const expandedMobile = (
    <div
      className="md:hidden fixed z-50 flex flex-col"
      style={{
        left: 0,
        right: 0,
        bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
        height: '70vh',
        backgroundColor: '#0d0e14',
        borderTop: '1px solid #1e2030',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {header}
      {messageList}
      {inputRow}
    </div>
  );

  const expandedDesktop = (
    <div
      className="hidden md:flex fixed z-50 flex-col rounded-xl overflow-hidden"
      style={{
        right: '24px',
        bottom: '24px',
        width: '400px',
        height: '600px',
        backgroundColor: '#0d0e14',
        border: '1px solid #1e2030',
        boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
      }}
    >
      {header}
      {messageList}
      {inputRow}
    </div>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes mc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .mc-inline-code {
          background-color: rgba(255,255,255,0.06);
          border: 1px solid #1e2030;
          border-radius: 4px;
          padding: 0 4px;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px;
        }
        .mc-code-block {
          background-color: #0a0b0f;
          border: 1px solid #1e2030;
          border-radius: 6px;
          padding: 8px 10px;
          margin-top: 6px;
          margin-bottom: 6px;
          overflow-x: auto;
          font-family: var(--font-geist-mono, ui-monospace, monospace);
          font-size: 12px;
          color: #c4c9d9;
          white-space: pre;
        }
        .mc-link {
          color: #3DE8C3;
          text-decoration: underline;
          text-decoration-color: rgba(61,232,195,0.4);
        }
      `}</style>

      {!open && (
        <>
          {/* Mobile collapsed bar */}
          <div className="md:hidden">{collapsedBar}</div>
          {/* Desktop collapsed bar */}
          {collapsedDesktop}
        </>
      )}
      {open && (
        <>
          {expandedMobile}
          {expandedDesktop}
        </>
      )}
    </>
  );
}

export default ChatDock;
