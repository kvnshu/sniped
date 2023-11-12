import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity,Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import {useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton'
import AutocompleteInput from '../components/AutocompleteInput';

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
    const [taggedUserId, setTaggedUserId] = useState('');

    const insets = useSafeAreaInsets();

    const handleUserTagged = (selectedKey) => {
      console.log("Selected Key:", selectedKey);
      console.log('Posting photo:', photoUri);
      handleExit();
      //optionally redirect to feed
      //TODO: SUBMIT SNIPE
    }

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
      if (cameraRef) {
        let photo = await cameraRef.takePictureAsync();
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

    const sharePicture = () => {
      // Implement your sharing logic here
      setSelectedPhoto(true);
    };

    if (hasPermission === null) {
        return <View><Text>Requesting permissions...</Text></View>;
    }
    if (hasPermission === false) {
        return <View><Text>No access to camera</Text></View>;
    }

    if(selectedPhoto){
      return (
        <View style={{flex: 1, paddingTop: insets.top,  justifyContent: 'center',
        alignItems: 'center',
      backgroundColor: 'black', }}>
 
        <AutocompleteInput
            title="Who'd you snipe?"
            placeholder="Type name..."
            onSelect={handleUserTagged}
            onExit={handleExit}

            data = {[
              { name: 'William K', key: '123', profilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY' },
              { name: 'Will you marry me', key: '223', profilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY'},
              { name: 'Kevin Xu', key: '456', profilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY' },
              { name: 'Kevin Wooooo', key: '120', profilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY'},
              { name: 'Max Bibb', key: '789', profilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY'},
              { name: 'Dominik Tamimi', key: '101', profilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY' }
          ]}
        />

      </View>
      );
    }

    if (photoUri) {
        // Show the preview if a photo URI exists
        return (
            <View style={{flex: 1, paddingTop: insets.top,  justifyContent: 'center',
              alignItems: 'center',
            backgroundColor: 'black', }}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={closePreview} style={styles.retakeButton}>
                        <Text style={styles.retakeButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <PrimaryButton title="Snipe" onPress={sharePicture} disabled={false}/>
                </View>
            </View>
        );
    }

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
                    <TouchableOpacity style={styles.snipeButton} onPress={() => takePicture()}>
                        <Ionicons name="radio-button-on-outline" size={70} color="white" />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
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
