import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSession } from '@/hooks/account/useSession';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '@/hooks/account/client';

export default function TabLayout() {
	const { session, isLoading, role } = useSession();
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		async function prepare() {
			// Keep the splash screen visible while loading
			await SplashScreen.preventAutoHideAsync();

			// Simulate any necessary loading (e.g., fetching assets or data)
			if (!isLoading) {
				setAppIsReady(true);
			}
		}

		prepare();
	}, [isLoading]);

	useEffect(() => {
		// Hide the splash screen once the app is ready
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		// Keep splash screen visible while loading
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	// Redirect to the sign-in page if the user is not authenticated
	if (!session) {
		return <Redirect href="/onboarding/Welcome" />;
	}

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
	} else {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	
}
