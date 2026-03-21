'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedJobs, type Job, type JobPlatform, type JobStatus } from './data';

interface JobsState {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;

  // Filters
  filterPlatform: JobPlatform | 'All';
  filterStatus: JobStatus | 'All';
  filterAwarded: 'Yes' | 'No' | 'All';
  setFilterPlatform: (v: JobPlatform | 'All') => void;
  setFilterStatus: (v: JobStatus | 'All') => void;
  setFilterAwarded: (v: 'Yes' | 'No' | 'All') => void;

  // Sort
  sortColumn: keyof Job | null;
  sortDirection: 'asc' | 'desc';
  setSort: (column: keyof Job) => void;

  // UI
  selectedJobId: string | null;
  setSelectedJob: (id: string | null) => void;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: seedJobs,

      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),
      deleteJob: (id) =>
        set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

      filterPlatform: 'All',
      filterStatus: 'All',
      filterAwarded: 'All',
      setFilterPlatform: (v) => set({ filterPlatform: v }),
      setFilterStatus: (v) => set({ filterStatus: v }),
      setFilterAwarded: (v) => set({ filterAwarded: v }),

      sortColumn: null,
      sortDirection: 'asc',
      setSort: (column) => {
        const state = get();
        if (state.sortColumn === column) {
          set({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' });
        } else {
          set({ sortColumn: column, sortDirection: 'asc' });
        }
      },

      selectedJobId: null,
      setSelectedJob: (id) => set({ selectedJobId: id }),
      modalOpen: false,
      setModalOpen: (open) => set({ modalOpen: open }),
    }),
    {
      name: 'mc-jobs',
      partialize: (state) => ({
        jobs: state.jobs,
      }),
    }
  )
);
