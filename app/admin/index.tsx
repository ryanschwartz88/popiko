import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Dimensions, SafeAreaView, Alert } from 'react-native';
import { useEvents } from '@/hooks/event/useEvents';
import { sections } from '@/constants/childrenSkills';
import SelectDropdown from 'react-native-select-dropdown';
import { CalendarEvent } from '@/types/event';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUpdateEvent } from '@/hooks/event/useUpdateEvent';
import { useSession } from '@/hooks/account/useSession';

export default function AdminDashboard() {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [updatedSkillGroup, setUpdatedSkillGroup] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [updatedLastSkill, setUpdatedLastSkill] = useState('');
    const { updateEvent } = useUpdateEvent();

    const today = useMemo(() => new Date(), []);

    const startOfDay = today.setHours(0, 0, 0, 0);
    const endOfDay = today.setHours(23, 59, 59, 999);
    const events = useEvents(new Date(startOfDay), new Date(endOfDay))?.filter((event) => event.status === 'booked');

    const handleEventPress = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setUpdatedSkillGroup(event.skill_group || '');
        setUpdatedStatus(event.status);
        setUpdatedLastSkill('');
        setModalVisible(true);
    };

    const handleSave = async() => {
        // Logic to save the updated values for the selected event
        if (updatedLastSkill === '' || updatedSkillGroup === '' || updatedStatus === '') {
            Alert.alert('Please fill in all fields.');
            return;
        }
        if (selectedEvent !== null) {
            const updatedEvent = { ...selectedEvent, skill_group: updatedSkillGroup, status: updatedStatus};
            await updateEvent(updatedEvent, updatedSkillGroup, updatedLastSkill);
            setModalVisible(false);
        }
    };

    const renderEventItem = ({ item }: { item: CalendarEvent }) => (
        <TouchableOpacity onPress={() => handleEventPress(item)} style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{`Instructor: ${item.instructorName || 'N/A'}`}</Text>
            <Text>{`Time: ${new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(item.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{today.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            {events.length > 0 ? (
                <FlatList
                    data={events}
                    renderItem={renderEventItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.noEventsText}>No events today</Text>
            )}
            {selectedEvent && (
                <Modal visible={modalVisible} animationType="fade" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Post Lesson Check List</Text>
                            <Text style={styles.modalLabel}>Status</Text>
                            <SelectDropdown
                                data={['completed', 'noshow', 'cancelled']}
                                dropdownStyle={styles.dropdownMenuStyle}
                                onSelect={(selectedItem) => setUpdatedStatus(selectedItem)}
                                renderButton={(selectedItem, isOpened) => (
                                    <View style={styles.dropdownButtonStyle}>
                                        <Text style={styles.dropdownButtonTxtStyle}>
                                            {selectedItem || 'Select Status'}
                                        </Text>
                                        <Icon
                                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                                            style={styles.dropdownButtonArrowStyle}
                                        />
                                    </View>
                                )}
                                renderItem={(item, index, isSelected) => (
                                    <View
                                        style={{
                                            ...styles.dropdownItemStyle,
                                            ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                        }}
                                    >
                                        <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                                    </View>
                                )}
                            />
                            <Text style={styles.modalLabel}>Skill Group</Text>
                            <SelectDropdown
                                data={sections.map((section) => section.title)}
                                dropdownStyle={styles.dropdownMenuStyle}
                                onSelect={(selectedItem) => setUpdatedSkillGroup(selectedItem)}
                                renderButton={(selectedItem, isOpened) => (
                                    <View style={styles.dropdownButtonStyle}>
                                        <Text style={styles.dropdownButtonTxtStyle}>
                                            {selectedItem || 'Select Skill Group'}
                                        </Text>
                                        <Icon
                                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                                            style={styles.dropdownButtonArrowStyle}
                                        />
                                    </View>
                                )}
                                renderItem={(item, index, isSelected) => (
                                    <View
                                        style={{
                                            ...styles.dropdownItemStyle,
                                            ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                        }}
                                    >
                                        <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                                    </View>
                                )}
                            />

                            

                            <Text style={styles.modalLabel}>Last Obtained Skill</Text>
                            <SelectDropdown
                                data={sections
                                    .flatMap((section) => section.units)
                                    .flatMap((unit) => unit.skills.map((skill) => skill.name))}
                                dropdownStyle={styles.dropdownMenuStyle}
                                onSelect={(selectedItem) => setUpdatedLastSkill(selectedItem)}
                                renderButton={(selectedItem, isOpened) => (
                                    <View style={styles.dropdownButtonStyle}>
                                        <Text style={styles.dropdownButtonTxtStyle}>
                                            {selectedItem || 'Select Last Skill'}
                                        </Text>
                                        <Icon
                                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                                            style={styles.dropdownButtonArrowStyle}
                                        />
                                    </View>
                                )}
                                renderItem={(item, index, isSelected) => (
                                    <View
                                        style={{
                                            ...styles.dropdownItemStyle,
                                            ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                        }}
                                    >
                                        <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                                    </View>
                                )}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    noEventsText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        flexGrow: 1,
    },
    eventItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        height: '40%',
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalLabel: {
        fontSize: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    saveButton: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 8,
        marginTop: 24,
        minWidth: 100,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 8,
        marginTop: 24,
        minWidth: 100,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    dropdownButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
    },
    dropdownButtonTxtStyle: { fontSize: 16 },
    dropdownButtonArrowStyle: { fontSize: 16 },
    dropdownItemStyle: { padding: 10 },
    dropdownItemTxtStyle: { fontSize: 16 },
    dropdownMenuStyle: {
        borderRadius: 8,
    },
});

