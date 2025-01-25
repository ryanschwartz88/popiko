// ChildItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Child } from '@/types/client';

const ChildItem: React.FC<Child> = ({ id, name, skill_group, last_obtained_skill }) => {
    const lastSkill = last_obtained_skill || 'No skills yet'; // Get the last skill or a default message

    return (
        <View style={styles.childItemContainer}>
            <Text style={styles.childName}>{name}</Text>
            <Text style={styles.childSkillGroup}>Skill Group: {skill_group}</Text>
            <Text style={styles.childLastSkill}>{`Last Skill: ${lastSkill}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    childItemContainer: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
        borderRadius: 20,
    },
    childName: {
        fontSize: 18,
        fontWeight: '600',
    },
    childSkillGroup: {
        fontSize: 16,
        color: '#666',
    },
    childLastSkill: {
        fontSize: 14,
        color: '#333',
    },
});

export default ChildItem;
