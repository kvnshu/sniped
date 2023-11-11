import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import CustomTextInput from '../components/CustomTextInput'; // Import the custom component
import {useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton'; // Import the new component
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

const FirstNameInputView = () => {
    const [firstName, setFirstName] = useState('');

    const isButtonDisabled = firstName.trim().length === 0;

    
    const insets = useSafeAreaInsets();

    const handlePress = async () => {
        await supabase
            .from('users')
            .update()
      // router.push("/ProfilePictureUploadView")
    }

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
                    onPress={() => handlePress()} 
                    disabled={isButtonDisabled} // Button is disabled if firstName
                />
            </View>
        </View>
    </KeyboardAvoidingView>
    );
};


export default FirstNameInputView;