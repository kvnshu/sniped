import {Tabs} from "expo-router"

export default ()  => {
    return (
        <Tabs
        screenOptions={{
            tabBarShowLabel: false, // Hides the tab label
          }}
        >
            <Tabs.Screen name="CameraView" />
            <Tabs.Screen name="FeedView" />
        </Tabs>
    )
}