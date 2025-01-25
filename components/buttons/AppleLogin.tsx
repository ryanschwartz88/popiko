import { Platform, TouchableOpacity, View, StyleSheet, Text } from 'react-native'
import React, { useState } from 'react'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '@/hooks/account/client'
import { useRouter } from 'expo-router'
import CustomAlert from '@/components/modals/ErrorAlert'
import Icon from 'react-native-vector-icons/FontAwesome'
import { handleRegistration } from '@/hooks/account/handleRegistration'
import { Session } from '@supabase/supabase-js'

/* 
TODO: Handle apple sign in error

The AppleLogin component is used to authenticate users using the Apple Sign-In API.
It uses the AppleAuthentication library to sign in users with the Apple Sign-In API.

*/

type AuthProps = {
  role?: string
  setSessionRole?: (role: string) => void
}

export default function AppleAuth({role, setSessionRole}: AuthProps) {
  const [alertVisible, setAlertVisible] = useState(false);
  const router = useRouter();

  const handleAppleSignIn = async () => {
    if (Platform.OS === 'ios') {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        if (credential.identityToken) {
          const { error, data } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: credential.identityToken,
          });
          if (!error) {
            if (!data.session) throw new Error('User not found');
            if (role && setSessionRole) {
              setSessionRole(role);
              await handleRegistration(data.session, role);
            } else {
              router.replace('/');
            };
          }
        } else {
          throw new Error('No identityToken.');
        }
      } catch (e : any) {
        if (e.code === 'ERR_REQUEST_CANCELED') {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
          console.error(e);
        }
      }
    } else {
      setAlertVisible(true);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleAppleSignIn}>
        <View style={styles.content}>
          <Icon name="apple" size={24} color="black" style={styles.logo} />
          <Text style={styles.text}>Continue with Apple</Text>
        </View>
      </TouchableOpacity>
      {alertVisible && (
        <CustomAlert
          message="Apple login is not supported on this device."
          onClose={() => setAlertVisible(false)}
        />
      )}
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