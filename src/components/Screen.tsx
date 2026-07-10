import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  refreshControl?: React.ReactElement;
}

export function Screen({ children, scroll = true, style, edges = ['top'], refreshControl }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const Wrapper = scroll ? ScrollView : View;
  
  // Calculate dynamic bottom padding to account for absolute tab bar + safe area + standard padding
  const dynamicPaddingBottom = 56 + insets.bottom + 20;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.bg }]} edges={edges}>
      <Wrapper
        style={styles.flex}
        contentContainerStyle={scroll ? [styles.content, { paddingBottom: dynamicPaddingBottom }, style] : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        {...(!scroll ? { } : {})}
      >
        {!scroll ? <View style={[styles.flex, styles.content, { paddingBottom: dynamicPaddingBottom }, style]}>{children}</View> : children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 20 },
});
