import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ navigation }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // await AsyncStorage.setItem('hasLaunched', 'false');
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      console.log("BIen " + hasLaunched)
      if (hasLaunched) {
        navigation.navigate('HomeTabs'); 
      }
    };
    checkOnboardingStatus();
  }, [navigation]);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    navigation.navigate('HomeTabs'); 
  };

  return (
    <View style={styles.wrapper}>
      <Swiper
        loop={false}
        onIndexChanged={num => setIndex(num)}
        index={index}
        paginationStyle={styles.pagination}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        <Image source={require('../../assets/onboarding1-img.png')} style={styles.image} />
        <Image source={require('../../assets/onboarding2-img.png')} style={styles.image} />
        <Image source={require('../../assets/onboarding3-img.png')} style={styles.image} />
      </Swiper>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={finishOnboarding}>
          <Text style={styles.text}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (index < 2 ? setIndex(index + 1) : finishOnboarding())}>
          <Text style={styles.text}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    bottom: 70,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Onboarding;