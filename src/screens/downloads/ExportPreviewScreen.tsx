import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Share, Download, Edit3, Copy, Heart, Trash2, Info, X } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { useExportStore } from '../../store/exportStore';
import type { DownloadsStackParamList } from '../../navigation/types';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

type Props = NativeStackScreenProps<DownloadsStackParamList, 'ExportPreview'>;

const { height } = Dimensions.get('window');

export function ExportPreviewScreen({ navigation, route }: Props) {
  const { exportId } = route.params;
  const { theme } = useTheme();
  
  const exports = useExportStore(s => s.exports);
  const toggleFavorite = useExportStore(s => s.toggleFavorite);
  const deleteExport = useExportStore(s => s.deleteExport);
  const createExport = useExportStore(s => s.createExport);

  const exportItem = exports.find(e => e.id === exportId);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Use a default mock video URL if none provided
  const videoSource = exportItem?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  if (!exportItem) {
    return (
      <View style={[styles.container, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.body, { color: '#FFF' }]}>Export not found.</Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }}>
          <Text style={[typography.bodyMedium, { color: '#38DDF8' }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleShare = async () => {
    // Mock sharing
    const available = await Sharing.isAvailableAsync();
    if (available) {
      // Create a mock local file to share, since we don't really have the physical file locally for this mock
      try {
        alert('Mock: Sharing file');
      } catch(e) {}
    }
  };

  const handleSave = () => {
    alert('Mock: Saved to gallery!');
    setShowBottomSheet(false);
  };

  const handleDuplicate = async () => {
    await createExport({
      ...exportItem,
      filename: `${exportItem.filename} (Copy)`,
    });
    alert('Mock: Duplicated!');
    setShowBottomSheet(false);
  };

  const handleDelete = async () => {
    await deleteExport(exportItem.id);
    navigation.goBack();
  };

  const ActionItem = ({ icon, label, onPress, danger = false }: any) => (
    <Pressable onPress={onPress} style={({pressed}) => [styles.actionItem, pressed && { opacity: 0.7 }]}>
      {icon}
      <Text style={[typography.bodyMedium, { color: danger ? theme.danger : theme.textPrimary, marginLeft: spacing.sm }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      {/* Video Player */}
      <VideoView
        style={StyleSheet.absoluteFillObject}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
      />

      {/* Top Navigation */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.topNav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ChevronLeft color="#FFF" size={24} />
        </Pressable>
        <Pressable onPress={() => setShowBottomSheet(true)} style={styles.iconButton}>
          <Info color="#FFF" size={24} />
        </Pressable>
      </Animated.View>

      {/* Floating Bottom Actions (Quick) */}
      {!showBottomSheet && !showDetails && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.quickActions}>
          <BlurView intensity={30} tint="dark" style={styles.quickActionsGlass}>
            <Pressable onPress={handleShare} style={styles.quickActionBtn}>
              <Share color="#FFF" size={20} />
            </Pressable>
            <Pressable onPress={() => toggleFavorite(exportItem.id)} style={styles.quickActionBtn}>
              <Heart color={exportItem.isFavorite ? '#F43F5E' : '#FFF'} fill={exportItem.isFavorite ? '#F43F5E' : 'transparent'} size={20} />
            </Pressable>
            <Pressable onPress={() => setShowBottomSheet(true)} style={[styles.quickActionBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Info color="#FFF" size={20} />
            </Pressable>
          </BlurView>
        </Animated.View>
      )}

      {/* Premium Bottom Sheet */}
      {showBottomSheet && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowBottomSheet(false)}>
            <Animated.View entering={FadeIn.duration(300)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
          </Pressable>
          <Animated.View entering={SlideInDown.springify().damping(20)} exiting={SlideOutDown} style={[styles.bottomSheet, { backgroundColor: theme.bgElevated }]}>
            
            <View style={styles.sheetHandle} />
            
            <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.lg }]}>{exportItem.filename}</Text>
            
            <View style={styles.actionsGrid}>
              <ActionItem icon={<Share color={theme.textPrimary} size={20} />} label="Share" onPress={handleShare} />
              <ActionItem icon={<Download color={theme.textPrimary} size={20} />} label="Save to Gallery" onPress={handleSave} />
              <ActionItem icon={<Edit3 color={theme.textPrimary} size={20} />} label="Rename" onPress={() => { alert('Mock: Rename dialog'); setShowBottomSheet(false); }} />
              <ActionItem icon={<Copy color={theme.textPrimary} size={20} />} label="Duplicate" onPress={handleDuplicate} />
              <ActionItem icon={<Heart color={exportItem.isFavorite ? '#F43F5E' : theme.textPrimary} fill={exportItem.isFavorite ? '#F43F5E' : 'transparent'} size={20} />} label="Favorite" onPress={() => toggleFavorite(exportItem.id)} />
              <ActionItem icon={<Info color={theme.textPrimary} size={20} />} label="Details" onPress={() => { setShowBottomSheet(false); setShowDetails(true); }} />
              <ActionItem icon={<Trash2 color={theme.danger} size={20} />} label="Delete" danger onPress={handleDelete} />
            </View>

          </Animated.View>
        </View>
      )}

      {/* Details Sheet */}
      {showDetails && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowDetails(false)}>
            <Animated.View entering={FadeIn.duration(300)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
          </Pressable>
          <Animated.View entering={SlideInDown.springify().damping(20)} exiting={SlideOutDown} style={[styles.bottomSheet, { backgroundColor: theme.bgElevated, height: height * 0.7 }]}>
            
            <View style={[styles.row, { justifyContent: 'space-between', marginBottom: spacing.xl }]}>
              <Text style={[typography.h2, { color: theme.textPrimary }]}>Export Details</Text>
              <Pressable onPress={() => setShowDetails(false)}>
                <X color={theme.textMuted} size={24} />
              </Pressable>
            </View>

            <View style={{ gap: spacing.md }}>
              <DetailRow label="Filename" value={exportItem.filename} />
              <DetailRow label="Resolution" value={exportItem.resolution} />
              <DetailRow label="Frame Rate" value={exportItem.frameRate} />
              <DetailRow label="Aspect Ratio" value={exportItem.aspectRatio} />
              <DetailRow label="Duration" value={`${exportItem.duration}s`} />
              <DetailRow label="File Size" value={`${(exportItem.fileSize / (1024*1024)).toFixed(2)} MB`} />
              <DetailRow label="Preset" value={exportItem.preset} />
              <DetailRow label="Export Date" value={new Date(exportItem.createdAt).toLocaleDateString()} />
              <DetailRow label="AI Prompt" value={exportItem.aiPromptUsed} />
            </View>

          </Animated.View>
        </View>
      )}
    </View>
  );
}

const DetailRow = ({ label, value }: { label: string, value: string }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { justifyContent: 'space-between' }]}>
      <Text style={[typography.bodyMedium, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[typography.bodyMedium, { color: theme.textPrimary, flex: 1, textAlign: 'right', marginLeft: 16 }]} numberOfLines={2}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickActions: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  quickActionsGlass: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  actionsGrid: {
    gap: spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
