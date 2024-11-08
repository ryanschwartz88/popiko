import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import SignOut from "@/components/buttons/SignOut";

export default function Home() {

    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <SignOut />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})