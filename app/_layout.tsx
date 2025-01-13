import { SessionProvider } from '@/hooks/account/useSession';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function RootLayout() {

    return (
        <ThemeProvider value={DefaultTheme}>
        <SessionProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </SessionProvider>
        </ThemeProvider>
    );
}
