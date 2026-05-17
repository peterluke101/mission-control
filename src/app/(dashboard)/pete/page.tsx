'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/lib/store';
import { DocumentCard } from '@/components/document-card';
import { DocumentModal } from '@/components/document-modal';
import {
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Send,
  FileText,
  ListChecks,
  Check,
  Trash2,
  Zap,
  FolderKanban,
  Square,
  CheckSquare as CheckSquareFilled,
  Edit2,
  X,
} from 'lucide-react';

// ── X / Twitter Draft Posts (hardcoded Buffer queue) ────────────────────────
const xDrafts = [
  {
    id: 'xd-1',
    text: `Most people think peptides are just for bodybuilders.\n\nThey\u2019re missing the bigger picture.\n\nPeptides are being studied for:\n\u2192 Cognitive performance\n\u2192 Sleep optimization\n\u2192 Gut repair\n\u2192 Skin regeneration\n\u2192 Fat metabolism\n\nThe research is 10 years ahead of public awareness.`,
  },
  {
    id: 'xd-2',
    text: `BPC-157 might be the most studied peptide you\u2019ve never heard of.\n\n1,000+ research papers.\nStudied for gut healing, tendon repair, and neuroprotection.\n\nYet most doctors have never mentioned it.\n\nWe built an entire chapter breaking down every protocol.\n\nPeptide Compass drops soon. \ud83e\uddec`,
  },
  {
    id: 'xd-3',
    text: `The difference between someone who \u201ctakes peptides\u201d and someone who gets results?\n\nProtocol design.\n\nTiming. Dosing. Stacking. Cycling.\n\nMost guides skip this. We didn\u2019t.\n\nPeptide Compass \u2014 17 peptides, full protocols, zero fluff.`,
  },
  {
    id: 'xd-4',
    text: `Retatrutide is being called \u201cthe triple threat.\u201d\n\nGLP-1 + GIP + Glucagon receptor agonist.\n\nPhase 3 results: 28.7% body weight reduction.\n\nThat\u2019s not a typo.\n\nWe broke down every trial, every mechanism, every implication in Peptide Compass.`,
  },
  {
    id: 'xd-5',
    text: `I asked my AI team to research every peptide worth knowing about.\n\n6 months later, we have:\n\u2022 17 deep-dive peptide profiles\n\u2022 100+ protocols\n\u2022 200+ citations\n\u2022 14 chapters\n\nAll in one guide. $37.\n\nPeptide Compass is almost ready. \ud83e\udded`,
  },
  {
    id: 'xd-6',
    text: `Hot take: the peptide space in 2026 looks like crypto in 2017.\n\nEarly. Misunderstood. Full of noise.\n\nBut the signal is there if you know where to look.\n\nWe spent months filtering signal from noise.\n\nThe result? Peptide Compass \u2014 shipping this month.`,
  },
];

// ── Projects ────────────────────────────────────────────────────────────────
type ProjectStatus = 'In Progress' | 'Blocked' | 'Complete';

interface ProjectItem {
  id: string;
  task: string;
  owner: string;
}

interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  totalTasks: number;
  items: ProjectItem[];
}

