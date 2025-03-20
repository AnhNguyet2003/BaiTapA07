import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
    const [isNavigationComplete, setIsNavigationComplete] = useState(false); // Thêm trạng thái

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsNavigationComplete(true); // Set trạng thái sau 2s
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        reset()
        if (isNavigationComplete) { // Chỉ điều hướng khi trạng thái là true
            navigation.replace('Onboarding');
        }
    }, [isNavigationComplete, navigation]); // Thêm navigation vào dependency array

    const reset = async() => {
        await AsyncStorage.removeItem('token');
    }
    return (
        <ImageBackground 
            style={styles.background}
            source={require('../../assets/splash-img.png')}
        >       
            <View style={styles.container}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
      },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;