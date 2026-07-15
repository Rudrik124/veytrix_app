import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Fixed playhead — stays centered in the viewport.
 * The timeline scrolls *beneath* it.
 * Rendered with pointerEvents="none" so it never intercepts gestures.
 */
export function Playhead() {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Triangle / diamond head at the very top */}
      <View style={styles.head} />
      {/* Vertical line running down through all tracks */}
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    // Offset by half our own width so the line is truly centered
    left: '50%',
    width: 2,
    zIndex: 50,
    alignItems: 'center',
  },
  head: {
    width: 12,
    height: 12,
    // Rotate a square 45° → diamond / caret shape
    backgroundColor: '#38DDF8',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    marginTop: -5,
    // Tiny shadow for depth
    shadowColor: '#38DDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 6,
  },
  line: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#38DDF8',
    opacity: 0.9,
  },
});
