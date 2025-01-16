import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, Keyboard, View, TouchableOpacity, Platform } from 'react-native';
import AppleAuth from '@/components/buttons/AppleLogin';
import GoogleAuth from '@/components/buttons/GoogleLogin';
import { useRouter } from 'expo-router';
import { supabase } from '@/hooks/account/client';
import CustomAlert from '@/components/modals/ErrorAlert';
import { Input } from '@rneui/themed';
import NextButton from '@/assets/buttons/next-button.svg';
import registerForPushNotificationsAsync from '@/hooks/account/useExpoPush';
import * as Notifications from 'expo-notifications';
import BackButton from '@/components/buttons/BackButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);


  const signinWithEmail = async () => {
    setLoading(true);
    try {
      if (!email || !password) throw new Error('Email and password are required');
      const {data, error} = await supabase.auth.signInWithPassword({email, password});
      if (error) throw error;
      if (!data.session) throw new Error('User not found');
      router.replace('/'); 
    } catch (error) {
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Pressable style={styles.container} onPress={() => {Keyboard.dismiss()}}>
      <BackButton />
      {alertVisible && <CustomAlert
        message="Invalid email or password"
        onClose={() => setAlertVisible(false)}
      /> }
      <Text style={styles.title}>Log In</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.title}>Or</Text>
      <GoogleAuth />
      <AppleAuth />
      <TouchableOpacity style={styles.mt20} onPress={signinWithEmail}>
        <NextButton width={59} height={59} style={{alignSelf: 'center', marginTop: 20}}/>
      </TouchableOpacity>
    </Pressable>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});