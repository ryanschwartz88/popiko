import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { router } from "expo-router";
import { useEvents } from "@/hooks/useEvents";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(startDate.getDate() + 7)));
    const events = useEvents(startDate, endDate);

    return (
        <SafeAreaView style={styles.container}>
            <Text>Calendar</Text>

            
        </SafeAreaView>
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