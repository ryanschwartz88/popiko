import { LargeSecureStore, supabase } from "@/supabase/client";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {useSession} from "@/hooks/account/useSession";

export default function SignOut() {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }
    return (
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});