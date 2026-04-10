'use client';

import { FileText } from 'lucide-react';
import { type Document } from '@/lib/data';

const TAG_COLORS: Record<string, string> = {
  'General': '#3DE8C3',
  'Peptide Data Dumps': '#ffaa00',
  'Research Scrubs': '#00ff88',
  'Disclaimers Templates': '#ff44aa',
};

const CATEGORY_COLORS: Record<string, string> = {
  Strategy: '#3DE8C3',
  Product: '#ffaa00',
  Engineering: '#00ff88',
  Marketing: '#ff44aa',
  Research: '#a78bfa',
  Design: '#fb7185',
  Legal: '#8b92a8',
};

function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || '#8b92a8';
}

interface DocumentCardProps {
  doc: Document;
  onClick?: () => void;
}

export function DocumentCard({ doc, onClick }: DocumentCardProps) {
  const primaryTag = doc.tags?.[0] || doc.category;
  const iconColor = TAG_COLORS[primaryTag] || CATEGORY_COLORS[doc.category] || '#8b92a8';

  return (
    <div
      role="button"
      tabIndex={0}
      className="rounded-xl p-5 transition-all duration-200 active:ring-1 active:ring-[#2a2d42] cursor-pointer"
      style={{ backgroundColor: '#13151c', border: '1px solid #1e2030', touchAction: 'manipulation' }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
        >
          <FileText size={18} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>
              {doc.title}
            </h3>
            {/* Tags */}
            <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
              {(doc.tags || [doc.category]).map((tag) => {
                const color = getTagColor(tag);
                return (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ color, backgroundColor: `${color}18` }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#8b92a8' }}>
            {doc.summary}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: '#4a4f65' }}>
              {doc.wordCount.toLocaleString()} words
            </span>
            <span className="text-xs" style={{ color: '#4a4f65' }}>·</span>
            <span className="text-xs" style={{ color: '#4a4f65' }}>
              Updated {new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {doc.agent && (
              <>
                <span className="text-xs" style={{ color: '#4a4f65' }}>·</span>
                <span className="text-xs" style={{ color: '#4a4f65' }}>{doc.agent}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
