import { create } from 'zustand';
import { ExportService } from '../services/exportService';
import type { ExportItem, ExportSettings, StorageInfo, ExportFilter } from '../types/export';

interface ExportState {
  exports: ExportItem[];
  favorites: string[];
  queue: ExportItem[];
  settings: ExportSettings;
  searchQuery: string;
  activeFilter: ExportFilter;
  loading: boolean;
  storageInfo: StorageInfo | null;
  selectedExportId: string | null;

  // Actions
  hydrate: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: ExportFilter) => void;
  setSelectedExportId: (id: string | null) => void;
  
  createExport: (params: Partial<ExportItem>) => Promise<void>;
  deleteExport: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  renameExport: (id: string, newName: string) => Promise<void>;
  updateSettings: (settings: Partial<ExportSettings>) => Promise<void>;
  
  // Mock queuing flow
  queueExport: (projectId: string, params: Partial<ExportItem>) => void;
  processQueue: () => void; // A mock function to simulate rendering
}

export const useExportStore = create<ExportState>((set, get) => ({
  exports: [],
  favorites: [],
  queue: [],
  settings: {
    defaultResolution: '1080p',
    defaultFrameRate: '30 FPS',
    autoSaveToGallery: true,
    exportFolder: 'Veytrix Exports'
  },
  searchQuery: '',
  activeFilter: 'All',
  loading: true,
  storageInfo: null,
  selectedExportId: null,

  hydrate: async () => {
    set({ loading: true });
    const loadedExports = await ExportService.loadExports();
    const loadedSettings = await ExportService.getSettings();
    const storageInfo = await ExportService.getStorageInfo();
    
    // Extract favorites
    const favorites = loadedExports.filter(e => e.isFavorite).map(e => e.id);
    
    set({
      exports: loadedExports,
      settings: loadedSettings,
      favorites,
      storageInfo,
      loading: false,
    });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  
  setSelectedExportId: (selectedExportId) => set({ selectedExportId }),

  createExport: async (params) => {
    const newExp = await ExportService.createExport(params);
    const updated = await ExportService.loadExports();
    const storageInfo = await ExportService.getStorageInfo();
    set({ exports: updated, storageInfo });
  },

  deleteExport: async (id) => {
    const updated = await ExportService.deleteExport(id);
    const storageInfo = await ExportService.getStorageInfo();
    set(state => ({
      exports: updated,
      favorites: state.favorites.filter(f => f !== id),
      storageInfo
    }));
  },

  toggleFavorite: async (id) => {
    const { exports, favorites } = get();
    const item = exports.find(e => e.id === id);
    if (!item) return;

    const isFav = !item.isFavorite;
    const updated = await ExportService.updateExport(id, { isFavorite: isFav });
    
    set({
      exports: updated,
      favorites: isFav ? [...favorites, id] : favorites.filter(f => f !== id)
    });
  },

  renameExport: async (id, newName) => {
    const updated = await ExportService.updateExport(id, { filename: newName });
    set({ exports: updated });
  },

  updateSettings: async (newSettings) => {
    const { settings } = get();
    const merged = { ...settings, ...newSettings };
    await ExportService.saveSettings(merged);
    set({ settings: merged });
  },

  queueExport: (projectId, params) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newQueued: ExportItem = {
      id,
      projectId,
      filename: params.filename || `Export_${Date.now()}`,
      thumbnail: params.thumbnail || null,
      videoUrl: params.videoUrl || null,
      status: 'queued',
      resolution: params.resolution || '1080p',
      frameRate: params.frameRate || '30 FPS',
      aspectRatio: params.aspectRatio || '16:9',
      duration: params.duration || 15,
      fileSize: params.fileSize || 0,
      preset: params.preset || 'Default',
      aiPromptUsed: params.aiPromptUsed || 'No prompt',
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isDeleted: false,
      progress: 0,
    };
    
    set(state => ({ queue: [...state.queue, newQueued] }));
  },

  processQueue: () => {
    // This is a mock function that would be called periodically to update queue statuses.
    // We will leave it empty or implement a simple mock interval in the component if needed.
  }
}));
