import {Stack} from "expo-router";


const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
            <Stack.Screen name="(auth)" options={{ headerShown: false}} />
            <Stack.Screen name="index" options={{ headerShown: false}} />
            <Stack.Screen 
                name="ProfilePictureUploadView" 
                options={{ headerShown: false }}
            />
        </Stack>
    )
}

export default StackLayout
