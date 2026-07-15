export interface ProjectVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'completed' | 'failed' | 'queued' | 'generating' | 'processing';
  thumbnail: string | null;
  duration: string;
  resolution: string;
  fileSize: string;
  aiPrompt: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
  versionHistory: ProjectVersion[];
  
  // Legacy fields for AI generators
  outputUrl?: string | null;
  type?: string;
  errorMessage?: string;
}

export type ProjectFilter = 'all' | 'drafts' | 'completed' | 'recent' | 'favorites' | 'archived';
