import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-big-calendar'; // Import Calendar
import { useEvents } from '@/hooks/useEvents'; // Assuming this is your hook for fetching events

export default function Home() {
    // Manage the visible date range
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek;
    });

    // Fetch events using the hook
    const events = useEvents(startDate, endDate);

    

    const handleSwipe: (newDate: Date) => void = (newDate) => {
        setCurrentDate(newDate);
    
        const updatedStartDate = new Date(newDate); // Clone newDate
        const updatedEndDate = new Date(newDate);
        updatedEndDate.setDate(newDate.getDate() + 7);
    
        setStartDate(updatedStartDate);
        setEndDate(updatedEndDate);
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Calendar</Text>

            <Calendar
                mode="week"
                events={events}
                height={600}
                showAllDayEventCell={false}
                weekStartsOn={1} // Monday
                minHour={8} // Start of visible hours
                maxHour={20} // End of visible hours
                onSwipeEnd={handleSwipe}
                ampm={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
