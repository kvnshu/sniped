import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const PrimaryButton = ({title="Next", onPress, disabled }) => {
    return (
        <TouchableOpacity 
            style={[styles.button, disabled && styles.disabledButton]} 
            onPress={disabled ? null : onPress}
            disabled={disabled}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 10,
    },
    disabledButton: {
        backgroundColor: '#828282', // A different color to indicate disabled state
        // Other styles for disabled state if necessary
    },
    text: {
        color: '#000',
        fontSize: 18,
        fontFamily: 'Inter_700Bold', 
    },
});

export default PrimaryButton;
