import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { EmptyState } from '../../components/EmptyState';
import { useCreditStore } from '../../store/creditStore';

export function TransactionHistoryScreen() {
  const { theme } = useTheme();
  const transactions = useCreditStore((s) => s.transactions);

  return (
    <Screen scroll={false}>
      <Header />
      <Text style={[typography.display, { color: theme.textPrimary, marginHorizontal: spacing.md }]}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ gap: spacing.xs, padding: spacing.md, paddingBottom: spacing.xxxl }}
        ListEmptyComponent={
          <EmptyState icon={<Zap size={28} color={theme.textMuted} />} title="No transactions yet" body="Recharges and spends will show up here." />
        }
        renderItem={({ item }) => (
          <View style={[styles.txRow, { borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>{item.description}</Text>
              <Text style={[typography.caption, { color: theme.textMuted }]}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <Text style={[typography.bodyMedium, { color: item.amount >= 0 ? theme.success : theme.danger }]}>
              {item.amount >= 0 ? '+' : ''}{item.amount}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1 },
});
