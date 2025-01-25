import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getClients } from '@/hooks/client/getClients';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Client } from '@/types/client';
import { MaterialIcons } from '@expo/vector-icons';

export default function ClientOnboarding() {
    const router = useRouter();
    const [parents, setParents] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch the clients
        async function fetchClients() {
            try {
                const data = await getClients();
				const clients: Client[] = data.map((client: any) => ({
					id: client.id,
					name: client.name,
					plan: client.plan,
					created_at: client.created_at,
					email: client.profiles.email
				}))

				setParents(clients);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
			<Text style={styles.title}>Clients</Text>
            {/* FlatList to display parents */}
            <FlatList
                data={parents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable 
						style={styles.parentItem} 
						onPress={() => {
							router.push({
							  pathname: '/admin/client/[id]',
							  params: { id: item.id },
							});
						}}
					>
						<View>
							<Text style={styles.nameText}>{item.name}</Text>
							<Text style={styles.planText}>{item.plan}</Text>
							<Text style={styles.emailText}>{item.email}</Text>
							<Text style={styles.dateText}>
								Joined: {new Date(item.created_at).toLocaleDateString()}
							</Text>
						</View>
						<MaterialIcons name="keyboard-arrow-right" size={40} color="black" />
                        
                    </Pressable>
                )}
                contentContainerStyle={styles.listContent}
            />
			{/* Add New Client Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/auth/client/CreateAccount')}
            >
                <Text style={styles.addButtonText}>Add New Client</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: isTablet ? 40 : 20,
        paddingTop: 20,
    },
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		alignSelf: 'center',
	},
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    addButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
        alignSelf: isTablet ? 'flex-start' : 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: 20,
    },
    parentItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    planText: {
        fontSize: 16,
        color: '#555',
    },
    emailText: {
        fontSize: 14,
        color: '#777',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
});
