import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated, View, Platform, Alert, Button } from 'react-native';
import { useRouter } from 'expo-router';
import registerForPushNotificationsAsync from '@/hooks/account/useExpoPush';
import * as Notifications from 'expo-notifications';
import BackButton from '@/components/buttons/BackButton';
import { setExpoPushToken } from '@/hooks/account/useExpoPush';

export default function Welcome() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const handleRegistration = async () => {
    try {
      const existingStatus = await Notifications.getPermissionsAsync();
      if (existingStatus.granted || existingStatus.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        Alert.alert(
          'Notifications Already Enabled',
          'Go to settings to change preferences.',
          [{ text: 'OK' }]
        );
        return;
      }
  
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token ?? null);
  
      if (Platform.OS === 'android') {
        const channels = await Notifications.getNotificationChannelsAsync();
        setChannels(channels ?? []);
      }
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
    } catch (error: any) {
      console.error(error);
    }
  
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  };

  const handleNext = () => {
    Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
    }).start(() => {
        router.push('/auth/Login');
    });
  };
  
  useEffect(() => {
    console.log('Welcome Screen');
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <BackButton />
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        <Text style={styles.title}>In order to receive the full experience of Alune, please allow notifications</Text>
        <Button title="Allow Notifications" onPress={handleRegistration} />
        <Button title="Next" onPress={handleNext} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginTop: 130,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  image: {
    marginTop: 100,
  }
});