const projects: Project[] = [
  {
    id: 'proj-mc',
    name: 'Mission Control',
    status: 'In Progress',
    totalTasks: 8,
    items: [
      { id: 'mc-1', task: 'Pete formally reviews and approves MC', owner: 'Pete' },
      { id: 'mc-2', task: 'Pete approves tagline for Peptide Compass (separate but linked)', owner: 'Pete' },
    ],
  },
  {
    id: 'proj-pc',
    name: 'Peptide Compass (The Product)',
    status: 'In Progress',
    totalTasks: 12,
    items: [
      { id: 'pc-1', task: 'Pete reviews cover mockup + approves tagline + design direction', owner: 'Pete' },
      { id: 'pc-2', task: 'Build full PDF layout system / sample pages', owner: 'Ares' },
      { id: 'pc-3', task: 'Build PDF generation pipeline', owner: 'Ares' },
      { id: 'pc-4', task: 'Pete final approval on all content', owner: 'Pete' },
      { id: 'pc-5', task: 'Gumroad listing setup', owner: 'Ares' },
      { id: 'pc-6', task: 'Launch', owner: 'Pete' },
    ],
  },
  {
    id: 'proj-upwork',
    name: 'Upwork Freelancing',
    status: 'Blocked',
    totalTasks: 6,
    items: [
      { id: 'uw-1', task: 'Pete completes Upwork identity verification (BLOCKER)', owner: 'Pete' },
      { id: 'uw-2', task: 'Define Problem-Hunt Keywords', owner: 'Pete' },
      { id: 'uw-3', task: 'Submit more proposals once verified', owner: 'Pete' },
    ],
  },
  {
    id: 'proj-x',
    name: '@PeptideCompass X Account',
    status: 'In Progress',
    totalTasks: 7,
    items: [
      { id: 'xa-1', task: 'Pete reviews and schedules Buffer drafts', owner: 'Pete' },
      { id: 'xa-2', task: 'Add images to all posts (from image research file on Desktop)', owner: 'Ares' },
      { id: 'xa-3', task: 'Build follower base to 1K', owner: 'Pete' },
    ],
  },
];

const statusBadgeStyle: Record<ProjectStatus, { bg: string; color: string; border: string }> = {
  'In Progress': { bg: 'rgba(61,232,195,0.12)', color: '#3DE8C3', border: 'rgba(61,232,195,0.3)' },
  Blocked: { bg: 'rgba(255,80,80,0.12)', color: '#ff5050', border: 'rgba(255,80,80,0.3)' },
  Complete: { bg: 'rgba(0,255,136,0.12)', color: '#00ff88', border: 'rgba(0,255,136,0.3)' },
};

