import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateHomeScreen } from '../screens/generate/CreateHomeScreen';
import { GenerationProgressScreen } from '../screens/generate/GenerationProgressScreen';
import { ManualEditScreen } from '../screens/manualedit/ManualEditScreen';
import { ManualEditorWorkspaceScreen } from '../screens/manualedit/ManualEditorWorkspaceScreen';
import { ProjectDetailScreen } from '../screens/projects/ProjectDetailScreen';
import { useTheme } from '../theme/ThemeProvider';
import type { CreateStackParamList } from './types';

const Stack = createNativeStackNavigator<CreateStackParamList>();

export function CreateStackNavigator() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: theme.textPrimary, headerStyle: { backgroundColor: theme.bg }, contentStyle: { backgroundColor: theme.bg } }}>
      <Stack.Screen name="CreateHome" component={CreateHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ManualEdit" component={ManualEditScreen} options={{ title: '' }} />
      <Stack.Screen name="ManualEditorWorkspace" component={ManualEditorWorkspaceScreen} options={{ headerShown: false, gestureEnabled: false }} />

      <Stack.Screen name="GenerationProgress" component={GenerationProgressScreen} options={{ title: '', headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Project' }} />
    </Stack.Navigator>
  );
}

