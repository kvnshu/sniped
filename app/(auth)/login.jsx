import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { supabase } from '../lib/supabase';
import PhoneNumberInput from '../../components/PhoneNumberInput'; // Import your custom phone number input component
import PrimaryButton from '../../components/PrimaryButton'; // Import your custom button component
import { router } from 'expo-router';
import CustomNumberInput from '../../components/CustomNumberInput';
import CustomTextInput from '../../components/CustomTextInput';
import * as ImagePicker from 'expo-image-picker';


import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [token, setToken] = useState('');
  const [firstName, setFirstName] = useState('');

  const isNameButtonDisabled = firstName.trim().length === 0;
  const isPhoneButtonDisabled = phone.trim().length >= 10;
  const isVerificationEnabled = token.trim().length == 6;
  
  const renderOnboardingScreen = () => {
    switch (onboardingStep) {
      case 0: // Phone Number
        return (
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <PhoneNumberInput
                title="☎️ Phone Number, por favor!"
                value={phone}
                onChangeText={setPhone}
                placeholder="+12345678901"
            />

            <View style={{ padding: 20, paddingBottom: insets.bottom }}>
              <PrimaryButton title="Log in" disabled={loading ||!isPhoneButtonDisabled} onPress={authWithPhone} />
            </View>
          </View>
        );

      case 1: // OTP
        return (
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <CustomNumberInput
                title="OTP"
                value={token}
                onChangeText={setToken}
                placeholder="Enter your OTP"
            />
             <View style={{ padding: 20, paddingBottom: insets.bottom }}>
                <PrimaryButton title="Verify" disabled={loading || !isVerificationEnabled} onPress={verifyOtp} />
              </View>
          </View>
        );

      case 2: // Full Name
        return(
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
                    disabled={isNameButtonDisabled} // Button is disabled if firstName
                />
            </View>
        </View>
        );

      case 3: // Image
        return(
          <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom,backgroundColor: '#000'}}>
            <Text style={styles.title}>💅 Select your profile pic!</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    {profileImage ? (
                        <Image source={{ assets: profileImage }} style={styles.image} />
                    ) : (
                        <Text style={styles.imagePickerText}>Tap here to select image</Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <PrimaryButton 
                    onPress={handleProfileInput()} 
                    disabled={!profileImage} // Button is disabled if no profile image is selected
                />
            </View>
        </View>
        );

      case 4:
        return(
          <Text>Completed onboarding, return to Feed!!</Text>
        );

      default:
        return (
          <Text>Something went wrong. Beep boop buup.</Text>
        );
    }
  };

  const advanceToNextStep = () => {
    setOnboardingStep(prevStep => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setOnboardingStep(prevStep => prevStep - 1);
  };

  async function authWithPhone() {
    setLoading(true);
    console.log(phone)
    const { data, error } = await supabase.auth.signInWithOtp({ phone });

    console.log(data)

    if (error) Alert.alert(error.message);
    setLoading(false);

    advanceToNextStep();
    
  }

  async function verifyOtp() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone, token, type: 'sms',
    });

    if (error) {
      Alert.alert(error.message);
      setPhoneProvided(false);
      return
    } 

    // TODO: FIX THIS LOGIC
    // insert value into 
    const { data: users, selectError } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', phone)
    
    userExists = users.length != 0;

    if (userExists){
     //router.push('/');
     console.log("user exists");
    } else {
      //router.push('/FirstNameInputView');
      console.log("user doesnt exists");
    }
    setLoading(false);

    advanceToNextStep();
  }

  async function handleNameInput(){
    
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled) {
        setProfileImage(result.uri);
    }
  };


  async function handleProfileInput() {
    advanceToNextStep();
  };

  // Function to render current onboarding screen based on step


  return (
    <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        {renderOnboardingScreen()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Set the background color for the safe area
  },
container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
    alignItems: 'stretch', // Stretch child components
    justifyContent: 'flex-start', // Align to top
    paddingTop: 20, // Add padding at the top
},
imagePicker: {
  backgroundColor: '#333',
  borderRadius: 20,
  width: 300,
  height: 300,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  overflow: 'hidden',
},
image: {
  width: '100%',
  height: '100%',
},
imagePickerText: {
  color: '#fff',
  textAlign: 'center',
}
  // ... other styles you might need ...
});
