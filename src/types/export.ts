export interface ExportSettings {
  defaultResolution: '720p' | '1080p' | '4K';
  defaultFrameRate: '30 FPS' | '60 FPS';
  autoSaveToGallery: boolean;
  exportFolder: string;
}

export interface ExportItem {
  id: string;
  projectId: string;
  filename: string;
  thumbnail: string | null;
  videoUrl: string | null;
  status: 'queued' | 'preparing' | 'rendering' | 'compressing' | 'saving' | 'completed' | 'failed';
  resolution: '720p' | '1080p' | '4K';
  frameRate: '30 FPS' | '60 FPS';
  aspectRatio: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  preset: string;
  aiPromptUsed: string;
  createdAt: string;
  isFavorite: boolean;
  isDeleted: boolean;
  progress?: number; // 0 to 100 for queue
}

export type ExportFilter = 'All' | 'Today' | 'This Week' | 'This Month' | 'Favorites' | '4K' | '1080p' | '720p';

export interface StorageInfo {
  totalExports: number;
  storageUsedBytes: number;
  totalStorageBytes: number;
  lastExportDate: string | null;
}
