import { useLocalSearchParams } from 'expo-router'; 
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Button, FlatList } from 'react-native';
import { getClients } from '@/hooks/client/getClients';
import { Client } from '@/types/client';
import { getChildren } from '@/hooks/client/getChildren';
import BackButton from '@/components/buttons/BackButton';
import { FontAwesome5 } from '@expo/vector-icons';
import { PaymentOptions } from '@/constants/payment';
import SelectDropdown from 'react-native-select-dropdown';
import ChildItem from '@/components/admin/ChildItem';

export default function ParentDashboard() {
    const { id } = useLocalSearchParams();
    const [parent, setParent] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newPlan, setNewPlan] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const client = await getClients(id);
                const parents: Client[] = client.map((client: any) => ({
                    id: client.id,
                    name: client.name,
                    plan: client.plan,
                    created_at: client.created_at,
                    email: client.profiles.email,
                }));
                const children = await getChildren(id);
                let curParent = parents.find((parent: Client) => parent.id === id) || parents[0];
                curParent.children = children;
                setParent(curParent);
                setNewName(curParent.name || 'Choose Name');
                setNewPlan(curParent.plan || 'Monthly'); // Default plan value
            } catch (error) {
                console.error('Error fetching user info:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    const handleUpdateName = () => {
        console.log('Updated Name:', newName);
        setParent(prev => prev ? { ...prev, name: newName } : prev);
        setIsEditingName(false);
    };

    const handleUpdatePlan = (selectedPlan: string) => {
        console.log('Updated Plan:', selectedPlan);
        setParent(prev => prev ? { ...prev, plan: selectedPlan } : prev);
        setNewPlan(selectedPlan);
    };

    const handleAddChild = () => {
        console.log('Add Child clicked');
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.contentContainer}>
                {/* Name Field */}
                <View style={styles.fieldContainer}>
                    {isEditingName ? (
                        <TextInput
                            value={newName}
                            style={styles.nameInput}
                            onChangeText={setNewName}
                            onSubmitEditing={handleUpdateName}
                            onBlur={handleUpdateName}
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.nameInput}>{newName}</Text>
                    )}
                    <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.iconContainer}>
                        <FontAwesome5 name="pen" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Plan Field with SelectDropdown */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.planInput}>Plan:</Text>
                    <SelectDropdown
                        data={PaymentOptions}
                        defaultValue={newPlan}
                        onSelect={handleUpdatePlan}
                        dropdownStyle={styles.dropdownMenuStyle}
                        renderButton={() => (
                            <View style={styles.dropdownHeaderStyle}>
                                <Text style={styles.dropdownHeaderText}>{newPlan}</Text>
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
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Children Section */}
                {parent?.children && <View style={styles.childContainer}>
                    <Text style={styles.childHeader}>Children:</Text>
                    <FlatList 
                        data={parent?.children}
                        renderItem={({ item }) => <ChildItem {...item} />}
                        keyExtractor={(item) => item.id}
                    />
                </View>}

                {/* Add Child Button */}
                <TouchableOpacity onPress={handleAddChild} style={styles.addButton}>
                    <FontAwesome5 name="user-plus" size={20} color="white" style={styles.iconContainer} />
                    <Text style={styles.addButtonText}>Add Child</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    contentContainer: {
        marginTop: 40,
        width: '80%',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    childContainer: {
        marginBottom: 20,
    },
    nameInput: {
        borderBottomWidth: 1,
        fontWeight: 'bold',
        borderColor: '#ccc',
        marginRight: 10,
        padding: 5,
        fontSize: 40,
    },
    planInput: {
        borderBottomWidth: 1,
        fontWeight: '600',
        borderColor: '#ccc',
        padding: 5,
        fontSize: 20,
    },
    iconContainer: {
        padding: 5,
    },
    dropdownButtonStyle: {
        width: '100%',
        height: 40,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        paddingLeft: 10,
        justifyContent: 'center',
    },
    dropdownButtonTxtStyle: {
        fontSize: 18,
        textAlign: 'left',
    },
    dropdownMenuStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        maxHeight: 200,
    },
    dropdownHeaderStyle: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    dropdownHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdownItemStyle: {
        padding: 10,
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginVertical: 20,
    },
    childItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    childHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    childText: {
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
