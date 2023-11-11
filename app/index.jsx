import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts, Inter_900Black, Inter_200ExtraLight, Inter_600SemiBold, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FirstNameInputView from './(auth)/FirstNameInputView';
import { Redirect } from 'expo-router';

const StartPage = () => {
    const loggedIn = false;

    let [fontsLoaded] = useFonts({
        Inter_900Black,
        Inter_200ExtraLight,
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View style={styles.fullScreen}>
            <SafeAreaProvider>
                {loggedIn ? <Redirect href="/FeedView" /> : <FirstNameInputView />}
            </SafeAreaProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});

export default StartPage;
