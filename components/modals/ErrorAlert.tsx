import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface CustomAlertProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose, duration = 2000 }) => {

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.alertContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faTimesCircle} size={24} color="red" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeIconContainer}>
          <FontAwesomeIcon icon={faTimes} size={20} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, // Ensure it spans the width of the screen
    backgroundColor: '#FDEDEF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 1000,
    flexDirection: 'row', // Ensures child elements are arranged horizontally
    alignItems: 'center', // Vertically center the contents
  },
  contentContainer: {
    flexDirection: 'row', // Ensures icon and text are horizontally aligned
    alignItems: 'center', // Centers items vertically
    flex: 1, // Make the container flexible
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Ensures the text takes up remaining space
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  message: {
    fontSize: 16,
  },
  closeIconContainer: {
    marginLeft: 10,
  },
});

export default CustomAlert;
