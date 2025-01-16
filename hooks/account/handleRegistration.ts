import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from '@/hooks/account/useExpoPush';
import { supabase } from '@/hooks/account/client';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useSession } from '@/hooks/account/useSession';


export const handleRegistration = async (session: Session, role: string) => {
    try {
        const existingStatus = await Notifications.getPermissionsAsync();
        if (existingStatus.granted || existingStatus.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
            return;
        }
        const token = await registerForPushNotificationsAsync();
        const { data, error } = await supabase
            .from('profiles')
            .update({ expo_push_token: null, role: role })
            .eq('id', session.user.id)
            .single();

        if (error) {
                console.error('Error updating push token:', error.message);
        } else {
                console.log('Push token updated:', data);
        }

        if (role == 'parent') {
            const { data: parentData, error: parentError } = await supabase
                .from('parents')
                .insert({ id: session.user.id })
                .single();

            if (parentError) {
                console.error('Error creating parent:', parentError.message);
            }
            router.replace('/onboarding/client/UserInfo');
        } else if (role == 'instructor' || role == 'admin') {
            const { data: instructorData, error: instructorError } = await supabase
                .from('instructors')
                .upsert({ id: session.user.id, email: session.user.email }, { onConflict: 'email' })
                .single();

            if (instructorError) {
                console.error('Error creating instructor:', instructorError.message);
            }
            router.replace('/');
        }
    } catch (error: any) {
        console.error(error);
    }
};