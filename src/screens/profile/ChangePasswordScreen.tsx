import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { useTheme } from '../../theme/ThemeProvider';
import { typography, spacing, radius } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ChangePassword'>;

export function ChangePasswordScreen({ navigation }: Props) {
  const { theme } = useTheme();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setLoading(true);
    // Simulate API call for password change
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your password has been changed successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1000);
  };

  return (
    <Screen>
      <Header />
      <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.lg, paddingHorizontal: spacing.md }]}>Change Password</Text>

      <View style={{ gap: spacing.md, paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
        
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Current Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>New Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
          />
        </View>

        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Confirm New Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
          />
        </View>

      </View>

      <View style={{ paddingHorizontal: spacing.md }}>
        <Pressable
          onPress={handleSave}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent, opacity: pressed || loading ? 0.7 : 1 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.bg} />
          ) : (
            <Text style={[typography.bodyMedium, { color: theme.bg, fontWeight: '600' }]}>Update Password</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  button: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
