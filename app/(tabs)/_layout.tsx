import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from '@/hooks/account/useSession';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const { session, isLoading, role, accountData } = useSession();
  const [appIsReady, setAppIsReady] = useState(false);

  // Prevent splash screen from hiding until the app is ready
  useEffect(() => {
    async function prepare() {
      if (!isLoading && role && accountData) {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [isLoading, role, accountData]);

  // Show loading indicator while app or role is being prepared
  if (isLoading || !appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator color="#007BFF" />
      </View>
    );
  }

  // Redirect to sign-in page if no session exists
  if (!session) {
    return <Redirect href="/onboarding/Welcome" />;
  }

  // Role-based redirection
  if (role === 'instructor') {
    return <Redirect href="/instructor" />;
  } else if (role === 'admin') {
    return <Redirect href="/admin" />;
  } else if (role === 'parent') {
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: '#758EBF' },
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        {/* Index Tab */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <FontAwesome5
                name={focused ? 'calendar-check' : 'calendar'}
                size={size}
                color="#fff"
              />
            ),
          }}
        />

        {/* Course Tab */}
        <Tabs.Screen
          name="course"
          options={{
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons
                name={focused ? 'map-marker' : 'map-marker-outline'}
                size={size}
                color="#fff"
              />
            ),
          }}
        />
      </Tabs>
    );
  }

  // Fallback loading state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator color="#007BFF" />
    </View>
  );
}
