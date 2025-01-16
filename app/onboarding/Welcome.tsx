import { useRouter, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, Alert, Modal, Animated, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';
import { supabase } from '@/hooks/account/client';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Input } from '@rneui/themed';

export default function Welcome() {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(100)).current;
	const fadeOutAnim = useRef(new Animated.Value(1)).current;
	const router = useRouter();
	const focused = useNavigation().isFocused();
	const [modalVisible, setModalVisible] = useState(false);
	const [adminPassword, setAdminPassword] = useState('');
	

	useEffect(() => {
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 1000,
			useNativeDriver: true,
		}).start();
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 2500,
			useNativeDriver: true,
		}).start();
	}, [focused]);

	const handleCreateAccount = async () => {
		const { data, error} = await supabase.functions.invoke('internal-password-check', {
			body: { adminPasswordInput: adminPassword },
		});
		if (error) {
			Alert.alert('Invalid admin password');
		} else {
			if (data) {
				router.push('/auth/instructor/CreateAccount');
				setModalVisible(false);
			}
		}
	}
	return (
		<View style={styles.container}>
			<Animated.View style={[styles.textContainer, { transform: [{ translateY: slideAnim }], opacity: fadeOutAnim }]}>
				<Text style={styles.welcomeText}>Welcome</Text>
				<Text style={styles.toText}>to</Text>
				<View style={styles.logoContainer}>
					<Text style={styles.popikoText}>Popiko</Text>
				</View>
			</Animated.View>
			<Animated.View style={{ opacity: fadeAnim }}>
				<TouchableOpacity style={styles.button} onPress={() => router.push('/auth/Login')}>
					<Text style={styles.buttonText}>Sign In</Text>
				</TouchableOpacity>
				<View style={styles.userContainer}>
					<Text style={styles.userText}>New Team Member?   </Text>
					<TouchableOpacity onPress={() => setModalVisible(true)}>
						<Text style={styles.linkText}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
			<Modal
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
				transparent={true}
				animationType="fade"
				>
				<View style={styles.overlay}>
					<View style={styles.content}>
						<MaterialIcons
							name="close"
							size={24}
							onPress={() => setModalVisible(false)}
							style={styles.closeButton}
						/>
						<Text style={styles.title}>Popiko Staff Password</Text>
						<Text style={styles.subtitle}>
							Only authorized staff members can create instructor accounts. Enter the password below.
						</Text>
						<Input
							placeholder="Password"
							value={adminPassword}
							onChangeText={(text) => setAdminPassword(text)}
							secureTextEntry
						/>
						<Entypo name="chevron-with-circle-right" size={40} color="black" onPress={handleCreateAccount}/>
					</View>
				</View>
			</Modal>

		</View>
	);
}


const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  alignItems: 'center',
	  justifyContent: 'space-evenly',
	  backgroundColor: '#142850',
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
		justifyContent: 'center',
		alignItems: 'center',
	},
    textContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        fontFamily: 'Inter-ExtraBold',
        fontWeight: '800',
        fontSize: 45,
        marginBottom: 10,
		color: '#fffbf7',
    },
    toText: {
        fontFamily: 'Inter-Bold',
        fontWeight: '700',
        fontSize: 30,
        marginBottom: 10,
		color: '#fffbf7',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    popikoText: {
        fontFamily: 'Inter-ExtraBold',
        fontWeight: '800',
        fontSize: 50,
        marginLeft: 10,
		color: '#fffbf7',
    },
	button: {
	  marginTop: 20,
	  backgroundColor: '#007AFF',
	  alignSelf: 'center',
	  paddingVertical: 12,
	  paddingHorizontal: 50,
	  borderRadius: 20,
	},
	buttonText: {
	  fontSize: 24,
	  fontWeight: 'bold',
	  textAlign: 'center',
	  color: '#fff',
	},
	userContainer: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  marginTop: 20,
	},
	userText: {
	  fontFamily: 'Inter-Italic',
	  fontSize: 13,
	  fontWeight: '600',
	  textAlign: 'center',
	  color: '#fffbf7',
	},
	linkText: {
	  fontFamily: 'Inter-Italic',
	  fontSize: 13,
	  fontWeight: '600',
	  textAlign: 'center',
	  textDecorationLine: 'underline',
	  color: '#fffbf7',
	},
	content: {
		backgroundColor: '#fff', 
		borderRadius: 10,
		padding: 20,
		width: '80%',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	closeButton: {
		alignSelf: 'flex-end',
		color: '#333',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 10,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 14,
		color: '#666',
		marginBottom: 20,
		textAlign: 'center',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',

	},
  });
