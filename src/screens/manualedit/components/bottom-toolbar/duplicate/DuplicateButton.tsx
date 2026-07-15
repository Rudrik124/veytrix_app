import React from 'react';
import { Copy } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useEditorState } from '../../../hooks/useEditorState';
import { useShallow } from 'zustand/react/shallow';
import { useEditorPlayer } from '../../../context/EditorPlayerContext';

export function DuplicateButton() {
  const { theme } = useTheme();
  const { selectedClipId, currentTime, tracks, duplicateClip } = useEditorState(useShallow(s => ({
    selectedClipId: s.selectedClipId,
    currentTime: s.currentTime,
    tracks: s.tracks,
    duplicateClip: s.duplicateClip
  })));
  const { player } = useEditorPlayer();

  const handlePress = () => {
    if (!selectedClipId) return;

    const t = player?.currentTime ?? currentTime;
    duplicateClip(selectedClipId!);
  };

  return (
    <ToolbarButton
      label="Duplicate"
      icon={<Copy color={theme.textPrimary} size={20} />}
      onPress={handlePress}
    />
  );
}