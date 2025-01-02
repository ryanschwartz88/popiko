import React from "react";
import { Text, View, StyleSheet } from 'react-native';
import SignOut from "@/components/buttons/SignOut";

export default function CurriculumPathway() {

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