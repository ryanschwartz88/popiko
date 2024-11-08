import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface CustomAlertProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);
  const slideAnim = new Animated.Value(-200);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -200,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onClose();
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.alertContainer, { transform: [{ translateY: slideAnim }] }]}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FDEDEF',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 120,
    zIndex: 1000,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  iconContainer: {
    marginRight: 10,
    paddingBottom: 5,
  },
  textContainer: {
    flex: 1,
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