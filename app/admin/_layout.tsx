import React, { useState } from 'react';
import { router, Slot } from "expo-router";
import { View, Modal, TextInput, TouchableOpacity, Text, Alert, StyleSheet, SafeAreaView, Pressable, Keyboard } from 'react-native';
import { supabase } from '@/hooks/account/client';
import { AntDesign, Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSession } from '@/hooks/account/useSession';

export default function Layout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const progress = useSharedValue(0); // Shared value for animation progress
  const slideProgress = useSharedValue(0); // Shared value for slide-up menu
  const { setRole } = useSession();


  const handleOpenAdmin = async () => {
    const { data, error } = await supabase.functions.invoke('admin-password-check', {
      body: { adminPasswordInput: adminPassword },
    });
    if (error) {
      Alert.alert('Invalid admin password');
    } else {
      if (data) {
        setIsAdmin(true);
        setIsModalVisible(false);
        setAdminPassword('');
        progress.value = 1;
        slideProgress.value = 1;
      }
    }
  };

  const handleCloseAdmin = () => {
    Alert.alert('Close Admin Access', 'Are you sure you want to close admin access?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: handleCancelAdmin},
    ]);
  };

  // Handle floating button toggle
  const handleIconPress = () => {
    if (isAdmin) {
      handleCloseAdmin();
    } else {
      setIsModalVisible(true);
    } 
  };

  const handleCancelAdmin = () => {
    setIsAdmin(false);
    progress.value = 0;
    slideProgress.value = 0;
    setIsModalVisible(false);
    setAdminPassword('');
    router.push('/admin');
  };

  // Animated styles for the lines
  const line1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(progress.value * 10) },
      { rotate: withTiming(`${progress.value * 45}deg`) },
    ],
  }));

  const line2Style = useAnimatedStyle(() => ({
    opacity: withTiming(1 - progress.value),
  }));

  const line3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(progress.value * -10) },
      { rotate: withTiming(`${-progress.value * 45}deg`) },
    ],
  }));

  // Animated style for sliding menu
  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(slideProgress.value === 1 ? 0 : 300) }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Slot />

      {/* Sliding Navigation Menu */}
      {isAdmin && <Animated.View style={[styles.menu, menuStyle]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/admin/client')}
        >
          <MaterialIcons name="person" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/admin/calendar')}
        >
          <MaterialIcons name="calendar-today" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.push('/admin')}
        >
          <MaterialIcons name="dashboard" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={async () => {
            setRole('');
            await supabase.auth.signOut();
            router.replace('/onboarding/Welcome');
          }}
        >
          <Feather name="log-out" size={40} color="white" />
        </TouchableOpacity>
      </Animated.View>}

      {/* Floating Animated Icon */}
      <TouchableOpacity onPress={handleIconPress} style={styles.iconContainer}>
        <View style={styles.icon}>
          <Animated.View style={[styles.line, line1Style]} />
          <Animated.View style={[styles.line, line2Style]} />
          <Animated.View style={[styles.line, line3Style]} />
        </View>
      </TouchableOpacity>

      {/* Password Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => {Keyboard.dismiss(); setIsModalVisible(false); setAdminPassword('');}}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter Admin Password</Text>
            <TextInput
              autoFocus
              returnKeyType="done"
              keyboardType='number-pad'
              style={styles.input}
              secureTextEntry
              placeholder="Password Pin"
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleOpenAdmin}>
              <Entypo name="chevron-with-circle-right" size={40} color="black" onPress={handleOpenAdmin}/>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 110,
    left: 30,
    backgroundColor: '#007bff',
    borderRadius: 50,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 30,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    marginVertical: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButton: {
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
