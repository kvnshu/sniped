import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton'
import AutocompleteInput from '../../components/AutocompleteInput';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer'

//TODO:
/*
Load user data / contacts into the "data" tab. We need this data ready as soon as "selectedPhoto"
is set to true.

Handle uploading of image, with tagged user, timestamp, etc. Do so in  "handleUserTagged". This is
called after a user clicked "Post Snipe" in AutocompleteInput.jsx
*/

const CameraView = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraRef, setCameraRef] = useState(null);
    const [photoUri, setPhotoUri] = useState(null); // To store the taken photo's URI
    const [selectedPhoto, setSelectedPhoto] = useState(false);
    const [snipeeUserId, setSnipeeUserId] = useState('');
    const [followedUsers, setFollowedUsers] = useState([])

    const logUser = {
        id: "68fda063-35c1-43f0-a3da-c34a1452921f"
    }

    const insets = useSafeAreaInsets();

    const handleUserTagged = async (selectedKey) => {
        console.log("Selected Key:", selectedKey);
        console.log('Posting photo:', photoUri);

        const snipeFileName = `snipe_${Math.floor(new Date().getTime() / 1000)}.jpg`
        await uploadSnipeImage(snipeFileName, photoUri)

        // insert into snipe table
        const { data, error } = await supabase
            .from('snipes')
            .insert({
                user_id1: logUser.id,
                user_id2: selectedKey,
                file_name: snipeFileName,
            })
            .select()

        if (error) {
            console.error('Error inserting snipe:', error.message);
        } else {
            console.log('snipe inserted successfully:', data);
        }

        //  redirect to feed
        handleExit();
    }

    // TODO: simplify with similar function in login.jsx
    const uploadSnipeImage = async (fileName, imageUri) => {
        // Upload the image to Supabase Storage
        const base64_string = await uriToBase64(imageUri);
        const { data, error } = await supabase
            .storage
            .from('snipes')
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

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        const fetchData = async () => {
            const { data, error } = await supabase
                .from('following')
                .select(`
                  users!following_user_id2_fkey (
                     *
                  )
                `)
                .eq('user_id1', logUser.id)

            const parsedData = data.map((x) => (x.users))
            setFollowedUsers(parsedData);
            console.log(followedUsers)
        }
        fetchData()
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setPhotoUri(photo.uri); // Store the photo URI
        }
    };

    const closePreview = () => {
        setPhotoUri(null); // Reset the photo URI to hide the preview
    };

    const handleExit = () => {
        setSelectedPhoto(false);
        closePreview();
    }

    const tagSnipe = () => {
        // Implement your sharing logic here
        setSelectedPhoto(true);
    };

    if (hasPermission === null) {
        return <View><Text>Requesting permissions...</Text></View>;
    }
    if (hasPermission === false) {
        return <View><Text>No access to camera</Text></View>;
    }

    if (selectedPhoto) {
        return (
            <View style={{
                flex: 1, paddingTop: insets.top, justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
            }}>

                <AutocompleteInput
                    title="Who'd you snipe?"
                    placeholder="Type name..."
                    onSelect={handleUserTagged}
                    onExit={handleExit}
                    data={followedUsers}
                />

            </View>
        );
    } else if (photoUri) { // Show the preview if a photo URI exists
        return (
            <View style={{
                flex: 1, paddingTop: insets.top, justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black',
            }}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={closePreview} style={styles.retakeButton}>
                        <Text style={styles.retakeButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <PrimaryButton title="Tag Snipe" onPress={tagSnipe} disabled={false} />
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1 }}>
                <Camera style={{ flex: 1 }} type={type} ref={ref => setCameraRef(ref)}>
                    <View style={styles.buttonContainer}>
                        {/* Flip Button */}
                        <TouchableOpacity style={styles.flipButton} onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                            <Ionicons name="camera-reverse-outline" size={40} color="white" ></Ionicons>
                        </TouchableOpacity>

                        {/* Snipe Button */}
                        <TouchableOpacity style={styles.snipeButton} onPress={takePicture}>
                            <Ionicons name="radio-button-on-outline" size={70} color="white" />
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 80,
    },
    flipButton: {
        position: 'absolute',
        left: 20, // Adjust as needed for padding from the left side
        bottom: 85, // Align vertically with the Snipe button
        padding: 10,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    snipeButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    snipeIcon: {
        position: 'absolute',
    },

    previewImage: {
        width: '90%',
        height: '70%', // Adjust height as needed
        resizeMode: 'cover', // Ensure the entire image is visible
        borderRadius: 15,
    },
    actionContainer: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
    },
    retakeButton: {
        padding: 10,
        borderRadius: 5,
    },
    retakeButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default CameraView;
