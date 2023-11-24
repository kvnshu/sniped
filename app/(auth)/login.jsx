import React, { useState } from 'react';
import { View, Image, Text, Alert, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import PhoneNumberInput from '../../components/PhoneNumberInput'; // Import your custom phone number input component
import PrimaryButton from '../../components/PrimaryButton'; // Import your custom button component
import CustomNumberInput from '../../components/CustomNumberInput';
import CustomTextInput from '../../components/CustomTextInput';
import { parsePhoneNumberFromString, isValidNumber, parse } from 'libphonenumber-js';
import { decode } from 'base64-arraybuffer'
import { useUser } from '../contexts/UserContext';

export default function Login() {

  const [loading, setLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [phoneInput, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [fullName, setFirstName] = useState('');
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState(null);

  const isNameButtonDisabled = fullName.trim().length === 0;
  const isPhoneButtonDisabled = phoneInput.trim().length >= 10;
  const isVerificationEnabled = token.trim().length == 6;

  const { user, setUser } = useUser(); 

  

  const renderOnboardingScreen = () => {
    switch (onboardingStep) {
      case 0: // Phone Number
        return (
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <PhoneNumberInput
              title="☎️ Phone Number, por favor!"
              value={phoneInput}
              onChangeText={setPhone}
              placeholder="12345678901"
            />

            <View style={{ padding: 20, paddingBottom: insets.bottom }}>
              <PrimaryButton title="Log in" disabled={loading || !isPhoneButtonDisabled} onPress={authWithPhone} />
            </View>
          </View>
        );

      case 1: // OTP
        return (
          <View style={{ flex: 1, paddingTop: insets.top }}>
             <CustomNumberInput
              title="Verify Phone Number"
              value={token}
              onChangeText={setToken}
              placeholder="Enter the code sent to your phone"
            />
            <View style={{ padding: 20, paddingBottom: insets.bottom }}>
              <PrimaryButton title="Verify" disabled={loading || !isVerificationEnabled} onPress={verifyOtp} />
            </View>
          </View>
        );

      case 2: // Full Name
        return (
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <CustomTextInput
              title="👋 What's your full name?"
              value={fullName}
              onChangeText={setFirstName}
              placeholder="Seth Rogan..."
            />
            <View style={{ padding: 20, paddingBottom: insets.bottom }}>
              <PrimaryButton
                onPress={handleNameInput}
                disabled={isNameButtonDisabled} // Button is disabled if firstName
              />
            </View>
          </View>
        );

      case 3: // Image
        return (
          <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#000' }}>
            <Text style={styles.title}>💅 Select your profile pic!</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.image} />
                ) : (
                  <Text style={styles.imagePickerText}>Tap here to select image</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                onPress={handleImageInput}
                disabled={!profileImage} // Button is disabled if no profile image is selected
              />
            </View>
          </View>
        );

      default:
        return (
          <Text>Something went wrong. Beep boop buup.</Text>
        );
    }
  };

  // Step 1
  async function authWithPhone() {
    setLoading(true);
   
    const phoneNumber = parsePhoneNumberFromString(phoneInput, 'US');
    // Check if the phone number is valid
    if (phoneNumber.isValid()) {
     
      // Format the phone number in E.164 format
      const formatted = phoneNumber.number
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formatted,
      })
    
      if (error) {
       
        Alert.alert('Error: could not sign up with that phone number:', error)
      } else {
     
        setOnboardingStep(1);
      }
    } else {
      Alert.alert('Invalid phone number');
      setPhone('')
    }
    setLoading(false);
  }

  // Step 2
  async function verifyOtp() {
    setLoading(true);
    const phoneNumber = parsePhoneNumberFromString(phoneInput, 'US')
    const phoneFormatted = phoneNumber.number
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone: phoneFormatted, token, type: 'sms',
    });

    if (error) {
      // e.g. timeout or invalid 
      // Alert.alert(error);
      Alert.alert(error.message);
      setLoading(false);
      setOnboardingStep(1);
      setToken('')
      return
    }

    const { data, selectError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phoneNumber.countryCallingCode + phoneNumber.nationalNumber)
      .limit(1)

    if (data[0].registered) {
      setUser(data[0])
      // router.push('/')
    } else {
      setOnboardingStep(2);
    }
    setToken('');
    setLoading(false);
  }

  // Step 3
  async function handleNameInput() {
    setLoading(true)
    setOnboardingStep(3);
    setLoading(false)
  }

  // Step 4
  async function handleImageInput() {
    setLoading(true)
    const phoneNumber = parsePhoneNumberFromString(phoneInput, 'US')

    // uplaod image
    // TODO: improve profile filenames
    const fileName = `profile_${phoneNumber.nationalNumber}.jpg`
    await uploadProfileImage(fileName, profileImage)

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        profile_filename: fileName,
        registered: true,
      })
      .eq('phone', phoneNumber.countryCallingCode + phoneNumber.nationalNumber)
      .select()

    if (error) {
      console.error('Error registering user:', error.message);
    } else {
      console.log('User registered successfully:', data);
    }

    setUser(data[0])
    console.log(user)
    setOnboardingStep(4)
    setLoading(false)
    router.push('/')
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    // console.log(result);

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadProfileImage = async (fileName, imageUri) => {
    // Upload the image to Supabase Storage
    const base64_string = await uriToBase64(imageUri);
    const { data, error } = await supabase
      .storage
      .from('profiles')
      .upload(fileName, decode(base64_string), {
        contentType: 'image/png',
        upsert: true
      })


    if (error) {
      console.error('Error uploading image:', error.message);
    } else {
      console.log('Image uploaded successfully:', data);
    }
  }

  async function uriToBase64(uri) {
    try {
      // Fetch the content of the URI
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert blob to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting URI to base64:', error);
      throw error;
    }
  }

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
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'left',
  },
  buttonContainer: {
    padding: 20,
  },
  // ... other styles you might need ...
});
