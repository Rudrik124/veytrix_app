import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, ProjectFilter } from '../types/project';

interface ProjectState {
  projects: Project[];
  searchQuery: string;
  activeFilter: ProjectFilter;
  loading: boolean;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: ProjectFilter) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      searchQuery: '',
      activeFilter: 'all',
      loading: false,

      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveFilter: (activeFilter) => set({ activeFilter }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'veytrix-project-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ projects: state.projects }), // Only persist projects
    }
  )
);
