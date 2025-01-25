import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold' }, headerStyle: { backgroundColor: '#007BFF' } }} />
    </>
  );
}
