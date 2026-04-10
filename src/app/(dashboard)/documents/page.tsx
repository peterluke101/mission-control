'use client';

import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DocumentCard } from '@/components/document-card';
import { DocumentModal } from '@/components/document-modal';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'az', label: 'A–Z' },
  { value: 'relevance', label: 'Relevance' },
] as const;

export default function DocumentsPage() {
  const {
    documents,
    docSearch,
    docActiveTags,
    docSort,
    selectedDocId,
    setDocSearch,
    toggleDocTag,
    clearDocTags,
    setDocSort,
    setSelectedDoc,
  } = useAppStore();

  // Derive all unique tags from documents
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach((d) => (d.tags || []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [documents]);

  // Filter + sort
  const filteredDocs = useMemo(() => {
    const q = docSearch.trim().toLowerCase();

    let result = documents.filter((doc) => {
      // Text search
      if (q) {
        const haystack = [
          doc.title,
          doc.summary,
          doc.content || '',
          ...(doc.tags || []),
          doc.agent || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Tag filter (OR logic)
      if (docActiveTags.length > 0) {
        const docTags = doc.tags || [];
        if (!docActiveTags.some((activeTag) => docTags.includes(activeTag))) return false;
      }

      return true;
    });

    // Sort
    const sort = q && docSort === 'latest' ? 'relevance' : docSort;
    switch (sort) {
      case 'oldest':
        result = [...result].sort(
          (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
        break;
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
        if (q) {
          result = [...result].sort((a, b) => {
            const scoreA = a.title.toLowerCase().includes(q) ? 2 : 1;
            const scoreB = b.title.toLowerCase().includes(q) ? 2 : 1;
            return scoreB - scoreA;
          });
        }
        break;
      case 'latest':
      default:
        result = [...result].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return result;
  }, [documents, docSearch, docActiveTags, docSort]);

  const selectedDoc = selectedDocId ? documents.find((d) => d.id === selectedDocId) : null;

  const hasActiveFilters = docSearch.trim() || docActiveTags.length > 0;

  const resetAll = () => {
    setDocSearch('');
    clearDocTags();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Documents</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>
            Showing {filteredDocs.length} of {documents.length} documents
          </p>
        </div>
        <button
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 active:bg-[#3DE8C3]/10 font-medium"
          style={{ color: '#3DE8C3', border: '1px solid rgba(61,232,195,0.3)', touchAction: 'manipulation', minHeight: '44px' }}
        >
          + New Doc
        </button>
      </div>

      {/* Search + Controls */}
      <div className="flex-shrink-0 px-4 md:px-6 pt-3 md:pt-4 pb-3 space-y-3" style={{ borderBottom: '1px solid #1e2030' }}>
        {/* Search row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#4a4f65' }}
            />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full text-sm pl-9 pr-9 py-2 rounded-lg outline-none transition-all duration-200"
              style={{
                backgroundColor: '#0d0f16',
                border: '1px solid #1e2030',
                color: '#e8eaf0',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(61,232,195,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#1e2030')}
            />
            {docSearch && (
              <button
                onClick={() => setDocSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ color: '#4a4f65', touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          {/* Sort dropdown */}
          <select
            value={docSort}
            onChange={(e) => setDocSort(e.target.value as typeof docSort)}
            className="text-xs px-3 py-2 rounded-lg outline-none cursor-pointer"
            style={{
              backgroundColor: '#0d0f16',
              border: '1px solid #1e2030',
              color: '#8b92a8',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetAll}
            className="text-xs px-3 py-1 rounded-full transition-all duration-150 font-medium active:scale-95"
            style={{
              ...(docActiveTags.length === 0 && !docSearch
                ? { backgroundColor: 'rgba(61,232,195,0.15)', color: '#3DE8C3', border: '1px solid rgba(61,232,195,0.4)' }
                : { backgroundColor: '#1e2030', color: '#4a4f65', border: '1px solid #2a2d42' }),
              touchAction: 'manipulation',
              minHeight: '44px',
            }}
          >
            All
          </button>
          {allTags.map((tag) => {
            const active = docActiveTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleDocTag(tag)}
                className="text-xs px-3 py-1 rounded-full transition-all duration-150 font-medium active:scale-95"
                style={{
                  ...(active
                    ? { backgroundColor: 'rgba(61,232,195,0.15)', color: '#3DE8C3', border: '1px solid rgba(61,232,195,0.4)' }
                    : { backgroundColor: '#1e2030', color: '#4a4f65', border: '1px solid #2a2d42' }),
                  touchAction: 'manipulation',
                  minHeight: '44px',
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: '#1e2030' }}
            >
              <Search size={22} style={{ color: '#4a4f65' }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#8b92a8' }}>
              No documents match your search.
            </p>
            <p className="text-xs mb-5" style={{ color: '#4a4f65' }}>
              Try a different keyword or clear your filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetAll}
                className="text-xs px-4 py-2 rounded-lg transition-all duration-200 font-medium active:scale-95"
                style={{
                  color: '#3DE8C3',
                  border: '1px solid rgba(61,232,195,0.3)',
                  backgroundColor: 'rgba(61,232,195,0.08)',
                  touchAction: 'manipulation',
                  minHeight: '44px',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onClick={() => setSelectedDoc(doc.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedDoc && (
        <DocumentModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}
    </div>
  );
}
