import { useEditorState } from '../../../hooks/useEditorState';
import { useShallow } from 'zustand/react/shallow';

export function useToolbar() {
  const { selectedToolId, setSelectedToolId, selectedClipId, currentTime, tracks } = useEditorState(useShallow(s => ({
    selectedToolId: s.selectedToolId,
    setSelectedToolId: s.setSelectedToolId,
    selectedClipId: s.selectedClipId,
    currentTime: s.currentTime,
    tracks: s.tracks
  })));

  const toggleTool = (toolId: string) => {
    setSelectedToolId(selectedToolId === toolId ? null : toolId);
  };

  return { selectedToolId, setSelectedToolId, toggleTool, selectedClipId, currentTime, tracks };
}
