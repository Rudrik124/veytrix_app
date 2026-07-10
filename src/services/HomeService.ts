import { Announcement, Project, Template, WalletSummary } from '../types';

// Mock delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class HomeService {
  async getDashboard(): Promise<{ credits: number; walletSummary: WalletSummary }> {
    await delay(1200);
    return {
      credits: 450,
      walletSummary: {
        currentBalance: 450,
        lastRecharge: new Date().toISOString(),
        creditsUsedToday: 50,
      },
    };
  }

  async getRecentProjects(): Promise<Project[]> {
    await delay(1000);
    return [
      {
        id: 'p1',
        userId: 'u1',
        type: 'text_to_video',
        status: 'completed',
        prompt: 'A cinematic shot of a futuristic city',
        params: {},
        thumbnailUrl: null,
        outputUrl: null,
        creditsCost: 20,
        errorMessage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'p2',
        userId: 'u1',
        type: 'image_to_video',
        status: 'completed',
        prompt: 'Animate this portrait',
        params: {},
        thumbnailUrl: null,
        outputUrl: null,
        creditsCost: 15,
        errorMessage: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'p3',
        userId: 'u1',
        type: 'reference_video',
        status: 'generating',
        prompt: 'Make it look like a cartoon',
        params: {},
        thumbnailUrl: null,
        outputUrl: null,
        creditsCost: 30,
        errorMessage: null,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];
  }

  async getTrendingTemplates(): Promise<Template[]> {
    await delay(800);
    return [
      { id: 't1', title: 'Cinematic product reveal', type: 'text_to_video', thumbnailUrl: '', trending: true },
      { id: 't2', title: 'Photo to motion portrait', type: 'image_to_video', thumbnailUrl: '', trending: true },
      { id: 't3', title: 'Anime style restyle', type: 'reference_video', thumbnailUrl: '', trending: true },
      { id: 't4', title: '3D character turnaround', type: 'text_to_video', thumbnailUrl: '', trending: true },
      { id: 't5', title: 'Vintage film look', type: 'manual_edit', thumbnailUrl: '', trending: true },
    ];
  }

  async getAnnouncements(): Promise<Announcement[]> {
    await delay(600);
    return [
      {
        id: 'a1',
        title: '✨ New: Reference Video restyling is live',
        description: 'Upload any clip and let AI restyle it while keeping the original motion.',
        date: new Date().toISOString(),
      },
      {
        id: 'a2',
        title: '🚀 Faster Generation Times',
        description: 'We have optimized our infrastructure. Enjoy 3x faster video generation!',
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
      }
    ];
  }
}

export const homeService = new HomeService();
