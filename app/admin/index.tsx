import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useEvents } from '@/hooks/event/useEvents';
import { sections } from '@/constants/childrenSkills';
import SelectDropdown from 'react-native-select-dropdown';
import { CalendarEvent } from '@/types/event';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUpdateEvent } from '@/hooks/event/useUpdateEvent';
import Accordion from 'react-native-collapsible/Accordion';
import { Feather } from '@expo/vector-icons';

export default function AdminDashboard() {
    const [updatedSkillGroup, setUpdatedSkillGroup] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [updatedLastSkill, setUpdatedLastSkill] = useState('');
    const [skillOptions, setSkillOptions] = useState<string[]>([]);
    const { updateEvent } = useUpdateEvent();
    const [activeSections, setActiveSections] = useState<number[]>([]);

    const today = useMemo(() => new Date(), []);

    useEffect(() => {
        const currentSection = sections.find((section) => section.title === updatedSkillGroup);
        if (!currentSection) return;
        setSkillOptions(currentSection.units.flatMap((unit) => unit.skills).map((skill) => skill.name));
    }, [updatedSkillGroup]);

    const startOfDay = today.setHours(0, 0, 0, 0);
    const endOfDay = today.setHours(23, 59, 59, 999);
    let events = useEvents(new Date(startOfDay), new Date(endOfDay)).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const handleSave = async(item: CalendarEvent) => {
        // Logic to save the updated values for the selected event
        if (updatedLastSkill === '' || updatedSkillGroup === '' || updatedStatus === '') {
            Alert.alert('Please fill in all fields.');
            return;
        }
        if (item) {
            // Create a new updated event by copying the existing item and updating specific fields
            const updatedEvent: CalendarEvent = {
                ...item, // Spread the existing item properties
                status: updatedStatus, // Update the status
                skill_group: updatedSkillGroup, // Update the skill group
            };
    
            // Call the function to update the event with the new values
            await updateEvent(updatedEvent, updatedSkillGroup, updatedLastSkill);
            item.status = updatedStatus;
            item.skill_group = updatedSkillGroup;
            setActiveSections([]);
        } else {
            Alert.alert('No event selected to update.');
        }
    };

    const renderEventHeader = (item: CalendarEvent) => (
        <View style={styles.eventItem}>
            <View style={styles.eventContainer}>
                <View>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text>{`Instructor: ${item.instructorName || 'N/A'}`}</Text>
                    <Text>{`Time: ${new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(item.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}</Text>
                </View>
                <Feather 
                    name={item.status === 'booked' ? 'circle' : 'check-circle'} 
                    size={24} 
                    color="black" 
                />
            </View>
        </View>
    );

    const renderContent = (item: CalendarEvent) => (
        <View style={styles.accordionContent}>
            <Text style={styles.accordionTitle}>Post Lesson Check List For {item.childName}</Text>
            <Text style={styles.accordionLabel}>Status</Text>
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
                defaultValue={item.status && item.status !== 'booked' ? item.status : 'Select Status'}
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
            <Text style={styles.accordionLabel}>Skill Group</Text>
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
                defaultValue={item.status && item.status !== 'booked' ? item.skill_group : 'Select Skill Group'}
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

            

            <Text style={styles.accordionLabel}>Last Obtained Skill</Text>
            <SelectDropdown
                data={skillOptions}
                disabled={updatedSkillGroup === ''}
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
                defaultValue={item.status && item.status !== 'booked' ? skillOptions.find((skill) => skill === item.last_obtained_skill) : 'Select Last Skill'}
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
                <TouchableOpacity onPress={() => handleSave(item)} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    )

    const handleSectionChange = (sections: number[]) => {
        setActiveSections(sections.slice(-1));
        if (sections.length === 0) {
            setUpdatedStatus('');
            setUpdatedSkillGroup('');
            setUpdatedLastSkill('');
            return;
        }
        const curEvent = events[sections[0]];
        setUpdatedStatus(curEvent.status || '');
        setUpdatedSkillGroup(curEvent.skill_group || '');
        setUpdatedLastSkill(curEvent.last_obtained_skill || '');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>{today.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
            {events.length > 0 ? (
                <Accordion
                    sections={events}
                    renderHeader={(event: CalendarEvent) =>
                        renderEventHeader(event)
                    }
                    renderContent={(event: CalendarEvent) => renderContent(event)}
                    activeSections={activeSections}
                    onChange={(activeSections) => handleSectionChange(activeSections)}
                    expandMultiple={false}
                    renderAsFlatList
                    underlayColor="#fff"
                />
            ) : (
                <Text style={styles.noEventsText}>No events today</Text>
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
    eventItem: {
        padding: 16,
        marginTop: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '90%',
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    accordionContent: {
        alignSelf: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0', // Added matching background color
        borderRadius: 8, // Added to match header style
        width: '90%',
        marginVertical: 8 // Added spacing
    },
    accordionLabel: {
        fontSize: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    accordionItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
    },
    accordionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#007BFF',
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
    dropdownButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
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

