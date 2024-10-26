import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useSession } from '@/hooks/useSession';

export default function TabLayout() {

  const {session, isLoading} = useSession();

  // Render a loading screen while checking the session state
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Redirect to the sign-in page if the user is not authenticated
  if (!session) {
    return <Redirect href='/(tabs)/' />;
  }

  // Check if the push notifcations have changed
  //checkAndUpdatePermissions(session.user.id);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#758EBF' },
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="schedule" />
    </Tabs>
  );
}
