import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExportItem, ExportSettings, StorageInfo } from '../types/export';


const EXPORTS_STORAGE_KEY = '@vey_exports';
const SETTINGS_STORAGE_KEY = '@vey_export_settings';

// Mock some default initial data if none exists
const DEFAULT_SETTINGS: ExportSettings = {
  defaultResolution: '1080p',
  defaultFrameRate: '30 FPS',
  autoSaveToGallery: true,
  exportFolder: 'Veytrix Exports',
};

export const ExportService = {
  async getSettings(): Promise<ExportSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load export settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: ExportSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save export settings', e);
    }
  },

  async loadExports(): Promise<ExportItem[]> {
    try {
      const data = await AsyncStorage.getItem(EXPORTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load exports', e);
    }
    return [];
  },

  async saveAllExports(exports: ExportItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(EXPORTS_STORAGE_KEY, JSON.stringify(exports));
    } catch (e) {
      console.warn('Failed to save exports', e);
    }
  },

  async createExport(params: Partial<ExportItem>): Promise<ExportItem> {
    const exports = await this.loadExports();
    
    const newExport: ExportItem = {
      id: Math.random().toString(36).substring(2, 9),
      projectId: params.projectId || 'unknown_project',
      filename: params.filename || `Export_${Date.now()}`,
      thumbnail: params.thumbnail || null,
      videoUrl: params.videoUrl || null,
      status: 'completed',
      resolution: params.resolution || '1080p',
      frameRate: params.frameRate || '30 FPS',
      aspectRatio: params.aspectRatio || '16:9',
      duration: params.duration || 15,
      fileSize: params.fileSize || 1024 * 1024 * 15, // 15MB mock
      preset: params.preset || 'Default',
      aiPromptUsed: params.aiPromptUsed || 'No prompt',
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isDeleted: false,
      ...params,
    };

    exports.unshift(newExport);
    await this.saveAllExports(exports);
    return newExport;
  },

  async updateExport(id: string, updates: Partial<ExportItem>): Promise<ExportItem[]> {
    const exports = await this.loadExports();
    const index = exports.findIndex(e => e.id === id);
    if (index > -1) {
      exports[index] = { ...exports[index], ...updates };
      await this.saveAllExports(exports);
    }
    return exports;
  },

  async deleteExport(id: string): Promise<ExportItem[]> {
    // Soft delete or hard delete based on preference. Let's do hard delete for simplicity here
    let exports = await this.loadExports();
    exports = exports.filter(e => e.id !== id);
    await this.saveAllExports(exports);
    return exports;
  },

  async getStorageInfo(): Promise<StorageInfo> {
    const exports = await this.loadExports();
    const activeExports = exports.filter(e => !e.isDeleted);
    
    const storageUsedBytes = activeExports.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
    const totalStorageBytes = 1024 * 1024 * 1024 * 5; // Mock 5 GB max local storage available
    
    // Find the most recent export
    let lastExportDate = null;
    if (activeExports.length > 0) {
      const sorted = [...activeExports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      lastExportDate = sorted[0].createdAt;
    }

    return {
      totalExports: activeExports.length,
      storageUsedBytes,
      totalStorageBytes,
      lastExportDate,
    };
  }
};
