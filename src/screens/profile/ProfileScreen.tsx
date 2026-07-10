import React from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Bell, ChevronRight, CreditCard, LogOut, Settings as SettingsIcon, Sparkles, Wallet, User, Shield, Info, HelpCircle, Trash } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { Screen } from '../../components/Screen';
import { useAuthStore } from '../../store/authStore';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const items: Array<{ label: string; icon: React.ReactNode; onPress: () => void }> = [
    { label: 'Edit Profile', icon: <User size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('EditProfile') },
    { label: 'Pricing plans', icon: <CreditCard size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('Pricing') },
    { label: 'Wallet & credits', icon: <Wallet size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('Wallet') },
    { label: 'Settings', icon: <SettingsIcon size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('Settings') },
    { label: 'Notifications', icon: <Bell size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('Notifications') },
    { label: 'Privacy & Security', icon: <Shield size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('Privacy') },
    { label: 'About VEYTRIX', icon: <Info size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('About') },
    { label: 'Help & Support', icon: <HelpCircle size={18} color={theme.textPrimary} />, onPress: () => navigation.navigate('Support') },
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Success', 'Your account has been deleted.');
            signOut();
          }
        },
      ]
    );
  };

  return (
    <Screen>
      <Text style={[typography.display, { color: theme.textPrimary }]}>Profile</Text>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '700' }}>
            {(user?.displayName ?? user?.email ?? '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[typography.h2, { color: theme.textPrimary }]}>{user?.displayName ?? 'Creator'}</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{user?.email}</Text>
        </View>
      </View>

      <View style={[styles.planRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.planCell}>
          <Sparkles size={16} color={theme.accentAlt} />
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>Plan</Text>
          <Text style={[typography.bodyMedium, { color: theme.textPrimary, textTransform: 'capitalize' }]}>{user?.plan}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.planCell}>
          <CreditCard size={16} color={theme.credit} />
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>Credits</Text>
          <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>{user?.credits}</Text>
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={[styles.menuRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            {item.icon}
            <Text style={[typography.bodyMedium, { color: theme.textPrimary, flex: 1 }]}>{item.label}</Text>
            <ChevronRight size={16} color={theme.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable onPress={signOut} style={[styles.menuRow, { backgroundColor: theme.surface, borderColor: theme.danger + '55', marginTop: spacing.md }]}>
        <LogOut size={18} color={theme.danger} />
        <Text style={[typography.bodyMedium, { color: theme.danger, flex: 1 }]}>Log out</Text>
      </Pressable>

      <Pressable onPress={handleDeleteAccount} style={[styles.menuRow, { backgroundColor: theme.surface, borderColor: theme.danger + '55', marginTop: spacing.sm }]}>
        <Trash size={18} color={theme.danger} />
        <Text style={[typography.bodyMedium, { color: theme.danger, flex: 1 }]}>Delete Account</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg },
  avatar: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  planRow: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg },
  planCell: { flex: 1, alignItems: 'center' },
  divider: { width: 1 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md },
});
