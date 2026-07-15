import { useProjectStore } from '../store/projectStore';
import { Project } from '../types/project';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

export const ProjectService = {
  async createProject(name: string, aiPrompt: string): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
    
    const newProject: Project = {
      id: generateId(),
      name: name || 'Untitled Project',
      status: 'draft',
      thumbnail: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Mock thumbnail
      duration: '00:00',
      resolution: '1080p',
      fileSize: '0 MB',
      aiPrompt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false,
      versionHistory: [
        {
          id: generateId(),
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          description: 'Initial creation'
        }
      ]
    };

    useProjectStore.getState().addProject(newProject);
    return newProject;
  },

  async saveProject(id: string, updates: Partial<Project>): Promise<void> {
    // We don't delay much here for auto-save
    useProjectStore.getState().updateProject(id, updates);
  },

  async deleteProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    useProjectStore.getState().deleteProject(id);
  },

  async duplicateProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const store = useProjectStore.getState();
    const existing = store.projects.find(p => p.id === id);
    if (existing) {
      const duplicated: Project = {
        ...existing,
        id: generateId(),
        name: `${existing.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        versionHistory: [
          {
            id: generateId(),
            versionNumber: 1,
            createdAt: new Date().toISOString(),
            description: 'Duplicated from existing project'
          }
        ]
      };
      store.addProject(duplicated);
    }
  },

  async archiveProject(id: string, archive: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    useProjectStore.getState().updateProject(id, { isArchived: archive });
  },

  async favoriteProject(id: string, favorite: boolean): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    useProjectStore.getState().updateProject(id, { isFavorite: favorite });
  },

  async saveVersion(id: string, description: string): Promise<void> {
    const store = useProjectStore.getState();
    const existing = store.projects.find(p => p.id === id);
    if (existing) {
      const newVersion = {
        id: generateId(),
        versionNumber: existing.versionHistory.length + 1,
        createdAt: new Date().toISOString(),
        description
      };
      store.updateProject(id, { versionHistory: [newVersion, ...existing.versionHistory] });
    }
  },
  
  async restoreVersion(id: string, versionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Simulated restore
    ProjectService.saveVersion(id, `Restored from version`);
  },

  async startGeneration(payload: any): Promise<{ error: string | null, projectId: string | null }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { error: null, projectId: generateId() };
  }
};

// Legacy export for AI Video generation screens
export const startGeneration = ProjectService.startGeneration;
