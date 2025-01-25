import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from '@/hooks/account/useExpoPush';
import { supabase } from '@/hooks/account/client';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';


export const handleRegistration = async (session: Session, role: string) => {
    try {
        // TODO: Fix/ensure this works after first time
        // Register for push notifications 
        const existingStatus = await Notifications.getPermissionsAsync();
        if (existingStatus.granted || existingStatus.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) {
            const { error } = await supabase
                .from('profiles')
                .update({ role: role })
                .eq('id', session.user.id)
                .single();
            if (error) {
                console.error('Error updating push token:', error.message);
            }
        } else if (existingStatus.canAskAgain) {
            const token = await registerForPushNotificationsAsync();
            const { error } = await supabase
                .from('profiles')
                .update({ expo_push_token: token, role: role })
                .eq('id', session.user.id)
                .single();
            if (error) {
                console.error('Error updating push token:', error.message);
            }
        }

        if (role == 'parent') {
            const { data: parentData, error: parentError } = await supabase
                .from('parents')
                .insert({ id: session.user.id })
                .single();

            if (parentError) {
                console.error('Error creating parent:', parentError.message);
            }
            router.replace({
                pathname: '/admin/client/[id]',
                params: { id: session.user.id },
            });
        } else if (role == 'instructor' || role == 'admin') {
            const { data: instructorData, error: instructorError } = await supabase
                .from('instructors')
                .upsert({ id: session.user.id, email: session.user.email }, { onConflict: 'email' })
                .single();

            if (instructorError) {
                console.error('Error creating instructor:', instructorError.message);
            }
            if (role == 'instructor') {
                router.replace('/instructor');
            } else if (role == 'admin') {
                console.log('Admin created');
                router.replace('/admin');
            } else {
                router.replace('/');
            }
        }
    } catch (error: any) {
        console.error(error);
    }
};