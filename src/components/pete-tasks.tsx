'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronDown, ChevronUp, Trash2, Check } from 'lucide-react';

export function PeteTasks() {
  const peteTasks = useAppStore((s) => s.peteTasks);
  const completePeteTask = useAppStore((s) => s.completePeteTask);
  const clearCompletedPeteTasks = useAppStore((s) => s.clearCompletedPeteTasks);
  const [completedOpen, setCompletedOpen] = useState(false);

  // Confirmation modal state for APPROVE tasks
  const [confirmTaskId, setConfirmTaskId] = useState<string | null>(null);
  const confirmTask = peteTasks.find((t) => t.id === confirmTaskId);

  // Track tasks in "completing" animation state
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());

  // Track IDs that were just moved to completed (for slide-in animation)
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<Set<string>>(new Set());

  // Auto-expand completed section when new items are added
  const prevCompletedCount = useRef(0);
  const completedTasks = peteTasks.filter((t) => t.completed);
  const activeTasks = peteTasks.filter((t) => !t.completed && !completingIds.has(t.id));

  useEffect(() => {
    if (completedTasks.length > prevCompletedCount.current && completedTasks.length > 0) {
      setCompletedOpen(true);
    }
    prevCompletedCount.current = completedTasks.length;
  }, [completedTasks.length]);

  const doComplete = useCallback(
    (id: string) => {
      // Add to completing set (shows DONE ✓ with green flash)
      setCompletingIds((prev) => new Set(prev).add(id));

      // After the flash animation, actually complete and move to completed section
      setTimeout(() => {
        completePeteTask(id);
        setCompletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setRecentlyCompletedIds((prev) => new Set(prev).add(id));
        // Clear the slide-in animation flag after it plays
        setTimeout(() => {
          setRecentlyCompletedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 500);
      }, 600);
    },
    [completePeteTask]
  );

  const handleApproveClick = useCallback((id: string) => {
    setConfirmTaskId(id);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmTaskId) {
      doComplete(confirmTaskId);
      setConfirmTaskId(null);
    }
  }, [confirmTaskId, doComplete]);

  const handleNeedsActionClick = useCallback(
    (id: string) => {
      doComplete(id);
    },
    [doComplete]
  );

  return (
    <div className="space-y-4">
      {/* Confirmation Modal */}
      {confirmTaskId && confirmTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setConfirmTaskId(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl p-6 animate-in"
            style={{
              backgroundColor: '#13151c',
              border: '2px solid #00ff8860',
              boxShadow: '0 0 40px rgba(0,255,136,0.15)',
              animation: 'modalIn 200ms ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold mb-2" style={{ color: '#e8eaf0' }}>
              Approve &ldquo;{confirmTask.title}&rdquo;?
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8b92a8' }}>
              {confirmTask.description}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmTaskId(null)}
                className="flex-1 text-sm font-semibold px-4 py-3 rounded-lg transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: '#1e2030',
                  color: '#8b92a8',
                  border: '1px solid #2a2d40',
                  touchAction: 'manipulation',
                  minHeight: '48px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 text-sm font-bold px-4 py-3 rounded-lg transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: '#00ff8830',
                  color: '#00ff88',
                  border: '1px solid #00ff8860',
                  textShadow: '0 0 8px rgba(0,255,136,0.4)',
                  touchAction: 'manipulation',
                  minHeight: '48px',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pete Needs to Action */}
      <div
        className="rounded-xl p-4 md:p-5"
        style={{
          backgroundColor: '#0d0e14',
          border: '2px solid #00d4ff',
          boxShadow: '0 0 20px rgba(0,212,255,0.15), inset 0 0 20px rgba(0,212,255,0.03)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#00d4ff' }}
          />
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}
          >
            Pete Needs to Action
          </h2>
          {activeTasks.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: '#00d4ff20', color: '#00d4ff', border: '1px solid #00d4ff40' }}
            >
              {activeTasks.length}
            </span>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div
            className="rounded-lg py-6 flex items-center justify-center"
            style={{ border: '1px dashed #1e2030' }}
          >
            <span className="text-sm" style={{ color: '#00ff88' }}>
              All caught up
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task) => {
              const isCompleting = completingIds.has(task.id);

              return (
                <div
                  key={task.id}
                  className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  style={{
                    backgroundColor: '#13151c',
                    border: '1px solid #1e2030',
                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                    opacity: isCompleting ? 0.4 : 1,
                    transform: isCompleting ? 'translateX(20px)' : 'translateX(0)',
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
                      DONE ✓
                    </span>
                  ) : task.actionType === 'APPROVE' ? (
                    <button
                      onClick={() => handleApproveClick(task.id)}
                      className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-lg active:scale-95"
                      style={{
                        backgroundColor: '#00ff8820',
                        color: '#00ff88',
                        border: '1px solid #00ff8860',
                        textShadow: '0 0 8px rgba(0,255,136,0.4)',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                        minHeight: '48px',
                        transition: 'transform 150ms ease',
                        cursor: 'pointer',
                      }}
                    >
                      APPROVE
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNeedsActionClick(task.id)}
                      className="flex-shrink-0 text-sm font-bold px-5 py-2.5 rounded-lg active:scale-95"
                      style={{
                        backgroundColor: '#ffaa0020',
                        color: '#ffaa00',
                        border: '1px solid #ffaa0060',
                        textShadow: '0 0 8px rgba(255,170,0,0.4)',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                        minHeight: '48px',
                        transition: 'transform 150ms ease',
                        cursor: 'pointer',
                      }}
                    >
                      NEEDS ACTION
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completedTasks.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
        >
          <button
            onClick={() => setCompletedOpen(!completedOpen)}
            className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-[#13151c]"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a4f65' }}>
                Completed
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: '#1e2030', color: '#8b92a8' }}
              >
                {completedTasks.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {completedOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearCompletedPeteTasks();
                  }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors duration-200 hover:bg-[#ff446620] active:scale-95"
                  style={{
                    color: '#ff4466',
                    border: '1px solid #ff446640',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    minHeight: '40px',
                  }}
                >
                  <Trash2 size={12} />
                  Clear Completed
                </button>
              )}
              {completedOpen ? (
                <ChevronUp size={14} style={{ color: '#4a4f65' }} />
              ) : (
                <ChevronDown size={14} style={{ color: '#4a4f65' }} />
              )}
            </div>
          </button>

          {completedOpen && (
            <div className="px-4 pb-4 space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg p-3 flex items-center gap-3 opacity-60"
                  style={{
                    backgroundColor: '#13151c',
                    border: '1px solid #1e2030',
                    animation: recentlyCompletedIds.has(task.id) ? 'slideIn 400ms ease-out' : undefined,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-through" style={{ color: '#8b92a8' }}>
                      {task.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#4a4f65' }}>
                      {task.description}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    style={{ backgroundColor: '#1e2030', color: '#4a4f65', minHeight: '48px' }}
                  >
                    <Check size={12} strokeWidth={3} />
                    DONE ✓
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes greenFlash {
          0% { box-shadow: 0 0 0 rgba(0,255,136,0); }
          30% { box-shadow: 0 0 20px rgba(0,255,136,0.6); }
          100% { box-shadow: 0 0 0 rgba(0,255,136,0); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 0.6; transform: translateY(0); }
        }
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
