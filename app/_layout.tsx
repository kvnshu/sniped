import {Stack} from "expo-router";
import { UserProvider } from './contexts/UserContext'; // Correct the path as necessary

const StackLayout = () => {
    return (
        <UserProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
                <Stack.Screen name="(auth)" options={{ headerShown: false}} />
                <Stack.Screen name="index" options={{ headerShown: false}} />
                <Stack.Screen 
                    name="ProfilePictureUploadView" 
                    options={{ headerShown: false }}
                />
            </Stack>
        </UserProvider>
        
    )
}

export default StackLayout
