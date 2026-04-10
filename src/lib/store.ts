'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { teamMembers, tasks, projects, documents, peteTasks, type TeamMember, type Task, type Project, type Document, type PeteTask } from './data';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED';
export type ApprovalPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type ApprovalCategory = 'Product' | 'Mission Control' | 'Marketing' | 'Design';

export interface ApprovalOption {
  id: string;
  label: string;
  value: string;
}

export interface Approval {
  id: string;
  title: string;
  description: string;
  category: ApprovalCategory;
  priority: ApprovalPriority;
  assignedTo: string;
  status: ApprovalStatus;
  approvedAt?: string;
  selectedOption?: string;
  options?: ApprovalOption[];
}

const defaultApprovals: Approval[] = [
  {
    id: 'apr-1',
    title: 'Mission Control Dashboard',
    description: 'Review and approve the Mission Control dashboard. Fire up localhost:3000 and confirm it\'s ready to go live. This is the command center for all operations.',
    category: 'Mission Control',
    priority: 'HIGH',
    assignedTo: 'Pete',
    status: 'PENDING',
  },
  {
    id: 'apr-2',
    title: 'Cover Mockup',
    description: 'Approve or request changes to the Peptide Compass cover mockup. Open cover-mockup.html to review. This is the first impression for customers — must be dialed in before launch.',
    category: 'Design',
    priority: 'HIGH',
    assignedTo: 'Pete',
    status: 'PENDING',
  },
  {
    id: 'apr-3',
    title: 'Tagline Selection',
    description: 'Choose the primary tagline for Peptide Compass. Select A, B, C, or request a mix. This sets the tone for all marketing copy.',
    category: 'Marketing',
    priority: 'HIGH',
    assignedTo: 'Pete',
    status: 'PENDING',
    options: [
      { id: 'a', label: 'Option A', value: 'Navigate Your Biology.' },
      { id: 'b', label: 'Option B', value: 'Precision Tools for Peak Performance.' },
      { id: 'c', label: 'Option C', value: 'The Complete Navigator\'s Guide to Peptide Optimization.' },
    ],
  },
  {
    id: 'apr-4',
    title: 'Content Page Background',
    description: 'Decide: light or dark background for body text pages in the Peptide Compass PDF. This affects readability and print cost. Dark = premium feel, light = easier to read long-form.',
    category: 'Design',
    priority: 'MEDIUM',
    assignedTo: 'Pete',
    status: 'PENDING',
    options: [
      { id: 'light', label: 'Light', value: 'Light background — clean, print-friendly' },
      { id: 'dark', label: 'Dark', value: 'Dark background — premium, digital-first' },
    ],
  },
  {
    id: 'apr-5',
    title: 'Stat Bar Numbers',
    description: 'Confirm the key stats displayed on the Peptide Compass marketing materials and inside the guide.',
    category: 'Product',
    priority: 'MEDIUM',
    assignedTo: 'Pete',
    status: 'PENDING',
    options: [
      { id: 'confirm', label: 'Confirm', value: '30+ Peptides · 6 Categories · 100+ Protocols · 200+ Citations' },
    ],
  },
  {
    id: 'apr-6',
    title: 'Year Branding',
    description: 'Confirm "2025 Edition" as the official year branding for Peptide Compass. This appears on the cover, spine, and marketing materials.',
    category: 'Product',
    priority: 'LOW',
    assignedTo: 'Pete',
    status: 'PENDING',
    options: [
      { id: 'confirm', label: '2025 Edition', value: '2025 Edition — confirmed' },
    ],
  },
];

interface AppState {
  // Team
  team: TeamMember[];
  selectedMemberId: string | null;
  setSelectedMember: (id: string | null) => void;

  // Tasks
  tasks: Task[];
  moveTask: (taskId: string, status: Task['status']) => void;
  addTask: (task: Task) => void;

  // Projects
  projects: Project[];

  // Documents
  documents: Document[];
  docSearch: string;
  docActiveTags: string[];
  docSort: 'latest' | 'oldest' | 'az' | 'relevance';
  selectedDocId: string | null;
  setDocSearch: (q: string) => void;
  toggleDocTag: (tag: string) => void;
  clearDocTags: () => void;
  setDocSort: (sort: 'latest' | 'oldest' | 'az' | 'relevance') => void;
  setSelectedDoc: (id: string | null) => void;

  // Approvals
  approvals: Approval[];
  setApprovalStatus: (id: string, status: ApprovalStatus) => void;
  setApprovalOption: (id: string, optionValue: string) => void;
  revokeApproval: (id: string) => void;
  cleanupApprovedApprovals: () => void;
  pendingApprovalCount: () => number;

  // Pete Tasks
  peteTasks: PeteTask[];
  completePeteTask: (id: string) => void;
  clearCompletedPeteTasks: () => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      team: teamMembers,
      selectedMemberId: null,
      setSelectedMember: (id) => set({ selectedMemberId: id }),

      tasks: tasks,
      moveTask: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

      projects: projects,
      documents: documents,
      docSearch: '',
      docActiveTags: [],
      docSort: 'latest',
      selectedDocId: null,
      setDocSearch: (q) => set({ docSearch: q }),
      toggleDocTag: (tag) =>
        set((state) => ({
          docActiveTags: state.docActiveTags.includes(tag)
            ? state.docActiveTags.filter((t) => t !== tag)
            : [...state.docActiveTags, tag],
        })),
      clearDocTags: () => set({ docActiveTags: [] }),
      setDocSort: (sort) => set({ docSort: sort }),
      setSelectedDoc: (id) => set({ selectedDocId: id }),

      peteTasks: peteTasks,
      completePeteTask: (id) =>
        set((state) => ({
          peteTasks: state.peteTasks.map((t) =>
            t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
          ),
        })),
      clearCompletedPeteTasks: () => {
        const state = get();
        const completed = state.peteTasks.filter((t) => t.completed);
        if (completed.length > 0) {
          const existing = JSON.parse(localStorage.getItem('mc-tasks-archive') || '[]');
          localStorage.setItem(
            'mc-tasks-archive',
            JSON.stringify([...existing, ...completed.map((t) => ({ ...t, archivedAt: new Date().toISOString() }))])
          );
          set({ peteTasks: state.peteTasks.filter((t) => !t.completed) });
        }
      },

      approvals: defaultApprovals,
      setApprovalStatus: (id, status) =>
        set((state) => ({
          approvals: state.approvals.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status,
                  approvedAt: status === 'APPROVED' ? new Date().toISOString() : undefined,
                }
              : a
          ),
        })),
      setApprovalOption: (id, optionValue) =>
        set((state) => ({
          approvals: state.approvals.map((a) => (a.id === id ? { ...a, selectedOption: optionValue } : a)),
        })),
      revokeApproval: (id) =>
        set((state) => ({
          approvals: state.approvals.map((a) =>
            a.id === id ? { ...a, status: 'PENDING' as ApprovalStatus, approvedAt: undefined } : a
          ),
        })),
      cleanupApprovedApprovals: () =>
        set((state) => ({
          approvals: state.approvals.filter((a) => {
            if (a.status !== 'APPROVED' || !a.approvedAt) return true;
            const elapsed = Date.now() - new Date(a.approvedAt).getTime();
            return elapsed < 5 * 60 * 1000;
          }),
        })),
      pendingApprovalCount: () => get().approvals.filter((a) => a.status === 'PENDING').length,

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'mission-control-store',
      partialize: (state) => ({
        tasks: state.tasks,
        peteTasks: state.peteTasks,
        sidebarOpen: state.sidebarOpen,
        approvals: state.approvals,
      }),
    }
  )
);
