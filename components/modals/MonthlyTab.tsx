    import React, { useState, useMemo } from 'react';
    import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    } from 'react-native';
    import Accordion from 'react-native-collapsible/Accordion';
    import { MaterialIcons } from '@expo/vector-icons';
    import { useEvents } from '@/hooks/event/useEvents';
    import { useAccount } from '@/hooks/account/useAccount';
    import { useSession } from '@/hooks/account/useSession';
    import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
    import { CalendarEvent } from '@/types/event';

    const MonthlyTab: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentDate = new Date();
        return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
        };
    });

    const { currentAccountUuid, accountData } = useAccount();
    const { session } = useSession();
    const parentAccount = currentAccountUuid === session?.user.id;

    const createdAt = new Date(accountData.created_at);
    const currentDate = new Date();

    // Generate months from account creation to now
    const months = useMemo(() => {
        const monthsArray = [];
        let current = currentDate;

        while (current >= createdAt) {
        monthsArray.push(format(current, 'MMM yyyy'));
        current = subMonths(current, 1);
        }

        return monthsArray;
    }, [createdAt, currentDate]);

    const events = useEvents(selectedMonth.start, selectedMonth.end);

    const filteredEvents =
        parentAccount
            ? events.filter((event) => 
                event.user_id === currentAccountUuid &&
                (event.status === 'booked' || event.status === 'completed'))
            : events.filter((event) => 
                event.childID === currentAccountUuid &&
                (event.status === 'booked' || event.status === 'completed'));

    // Accordion Render Methods
    const renderHeader = (month: string, index: number, isActive: boolean) => (
        <View style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>{month}</Text>
        <MaterialIcons
            name={isActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color="black"
        />
        </View>
    );

    const handleSectionChange = (indexes: number[]) => {
        if (indexes.length > 0) {
            // Get the first active index (only one section open due to expandMultiple being false)
            const selectedIndex = indexes[0];
            const selectedMonthDate = subMonths(currentDate, selectedIndex);
        
            // Update the active sections and selected month
            setActiveSections(indexes);
            setSelectedMonth({
            start: startOfMonth(selectedMonthDate),
            end: endOfMonth(selectedMonthDate),
            });
        } else {
            // No sections are active, reset to current month
            setActiveSections([]);
            setSelectedMonth(() => {
            const currentDate = new Date();
            return {
                start: startOfMonth(currentDate),
                end: endOfMonth(currentDate),
            };
            });
        }
    };
      


    const renderContent = (month: string) => {
        const monthEvents = filteredEvents;

        return (
        <View style={styles.accordionContent}>
            {monthEvents.length > 0 ? (
            monthEvents.map((event: CalendarEvent) => (
                <Text key={event.id} style={styles.eventText}>
                {event.start.toLocaleDateString('en-CA')} - {event.cost}
                </Text>
            ))
            ) : (
            <Text style={styles.noEventsText}>No lessons for {month}.</Text>
            )}
        </View>
        );
    };

    return (
        <>
        {/* Button to open the modal */}
        <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setModalVisible(true)}
        >
            <MaterialIcons name="receipt-long" size={24} color="black" />
        </TouchableOpacity>

        {/* Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {/* Close Button */}
                <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                >
                <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>

                <Text style={styles.modalText}>Invoices</Text>

                <Accordion
                sections={months}
                activeSections={activeSections}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={handleSectionChange} // Keep only one section open
                expandMultiple={false} // Allow only one section at a time
                />
            </View>
            </View>
        </Modal>
        </>
    );
    };

    const styles = StyleSheet.create({
    iconButton: {
        marginRight: 10,
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: 'white',
        minHeight: '90%',
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        padding: 35,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 20,
        right: 20,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    accordionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    accordionContent: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    eventText: {
        fontSize: 14,
        marginBottom: 5,
    },
    noEventsText: {
        fontSize: 14,
        color: 'gray',
    },
    });

    export default MonthlyTab;
