import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ fw, name, handleOnClick }) => {
    return (
        <TouchableOpacity
            onPress={handleOnClick}
            style={[styles.button, fw && styles.fullWidth]}
        >
            <Text style={styles.buttonText}>{name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    fullWidth: {
        width: '100%',
    },
});

export default Button;