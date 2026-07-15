import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';

import { AiEditButton } from './ai-edit';
import { TrimButton } from './trim';
import { SplitButton } from './split';
import { CropButton } from './crop';
import { RotateButton } from './rotate';
import { SpeedButton } from './speed';
import { VolumeButton } from './volume';
import { MuteButton } from './mute';
import { FiltersButton } from './filters';
import { EffectsButton } from './effects';
import { AdjustButton } from './adjust';
import { TextButton } from './text';
import { StickersButton } from './stickers';
import { PipButton } from './pip';
import { BackgroundButton } from './background';
import { ReplaceButton } from './replace';
import { ReverseButton } from './reverse';
import { FreezeButton } from './freeze';
import { DuplicateButton } from './duplicate';
import { DeleteButton } from './delete';

export function BottomToolbar() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <AiEditButton />
        <TrimButton />
        <SplitButton />
        <CropButton />
        <RotateButton />
        <SpeedButton />
        <VolumeButton />
        <MuteButton />
        <FiltersButton />
        <EffectsButton />
        <AdjustButton />
        <TextButton />
        <StickersButton />
        <PipButton />
        <BackgroundButton />
        <ReplaceButton />
        <ReverseButton />
        <FreezeButton />
        <DuplicateButton />
        <DeleteButton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 0,
    gap: 0,
  }
});
