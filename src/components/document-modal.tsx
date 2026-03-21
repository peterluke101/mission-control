'use client';

import { useEffect, useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';
import { type Document } from '@/lib/data';

const TAG_COLORS: Record<string, string> = {
  'General': '#00d4ff',
  'Peptide Data Dumps': '#ffaa00',
  'Research Scrubs': '#00ff88',
  'Disclaimers Templates': '#ff44aa',
};

function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || '#8b92a8';
}

interface DocumentModalProps {
  doc: Document;
  onClose: () => void;
}

export function DocumentModal({ doc, onClose }: DocumentModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleCopy = async () => {
    const text = `${doc.title}\n\n${doc.content || doc.summary}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(doc.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#13151c',
          border: '1px solid #2a2d42',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid #1e2030' }}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                backgroundColor: `${getTagColor(doc.tags[0] || '')}18`,
                border: `1px solid ${getTagColor(doc.tags[0] || '')}30`,
              }}
            >
              <FileText size={18} style={{ color: getTagColor(doc.tags[0] || '') }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold leading-snug" style={{ color: '#e8eaf0' }}>
                {doc.title}
              </h2>
              <p className="text-xs mt-1" style={{ color: '#4a4f65' }}>
                Last updated {formattedDate}
                {doc.agent && (
                  <> · <span style={{ color: '#8b92a8' }}>{doc.agent}</span></>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 rounded-lg transition-colors hover:bg-white/5 flex-shrink-0"
            style={{ color: '#4a4f65' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tags */}
        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-6 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1e2030' }}>
            {doc.tags.map((tag) => {
              const color = getTagColor(tag);
              return (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm leading-relaxed" style={{ color: '#c0c4d6' }}>
            {doc.content || doc.summary}
          </p>
          <div className="mt-5 pt-4 flex items-center gap-4" style={{ borderTop: '1px solid #1e2030' }}>
            <span className="text-xs" style={{ color: '#4a4f65' }}>
              {doc.wordCount.toLocaleString()} words
            </span>
            <span className="text-xs" style={{ color: '#4a4f65' }}>·</span>
            <span className="text-xs" style={{ color: '#4a4f65' }}>
              {doc.category}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid #1e2030' }}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            style={{
              color: copied ? '#00ff88' : '#00d4ff',
              border: `1px solid ${copied ? 'rgba(0,255,136,0.3)' : 'rgba(0,212,255,0.3)'}`,
              backgroundColor: copied ? 'rgba(0,255,136,0.08)' : 'rgba(0,212,255,0.08)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
