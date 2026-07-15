import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  Music,
  Type,
  Image as ImageIcon,
  Clapperboard,
  Volume2,
} from 'lucide-react-native';
import { useTheme } from '../../../../theme/ThemeProvider';

/** Heights must match TrackLayer heights exactly so icons align with their rows */
const AUDIO_TRACK_HEIGHT = 28;
const SUBTITLE_TRACK_HEIGHT = 28;
const STICKER_TRACK_HEIGHT = 28;
const VIDEO_TRACK_HEIGHT = 64;
const TRACK_GAP = 2;

interface TrackToolItem {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  trackHeight: number;
  onPress?: () => void;
}

interface Props {
  onMusicPress?: () => void;
  onTextPress?: () => void;
  onImagePress?: () => void;
  onCoverPress?: () => void;
  onVolumePress?: () => void;
}

export function TimelineTrackToolbar({
  onMusicPress,
  onTextPress,
  onImagePress,
  onCoverPress,
  onVolumePress,
}: Props) {
  const { theme } = useTheme();

  const items: TrackToolItem[] = [
    { icon: Music,        label: 'Music',  color: '#8B5CF6', trackHeight: AUDIO_TRACK_HEIGHT,    onPress: onMusicPress },
    { icon: Type,         label: 'Text',   color: '#EAB308', trackHeight: SUBTITLE_TRACK_HEIGHT, onPress: onTextPress },
    { icon: ImageIcon,    label: 'Image',  color: '#F472B6', trackHeight: STICKER_TRACK_HEIGHT,  onPress: onImagePress },
    { icon: Clapperboard, label: 'Cover',  color: '#38DDF8', trackHeight: VIDEO_TRACK_HEIGHT,    onPress: onCoverPress },
    // Volume shares the video row height (shown below the cover icon, beside the video track)
    { icon: Volume2,      label: 'Volume', color: '#4ADE80', trackHeight: AUDIO_TRACK_HEIGHT,    onPress: onVolumePress },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, borderRightColor: theme.border }]}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.item,
              { height: item.trackHeight },
              pressed && styles.itemPressed,
            ]}
          >
            <View style={[styles.iconBg, { backgroundColor: item.color + '20', borderColor: item.color + '40' }]}>
              <Icon color={item.color} size={12} strokeWidth={2} />
            </View>
            <Text style={[styles.label, { color: theme.textMuted }]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 52,
    borderRightWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    paddingTop: 20, // Match RULER_HEIGHT exactly
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    gap: 1,
    marginBottom: TRACK_GAP, // Match TRACK_GAP exactly so rows align
  },
  itemPressed: {
    opacity: 0.6,
  },
  iconBg: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 7,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
