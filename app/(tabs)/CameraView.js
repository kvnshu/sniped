import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraView = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraRef, setCameraRef] = useState(null);
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
          let photo = await cameraRef.takePictureAsync();
          console.log('photo', photo);
        }
    };
  
    if (hasPermission === null) {
        return <View><Text>Requesting permissions...</Text></View>;
    }
    if (hasPermission === false) {
      return <View><Text>No access to camera</Text></View>;
    }
  
    return (
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={type} ref={ref => setCameraRef(ref)}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    setType(
                    type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                }}>
                <Text style={styles.buttonText}> Flip </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
                    <Text style={styles.buttonText}> Snipe </Text>
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
      paddingBottom: 80, // Adjust as needed for padding from the bottom
    },
    button: {
      marginHorizontal: 10, // Spacing between buttons
      padding: 10, // Padding inside the button for better touch area
      // Additional styling for the button can go here
    },
    buttonText: {
      fontSize: 18,
      color: 'white',
      // Additional styling for the text can go here
    },
  });

export default CameraView;