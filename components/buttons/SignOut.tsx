import { LargeSecureStore, supabase } from "@/supabase/client";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {useSession} from "@/hooks/useSession";

export default function SignOut() {
    const handleSignOut = async () => {
        const error = await supabase.auth.signOut();
        router.replace('/auth/CreateAccount');
    }
    return (
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2C59B5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});