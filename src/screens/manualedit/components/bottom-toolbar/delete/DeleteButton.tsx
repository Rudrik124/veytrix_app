import React from 'react';
import { Trash2 } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useEditorState } from '../../../hooks/useEditorState';
import { useShallow } from 'zustand/react/shallow';
import { useEditorPlayer } from '../../../context/EditorPlayerContext';

export function DeleteButton() {
  const { theme } = useTheme();
  const { selectedClipId, currentTime, tracks, deleteClip } = useEditorState(useShallow(s => ({
    selectedClipId: s.selectedClipId,
    currentTime: s.currentTime,
    tracks: s.tracks,
    deleteClip: s.deleteClip
  })));
  const { player } = useEditorPlayer();

  const handlePress = () => {
    if (!selectedClipId) return;

    const t = player?.currentTime ?? currentTime;
    deleteClip(selectedClipId!);
  };

  return (
    <ToolbarButton
      label="Delete"
      icon={<Trash2 color={theme.textPrimary} size={20} />}
      onPress={handlePress}
    />
  );
}