// ── Collapsible Section ─────────────────────────────────────────────────────
function Section({
  title,
  icon: Icon,
  count,
  defaultOpen = true,
  accentColor = '#3DE8C3',
  children,
}: {
  title: string;
  icon: React.ElementType;
  count?: number;
  defaultOpen?: boolean;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#0d0e14', border: `1px solid ${accentColor}30` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.02]"
        style={{ touchAction: 'manipulation', minHeight: '48px' }}
      >
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color: accentColor }} />
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: accentColor, textShadow: `0 0 10px ${accentColor}40` }}
          >
            {title}
          </span>
          {count !== undefined && count > 0 && (
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {count}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp size={14} style={{ color: '#4a4f65' }} />
        ) : (
          <ChevronDown size={14} style={{ color: '#4a4f65' }} />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4" style={{ borderTop: `1px solid ${accentColor}15` }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function PetePage() {
  const { approvals, setApprovalStatus, documents, setSelectedDoc, selectedDocId, peteTasks, completePeteTask, tasks } =
    useAppStore();

  // ── Approval Queue ──
  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const nonPendingApprovals = approvals.filter((a) => a.status !== 'PENDING');

  // ── Approval confirmation flash ──
  const [approvalFlash, setApprovalFlash] = useState<Record<string, 'APPROVED' | 'CHANGES_REQUESTED'>>({});
  const handleApproval = (id: string, status: 'APPROVED' | 'CHANGES_REQUESTED') => {
    setApprovalFlash((prev) => ({ ...prev, [id]: status }));
    setTimeout(() => {
      setApprovalStatus(id, status);
      setApprovalFlash((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 1200);
  };

  // ── Project Checklist (localStorage) ──
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const saved = localStorage.getItem('mc-project-checked');
    if (saved) setCheckedItems(JSON.parse(saved));
  }, []);
  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      localStorage.setItem('mc-project-checked', JSON.stringify(next));
      return next;
    });
  };

  // ── X Drafts (localStorage) ──
  const [draftQueuing, setDraftQueuing] = useState<Record<string, boolean>>({});
  const [draftStatuses, setDraftStatuses] = useState<Record<string, 'approved' | 'discarded'>>({});
  useEffect(() => {
    const saved = localStorage.getItem('mc-x-draft-statuses');
    if (saved) setDraftStatuses(JSON.parse(saved));
  }, []);
  const saveDraftStatus = (id: string, status: 'approved' | 'discarded') => {
    setDraftStatuses((prev) => {
      const next = { ...prev, [id]: status };
      localStorage.setItem('mc-x-draft-statuses', JSON.stringify(next));
      return next;
    });
  };

  // ── X Drafts Editing ──
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mc-x-draft-edits');
    if (saved) setDraftEdits(JSON.parse(saved));
  }, []);

  const startEditing = (draft: { id: string; text: string }) => {
    setEditingDraftId(draft.id);
    setEditText(draftEdits[draft.id] ?? draft.text);
  };

  const cancelEditing = () => {
    setEditingDraftId(null);
    setEditText('');
  };

  const saveEdit = (id: string) => {
    setDraftEdits((prev) => {
      const next = { ...prev, [id]: editText };
      localStorage.setItem('mc-x-draft-edits', JSON.stringify(next));
      return next;
    });
    setEditingDraftId(null);
    setEditText('');
  };

  // Auto-resize textarea
  useEffect(() => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = 'auto';
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + 'px';
    }
  }, [editText]);

  // ── Document Modal ──
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;

  // ── Pete Tasks (action items) ──
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const activePeteTasks = peteTasks.filter((t) => !t.completed && !completingIds.has(t.id));

  const doComplete = useCallback(
    (id: string) => {
      setCompletingIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        completePeteTask(id);
        setCompletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 600);
    },
    [completePeteTask]
  );

  // ── Pete's Kanban Tasks ──
  const peteBoardTasks = tasks.filter(
    (t) =>
      t.assignee === 'Pete' ||
      t.assignee === 'Ares' // Ares reports to Pete
  );

  const priorityColor: Record<string, { bg: string; text: string; border: string }> = {
    Critical: { bg: 'rgba(255,50,50,0.12)', text: '#ff5050', border: 'rgba(255,50,50,0.3)' },
    High: { bg: 'rgba(255,170,0,0.12)', text: '#ffaa00', border: 'rgba(255,170,0,0.3)' },
    Medium: { bg: 'rgba(61,232,195,0.12)', text: '#3DE8C3', border: 'rgba(61,232,195,0.3)' },
    Low: { bg: 'rgba(74,79,101,0.3)', text: '#8b92a8', border: 'rgba(74,79,101,0.4)' },
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(61,232,195,0.12)',
              border: '1px solid rgba(61,232,195,0.3)',
              boxShadow: '0 0 15px rgba(61,232,195,0.2)',
            }}
          >
            <Zap size={16} style={{ color: '#3DE8C3' }} />
          </div>
          <div>
            <h1
              className="text-sm font-mono font-bold tracking-[0.15em] uppercase"
              style={{ color: '#3DE8C3', textShadow: '0 0 10px rgba(61,232,195,0.4)' }}
            >
              Pete&apos;s Command Center
            </h1>
            <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#4a4f65' }}>
              Approvals · Drafts · Docs · Tasks — all in one place
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs"
          style={{ backgroundColor: 'rgba(61,232,195,0.05)', border: '1px solid rgba(61,232,195,0.15)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#00ff88', animation: 'pulse 2s infinite' }}
          />
          <span className="font-mono text-[10px]" style={{ color: '#3DE8C3' }}>
            ONLINE
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-4">
        {/* ─── 1. APPROVAL QUEUE ─────────────────────────────────────── */}
        <Section title="Approval Queue" icon={CheckSquare} count={pendingApprovals.length} accentColor="#ffaa00">
          {pendingApprovals.length === 0 && nonPendingApprovals.length === 0 ? (
            <div className="rounded-lg py-6 flex items-center justify-center" style={{ border: '1px dashed #1e2030' }}>
              <span className="text-sm" style={{ color: '#00ff88' }}>
                All caught up — nothing to approve
              </span>
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {pendingApprovals.map((item) => {
                const flash = approvalFlash[item.id];
                if (flash) {
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg p-4 flex items-center justify-center"
                      style={{
                        backgroundColor: flash === 'APPROVED' ? 'rgba(0,255,136,0.08)' : 'rgba(255,80,80,0.08)',
                        border: `1px solid ${flash === 'APPROVED' ? 'rgba(0,255,136,0.3)' : 'rgba(255,80,80,0.3)'}`,
                        minHeight: '80px',
                        animation: 'approvalFlash 1.2s ease-out',
                      }}
                    >
                      <span
                        className="text-sm font-bold flex items-center gap-2"
                        style={{
                          color: flash === 'APPROVED' ? '#00ff88' : '#ff5050',
                          textShadow: `0 0 12px ${flash === 'APPROVED' ? 'rgba(0,255,136,0.6)' : 'rgba(255,80,80,0.6)'}`,
                        }}
                      >
                        {flash === 'APPROVED' ? '✅ Approved!' : '❌ Rejected'}
                        <span className="text-xs font-normal opacity-70">— {item.title}</span>
                      </span>
                    </div>
                  );
                }
                return (
                  <div
                    key={item.id}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
                          {item.title}
                        </h3>
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: '#4a4f65' }}>
                          {item.category} · Assigned to {item.assignedTo}
                        </p>
                      </div>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          backgroundColor: 'rgba(255,170,0,0.12)',
                          color: '#ffaa00',
                          border: '1px solid rgba(255,170,0,0.25)',
                        }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: '#8b92a8' }}>
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproval(item.id, 'APPROVED')}
                        className="text-sm font-bold px-4 py-2.5 rounded-lg active:scale-95 transition-transform"
                        style={{
                          backgroundColor: 'rgba(0,255,136,0.15)',
                          color: '#00ff88',
                          border: '1px solid rgba(0,255,136,0.35)',
                          textShadow: '0 0 8px rgba(0,255,136,0.4)',
                          touchAction: 'manipulation',
                          minHeight: '44px',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleApproval(item.id, 'CHANGES_REQUESTED')}
                        className="text-sm font-bold px-4 py-2.5 rounded-lg active:scale-95 transition-transform"
                        style={{
                          backgroundColor: 'rgba(255,80,80,0.12)',
                          color: '#ff5050',
                          border: '1px solid rgba(255,80,80,0.3)',
                          textShadow: '0 0 8px rgba(255,80,80,0.4)',
                          touchAction: 'manipulation',
                          minHeight: '44px',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* Show already-decided approvals with status badges */}
              {nonPendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: '#13151c',
                    border: `1px solid ${item.status === 'APPROVED' ? 'rgba(0,255,136,0.2)' : 'rgba(255,80,80,0.2)'}`,
                    opacity: 0.65,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold" style={{ color: '#8b92a8' }}>
                          {item.title}
                        </h3>
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            backgroundColor: item.status === 'APPROVED' ? 'rgba(0,255,136,0.15)' : 'rgba(255,80,80,0.12)',
                            color: item.status === 'APPROVED' ? '#00ff88' : '#ff5050',
                            border: `1px solid ${item.status === 'APPROVED' ? 'rgba(0,255,136,0.35)' : 'rgba(255,80,80,0.3)'}`,
                          }}
                        >
                          {item.status === 'APPROVED' ? '✓ APPROVED' : 'CHANGES REQUESTED'}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: '#4a4f65' }}>
                        {item.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ─── 2. PROJECTS ──────────────────────────────────────────── */}
        <Section title="Projects" icon={FolderKanban} count={projects.length} accentColor="#3DE8C3">
          <div className="space-y-3 mt-3">
            {projects.map((project) => {
              const uncheckedItems = project.items.filter((i) => !checkedItems[i.id]);
              const checkedCount = project.items.length - uncheckedItems.length;
              const completedTotal = (project.totalTasks - project.items.length) + checkedCount;
              const pct = Math.round((completedTotal / project.totalTasks) * 100);
              const effectiveStatus: ProjectStatus =
                pct === 100 ? 'Complete' : project.status;
              const badge = statusBadgeStyle[effectiveStatus];

              return (
                <div
                  key={project.id}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
                >
                  {/* Name + Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
                          {project.name}
                        </h3>
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                        >
                          {effectiveStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar — HUD Style */}
                  <div className="mb-3 hud-bar-container">
                    <div className="flex items-center justify-between mb-1">
                      <span className="hud-label">
                        {pct > 0 ? 'PROGRESS....' : 'PROGRESS'}
                      </span>
                      <span className="text-[10px] hud-pct">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-[6px] hud-bar-track">
                      <div
                        className="h-full hud-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Remaining Checklist */}
                  {uncheckedItems.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#4a4f65' }}>
                        What&apos;s left before launch
                      </span>
                      <div className="mt-2 space-y-2">
                        {uncheckedItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-start gap-2.5 text-left group"
                            style={{ touchAction: 'manipulation', minHeight: '44px', WebkitTapHighlightColor: 'transparent' }}
                          >
                            <Square
                              size={14}
                              className="flex-shrink-0 mt-0.5 transition-colors"
                              style={{ color: '#4a4f65' }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs leading-relaxed" style={{ color: '#c0c4d6' }}>
                                {item.task}
                              </p>
                              <p className="text-[10px] font-mono mt-0.5" style={{ color: '#4a4f65' }}>
                                {item.owner}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {uncheckedItems.length === 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <Check size={14} style={{ color: '#00ff88' }} />
                      <span className="text-xs font-bold" style={{ color: '#00ff88' }}>
                        All tasks complete
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─── 3. X / TWITTER POST DRAFTS ────────────────────────────── */}
        <Section title="X / Twitter Drafts" icon={Send} count={xDrafts.filter((d) => !draftStatuses[d.id]).length} accentColor="#1d9bf0">
          <div className="space-y-3 mt-3">
            {xDrafts.map((draft) => {
              const status = draftStatuses[draft.id];
              const isEditing = editingDraftId === draft.id;
              const displayText = draftEdits[draft.id] ?? draft.text;
              return (
                <div
                  key={draft.id}
                  className="rounded-lg p-4 relative"
                  style={{
                    backgroundColor: '#13151c',
                    border: status === 'approved'
                      ? '1px solid rgba(0,255,136,0.3)'
                      : status === 'discarded'
                      ? '1px solid rgba(255,80,80,0.2)'
                      : '1px solid #1e2030',
                    opacity: status === 'discarded' ? 0.4 : 1,
                  }}
                >
                  {/* Edit / Save+Cancel icon in top-right */}
                  {!status && (
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(draft.id)}
                            aria-label="Save edit"
                            className="flex items-center justify-center rounded-md active:scale-90 transition-all"
                            style={{
                              width: '44px',
                              height: '44px',
                              padding: '10px',
                              color: '#4a4f65',
                              touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'transparent',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#00ff88')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4f65')}
                          >
                            <Check size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            aria-label="Cancel edit"
                            className="flex items-center justify-center rounded-md active:scale-90 transition-all"
                            style={{
                              width: '44px',
                              height: '44px',
                              padding: '10px',
                              color: '#4a4f65',
                              touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'transparent',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ff5050')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#4a4f65')}
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(draft)}
                          aria-label="Edit draft"
                          className="flex items-center justify-center rounded-md active:scale-90 transition-all"
                          style={{
                            width: '44px',
                            height: '44px',
                            padding: '14px',
                            color: '#4a4f65',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#3DE8C3';
                            e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(61,232,195,0.5))';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#4a4f65';
                            e.currentTarget.style.filter = 'none';
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </div>
                  )}

                  {isEditing ? (
                    <div className="pr-20">
                      <div className="relative">
                        <textarea
                          ref={editTextareaRef}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full text-sm leading-relaxed rounded-lg p-3 resize-none outline-none"
                          style={{
                            backgroundColor: '#0d0f1a',
                            color: '#c0c4d6',
                            border: '1px solid #1e2030',
                            minHeight: '80px',
                            overflow: 'hidden',
                            fontSize: '16px',
                            WebkitAppearance: 'none',
                            touchAction: 'manipulation',
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(61,232,195,0.5)')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#1e2030')}
                          autoFocus
                        />
                        <span
                          className="absolute bottom-2 right-3 text-[10px] font-mono select-none pointer-events-none"
                          style={{ color: editText.length > 280 ? '#ff5050' : '#3a3f55' }}
                        >
                          {editText.length}/280
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p
                        className="text-sm leading-relaxed whitespace-pre-line pr-10"
                        style={{ color: status === 'discarded' ? '#4a4f65' : '#c0c4d6' }}
                      >
                        {displayText}
                      </p>
                      {status === 'approved' ? (
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg mt-3"
                          style={{
                            backgroundColor: 'rgba(0,255,136,0.12)',
                            color: '#00ff88',
                            border: '1px solid rgba(0,255,136,0.3)',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                          Queued for Buffer
                        </span>
                      ) : status === 'discarded' ? (
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg mt-3"
                          style={{
                            backgroundColor: 'rgba(255,80,80,0.08)',
                            color: '#ff5050',
                            border: '1px solid rgba(255,80,80,0.2)',
                          }}
                        >
                          <Trash2 size={12} />
                          Discarded
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => {
                              const postText = draftEdits[draft.id] ?? draft.text;
                              // Optimistic: show queuing immediately
                              setDraftQueuing((prev) => ({ ...prev, [draft.id]: true }));
                              // Mark as approved after brief visual feedback
                              setTimeout(() => {
                                saveDraftStatus(draft.id, 'approved');
                                setDraftQueuing((prev) => {
                                  const next = { ...prev };
                                  delete next[draft.id];
                                  return next;
                                });
                              }, 800);
                              fetch('/api/buffer-draft', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ text: postText, id: draft.id }),
                              }).catch(() => {}); // fire and forget
                            }}
                            disabled={!!draftQueuing[draft.id]}
                            className="text-sm font-bold px-4 py-2.5 rounded-lg active:scale-95 transition-all"
                            style={{
                              backgroundColor: draftQueuing[draft.id] ? 'rgba(0,255,136,0.25)' : 'rgba(0,255,136,0.15)',
                              color: '#00ff88',
                              border: '1px solid rgba(0,255,136,0.35)',
                              touchAction: 'manipulation',
                              minHeight: '44px',
                              WebkitTapHighlightColor: 'transparent',
                              boxShadow: draftQueuing[draft.id] ? '0 0 16px rgba(0,255,136,0.3)' : 'none',
                            }}
                          >
                            {draftQueuing[draft.id] ? '⏳ Queuing...' : '✅ Approve to Post'}
                          </button>
                          <button
                            onClick={() => saveDraftStatus(draft.id, 'discarded')}
                            className="text-sm font-bold px-4 py-2.5 rounded-lg active:scale-95 transition-transform"
                            style={{
                              backgroundColor: 'rgba(255,80,80,0.08)',
                              color: '#ff5050',
                              border: '1px solid rgba(255,80,80,0.2)',
                              touchAction: 'manipulation',
                              minHeight: '44px',
                              WebkitTapHighlightColor: 'transparent',
                            }}
                          >
                            Discard
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─── 4. DOCUMENTS VIEWER ───────────────────────────────────── */}
        <Section title="Documents" icon={FileText} count={documents.length} accentColor="#3DE8C3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onClick={() => { console.log('[Pete] Document clicked:', doc.id, doc.title); setSelectedDoc(doc.id); }} />
            ))}
          </div>
        </Section>

        {/* ─── 5. PETE TASKS ─────────────────────────────────────────── */}
        <Section
          title="Pete Tasks"
          icon={ListChecks}
          count={activePeteTasks.length + peteBoardTasks.filter((t) => t.status !== 'Done').length}
          accentColor="#00ff88"
        >
          {/* Action Items */}
          {activePeteTasks.length > 0 && (
            <div className="space-y-3 mt-3">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#4a4f65' }}>
                Action Items
              </span>
              {activePeteTasks.map((task) => {
                const isCompleting = completingIds.has(task.id);
                return (
                  <div
                    key={task.id}
                    className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    style={{
                      backgroundColor: '#13151c',
                      border: '1px solid #1e2030',
                      opacity: isCompleting ? 0.4 : 1,
                      transform: isCompleting ? 'translateX(20px)' : 'translateX(0)',
                      transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1" style={{ color: '#e8eaf0' }}>
                        {task.title}
                      </p>
                      <p className="text-xs" style={{ color: '#8b92a8' }}>
                        {task.description}
                      </p>
                    </div>
                    {isCompleting ? (
                      <span
                        className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                        style={{
                          backgroundColor: '#00ff8830',
                          color: '#00ff88',
                          border: '1px solid #00ff8860',
                          minHeight: '48px',
                          animation: 'greenFlash 600ms ease-out',
                        }}
                      >
                        <Check size={16} strokeWidth={3} />
                        DONE
                      </span>
                    ) : (
                      <button
                        onClick={() => doComplete(task.id)}
                        className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-lg active:scale-95"
                        style={{
                          backgroundColor:
                            task.actionType === 'APPROVE' ? '#00ff8820' : '#ffaa0020',
                          color: task.actionType === 'APPROVE' ? '#00ff88' : '#ffaa00',
                          border: `1px solid ${task.actionType === 'APPROVE' ? '#00ff8860' : '#ffaa0060'}`,
                          touchAction: 'manipulation',
                          minHeight: '48px',
                          transition: 'transform 150ms ease',
                        }}
                      >
                        {task.actionType === 'APPROVE' ? 'APPROVE' : 'MARK DONE'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Board Tasks */}
          {peteBoardTasks.length > 0 && (
            <div className="space-y-3 mt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#4a4f65' }}>
                Assigned Tasks
              </span>
              {peteBoardTasks.map((task) => {
                const pc = priorityColor[task.priority] || priorityColor.Low;
                const isDone = task.status === 'Done';
                return (
                  <div
                    key={task.id}
                    className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    style={{
                      backgroundColor: '#13151c',
                      border: '1px solid #1e2030',
                      opacity: isDone ? 0.5 : 1,
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`text-sm font-semibold ${isDone ? 'line-through' : ''}`}
                          style={{ color: isDone ? '#4a4f65' : '#e8eaf0' }}
                        >
                          {task.title}
                        </p>
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#8b92a8' }}>
                        {task.description}
                      </p>
                      <p className="text-[10px] font-mono mt-1" style={{ color: '#4a4f65' }}>
                        {task.assignee} · {task.status}
                        {task.dueDate && ` · Due ${task.dueDate}`}
                      </p>
                    </div>
                    {!isDone && (
                      <button
                        onClick={() => useAppStore.getState().moveTask(task.id, 'Done')}
                        className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-lg active:scale-95"
                        style={{
                          backgroundColor: '#00ff8820',
                          color: '#00ff88',
                          border: '1px solid #00ff8860',
                          touchAction: 'manipulation',
                          minHeight: '48px',
                          transition: 'transform 150ms ease',
                        }}
                      >
                        Done
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activePeteTasks.length === 0 && peteBoardTasks.length === 0 && (
            <div className="rounded-lg py-6 flex items-center justify-center mt-3" style={{ border: '1px dashed #1e2030' }}>
              <span className="text-sm" style={{ color: '#00ff88' }}>
                All tasks complete
              </span>
            </div>
          )}
        </Section>
      </div>

      {/* Document Modal — portal to body so it escapes overflow / stacking contexts */}
      {selectedDoc && createPortal(
        <DocumentModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />,
        document.body
      )}
    </div>
  );
}
