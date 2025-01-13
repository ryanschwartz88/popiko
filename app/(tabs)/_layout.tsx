import { Redirect, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useSession } from '@/hooks/account/useSession';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  	const { session, isLoading, role } = useSession();

  	// TODO : Change loading to splash screen
  	const [loaded] = useFonts({
		Inter_400Regular,
		Inter_700Bold,
	});

	useEffect(() => {
		if (loaded && !isLoading) {
			SplashScreen.hideAsync();
		}
	}, [loaded, isLoading]);

	if (!loaded) {
		return null;
	}

	// Redirect to the sign-in page if the user is not authenticated
	if (!session || !role) {
		return <Redirect href="/auth/client/Login" />;
	}

	if (role === 'instructor') {
		return <Redirect href="/instructor" />;
	} else if (role === 'admin') {
		return <Redirect href="/admin" />;
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
