import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import CustomTextInput from '../components/CustomTextInput'; // Import the custom component
import {useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton'; // Import the new component
import { router } from 'expo-router';

const FirstNameInputView = () => {
    const [firstName, setFirstName] = useState('');
    const insets = useSafeAreaInsets();

    const isButtonDisabled = firstName.trim().length === 0;

    return (
        <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View style={{ flex: 1, paddingTop: insets.top }}>
            <CustomTextInput 
                title="👋 What's your full name?"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Seth Rogan..."
            />
            <View style={{ padding: 20, paddingBottom: insets.bottom }}>
                <PrimaryButton 
                    onPress={() => router.push("ProfilePictureUploadView")} 
                    disabled={isButtonDisabled} // Button is disabled if firstName
                />
            </View>
        </View>
    </KeyboardAvoidingView>
    );
};


export default FirstNameInputView;