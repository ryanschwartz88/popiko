import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '@/hooks/account/client';
import { useRouter } from 'expo-router';
import GoogleLogo from '@/assets/images/google-icon.svg'
import { handleRegistration } from '@/hooks/account/handleRegistration'
import { Session } from '@supabase/supabase-js';

/* 

This component is used to render a Google login button. 
It uses the GoogleSignin module from expo-google-signin to handle the login process.

TODO: 
- Add error handling: currently have just apple alerts
- Deal with nonce needed for authentication: currently disabled nonce check for supabase

*/

type AuthProps = {
  role?: string
  setSessionRole?: (role: string) => void
}

export default function GoogleAuth({role, setSessionRole}: AuthProps) {
  const router = useRouter();

  const handleSignInError = (error: any) => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('Sign In Cancelled', 'You cancelled the sign-in process.');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert('In Progress', 'Sign-in is already in progress.');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('Play Services Not Available', 'Google Play Services are not available or outdated.');
    } 
  };

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/userinfo.email'],
    iosClientId: Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_IOS_CLIENT_ID : undefined,
    webClientId: Platform.OS === 'android' ? process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID : undefined,
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
          access_token: tokens.accessToken,
        });
        if (error) throw error;
        if (!data.session) throw new Error('User not found');
        if (role && setSessionRole) {
          setSessionRole(role);
          await handleRegistration(data.session, role);
        } else {
          router.replace('/');
        }
      } else {
        throw new Error('No ID token present!');
      }
    } catch (error) {
      handleSignInError(error);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
        <View style={styles.content}>
          <GoogleLogo width={24} height={24} style={styles.logo} />
          <Text style={styles.text}>Continue with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 312,
    height: 60,
    marginTop: 20,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingHorizontal: 20, 
  },
  logo: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }], 
  },
});