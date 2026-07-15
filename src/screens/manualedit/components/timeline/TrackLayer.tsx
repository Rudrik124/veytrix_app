import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Track } from '../../types/editor.types';
import { ClipNode, TRACK_HEIGHTS } from './ClipNode';
import { useEditorState } from '../../hooks/useEditorState';

import type { SharedValue } from 'react-native-reanimated';

import { Music, Type, Image as ImageIcon, Clapperboard, Pencil } from 'lucide-react-native';

/** Gap between track rows */
export const TRACK_GAP = 2;

interface Props {
  track: Track;
  scale: SharedValue<number>;
  timelinePadding: number;
  duration: number;
}

const ICONS: Record<string, any> = {
  audio: Music,
  subtitle: Type,
  sticker: ImageIcon,
  video: Clapperboard,
  pip: ImageIcon
};

const COLORS: Record<string, string> = {
  audio: '#8B5CF6',
  subtitle: '#EAB308',
  sticker: '#F472B6',
  video: '#38DDF8',
  pip: '#F472B6'
};

export function TrackLayer({ track, scale, timelinePadding, duration }: Props) {
  const setSelectedToolId = useEditorState(s => s.setSelectedToolId);
  const height = TRACK_HEIGHTS[track.type] ?? 36;
  const trackLabel = track.type.charAt(0).toUpperCase() + track.type.slice(1);
  const IconComp = ICONS[track.type] || Music;
  const color = COLORS[track.type] || '#FFF';

  const handleAddPress = () => {
    const toolMap: Record<string, string> = {
      audio: 'audio',
      subtitle: 'text',
      sticker: 'stickers'
    };
    const toolId = toolMap[track.type];
    if (toolId) setSelectedToolId(toolId);
  };

  return (
    <View style={[styles.container, { height, marginBottom: TRACK_GAP }]}>
      {/* Polished badge icon attached to the left of the track (scrolls with timeline) */}
      <View style={{
        position: 'absolute',
        left: timelinePadding - 32, // 32px to the left of playhead
        top: (height - 24) / 2, // Vertically centered
        height: 24,
        width: 24,
        borderRadius: 6,
        backgroundColor: color + '20',
        borderWidth: 1,
        borderColor: color + '40',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <IconComp color={color} size={14} strokeWidth={2} />
      </View>

      {/* Cover Box for Video Track */}
      {track.type === 'video' && (
        <Pressable
          style={{
            position: 'absolute',
            left: timelinePadding - 88, // To the left of the track icon (32 + 8 + 48)
            top: (height - 48) / 2,
            height: 48,
            width: 48,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600', marginBottom: 4 }}>Cover</Text>
          <Pencil color="rgba(255,255,255,0.8)" size={12} />
        </Pressable>
      )}

      {/* Empty State Placeholder extending the full length of the video */}
      {track.clips.length === 0 && track.type !== 'video' && (
        <Pressable
          onPress={handleAddPress}
          style={{
            position: 'absolute',
            left: timelinePadding, // Starts exactly at playhead
            height: height, // Full height
            width: duration * scale.value, // Full video length
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: 4,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 8,
            backgroundColor: 'rgba(255,255,255,0.02)'
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '500' }}>
            Tap to add {trackLabel}
          </Text>
        </Pressable>
      )}

      {/* Render actual clips */}
      {track.clips.map(clip => (
        <ClipNode
          key={clip.id}
          clip={clip}
          scale={scale}
          timelinePadding={timelinePadding}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
});
