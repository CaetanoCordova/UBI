import { Stack } from "expo-router";

export default function DestinoLayout() {
    return <Stack>
        <Stack.Screen
            name="index"
            options={{ title: 'Mapa',
            headerShown: false,
            }}
            
        />
    </Stack>
}