import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';

const DashboardIcon = () => {
  // Shared value to track animation progress (0 for "grip lines", 1 for "X")
  const progress = useSharedValue(0);

  const toggleIcon = () => {
    // Toggle progress between 0 and 1
    progress.value = progress.value === 0 ? 1 : 0;
  };

  // Animated styles for the lines
  const line1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(progress.value * 10) }, // Move down
      { rotate: withTiming(`${progress.value * 45}deg`) }, // Rotate to form "/"
    ],
  }));

  const line2Style = useAnimatedStyle(() => ({
    opacity: withTiming(1 - progress.value), // Fade out
  }));

  const line3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(progress.value * -10) }, // Move up
      { rotate: withTiming(`${-progress.value * 45}deg`) }, // Rotate to form "\"
    ],
  }));

  return (
    <TouchableOpacity onPress={toggleIcon} style={styles.container}>
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.line, line1Style]} />
        <Animated.View style={[styles.line, line2Style]} />
        <Animated.View style={[styles.line, line3Style]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 30,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 2,
    marginVertical: 3,
  },
});

export default DashboardIcon;
