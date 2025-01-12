import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Popiko</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginTop: 130,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  image: {
    marginTop: 100,
  }
});