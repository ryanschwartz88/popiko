import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from "react-native-big-calendar";
import { router } from "expo-router";
import { useEvents } from "@/hooks/useEvents";

export default function Home() {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(startDate.getDate() + 7)));
    const events = useEvents(startDate, endDate);

    return (
        <Calendar
            events={events}
            height={400}
        />
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