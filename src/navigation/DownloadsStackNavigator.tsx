import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DownloadsScreen } from '../screens/downloads/DownloadsScreen';
import { ExportPreviewScreen } from '../screens/downloads/ExportPreviewScreen';
import { ExportQueueScreen } from '../screens/downloads/ExportQueueScreen';
import { ExportSettingsScreen } from '../screens/downloads/ExportSettingsScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { DownloadsStackParamList } from './types';

const Stack = createNativeStackNavigator<DownloadsStackParamList>();

export function DownloadsStackNavigator() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
      <Stack.Screen name="DownloadsMain" component={DownloadsScreen} />
      <Stack.Screen name="ExportPreview" component={ExportPreviewScreen} />
      <Stack.Screen name="ExportQueue" component={ExportQueueScreen} />
      <Stack.Screen name="ExportSettings" component={ExportSettingsScreen} />
    </Stack.Navigator>
  );
}
