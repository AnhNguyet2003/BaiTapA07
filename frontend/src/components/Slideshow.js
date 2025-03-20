import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');

const Slideshow = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('No data provided for slideshow');
        return null; // Or you might want to render a placeholder
    }

    const renderItem = ({ item }) => {
        if (!item) {
            console.warn('Item is undefined');
            return null; // Handle undefined item case
        }
        
        return (
            <View >
                <Image source={{ uri: item }} />
            </View>
        );
    };

    return (
        <Carousel
            data={data}
            renderItem={renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            layout="default"
        />
    );
};

// const styles = StyleSheet.create({
//     slide: {
//         width: viewportWidth,
//         height: 200,
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 10,
//     },
// });

export default Slideshow;