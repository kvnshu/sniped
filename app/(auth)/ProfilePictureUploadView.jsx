import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../components/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfilePictureUploadView = () => {
    const [profileImage, setProfileImage] = useState(null);
    const insets = useSafeAreaInsets();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
        }
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom,backgroundColor: '#000'}}>
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
                    onPress={() => console.log('Next pressed')} 
                    disabled={!profileImage} // Button is disabled if no profile image is selected
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default ProfilePictureUploadView;
