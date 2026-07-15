import { useProjectStore } from '../store/projectStore';
import { Project } from '../types/project';

export function useRealtimeProject(projectId: string) {
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId)) ?? null;
  return project;
}
