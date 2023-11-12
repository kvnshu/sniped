import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const PhoneNumberInput = ({ title, value, onChangeText, placeholder }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        // Optionally focus the input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TextInput
                ref={inputRef}
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                keyboardType="phone-pad"
                autoComplete="tel"
            />
        </View>
    );
}; 

const styles = StyleSheet.create({
    input: {
        color: '#ccc', // White text color
        width: '100%',
        padding: 0,
        borderRadius: 5,
        fontSize: 22,
        fontFamily: 'Inter_600SemiBold', // Use the correct font weight
        textAlign: 'left', // Align text to the left
    },
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background
        alignItems: 'stretch', // Stretch child components
        justifyContent: 'flex-start', // Align to top
        paddingTop: 20, // Add padding at the top
        paddingHorizontal: 20, // Add horizontal padding
    },
    title: {
        color: '#fff', // Bold white text
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Inter_700Bold', // Use the correct font weight
    },
});

export default PhoneNumberInput;
