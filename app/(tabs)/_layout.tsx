import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useSession } from '@/hooks/account/useSession';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const { session, isLoading } = useSession();

  // TODO : Change loading to splash screen

  // Render a loading screen while checking the session state
  if (isLoading) {
	return <Text>Loading...</Text>;
  }

  // Redirect to the sign-in page if the user is not authenticated
  if (!session) {
	return <Redirect href="/auth/Login" />;
  }

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
			  color={'#fff'}
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
