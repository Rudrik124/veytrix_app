import { create } from 'zustand';
import { homeService } from '../services/HomeService';
import { Announcement, Project, Template, WalletSummary } from '../types';

interface HomeState {
  greeting: string;
  credits: number;
  walletSummary: WalletSummary | null;
  recentProjects: Project[];
  announcements: Announcement[];
  trendingTemplates: Template[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const useHomeStore = create<HomeState>((set, get) => ({
  greeting: getGreeting(),
  credits: 0,
  walletSummary: null,
  recentProjects: [],
  announcements: [],
  trendingTemplates: [],
  loading: false,
  refreshing: false,
  error: null,

  fetchDashboard: async () => {
    if (get().walletSummary) return; // Prevent re-fetching on every mount if already loaded

    set({ loading: true, error: null, greeting: getGreeting() });
    try {
      const [dash, projects, templates, announcements] = await Promise.all([
        homeService.getDashboard(),
        homeService.getRecentProjects(),
        homeService.getTrendingTemplates(),
        homeService.getAnnouncements(),
      ]);

      set({
        credits: dash.credits,
        walletSummary: dash.walletSummary,
        recentProjects: projects,
        trendingTemplates: templates,
        announcements,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load dashboard', loading: false });
    }
  },

  refreshDashboard: async () => {
    set({ refreshing: true, error: null, greeting: getGreeting() });
    try {
      const [dash, projects, templates, announcements] = await Promise.all([
        homeService.getDashboard(),
        homeService.getRecentProjects(),
        homeService.getTrendingTemplates(),
        homeService.getAnnouncements(),
      ]);

      set({
        credits: dash.credits,
        walletSummary: dash.walletSummary,
        recentProjects: projects,
        trendingTemplates: templates,
        announcements,
        refreshing: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to refresh dashboard', refreshing: false });
    }
  },
}));
