import {Tabs} from "expo-router"
import {Ionicons} from '@expo/vector-icons'

export default ()  => {
    return (
        <Tabs>
            <Tabs.Screen 
                name="CameraView" 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="camera" color={color} size={size} />
                    ),
                    tabBarShowLabel: false,
                    headerShown: false
                }} 
            />
            <Tabs.Screen 
                name="FeedView" 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" color={color} size={size} />
                    ),
                    tabBarShowLabel: false,
                    headerShown: false
                }} 
            />
        </Tabs>
    )
}