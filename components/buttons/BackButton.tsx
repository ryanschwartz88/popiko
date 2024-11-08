import BackIcon from '@/assets/buttons/back-button.svg';
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { router } from 'expo-router';

interface BackButtonProps {
  updateProgress?: number; 
}

/* 

The BackButton component is used to navigate back to the previous screen.
It uses the 'router' object from the 'expo-router' package to perform the navigation.

*/

export default function BackButton({ updateProgress = 0 }: BackButtonProps) {

  const handlePress = () => {
    router.back();
  };

  return (
      <TouchableOpacity style={styles.backButton} onPress={handlePress}>
        <BackIcon width={29.17} height={25}/>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: 70,
    left: 40,
  },
});