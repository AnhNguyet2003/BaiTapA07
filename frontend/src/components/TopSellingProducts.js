import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const TopSellingProducts = ({ groupedProducts }) => {
    const navigation = useNavigation(); 

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { productId: product._id });
    };

    const renderSlide = (products) => (
        <View style={styles.slide}>
            {products.map((product) => (
                <TouchableOpacity 
                    key={product._id} 
                    style={styles.productContainer} 
                    onPress={() => handleProductPress(product)} // Thêm sự kiện nhấp
                >
                    <Image 
                        source={{ uri: product.imageUrl[0] }} 
                        style={styles.productImage} 
                    />
                    <Text style={styles.productName} numberOfLines={2}>{product.productName}</Text>
                    <Text style={styles.productPrice}>{product.price} VNĐ</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View>
            <Text style={styles.headerText}>Top 12 sản phẩm bán chạy</Text>
            <View style={{ height: 200, backgroundColor: '#FFCCFF' }}>
                <Swiper showsButtons={true} autoplay={true} loop={true}>
                    {groupedProducts.map((group, index) => (
                        <View key={index}>
                            {renderSlide(group)}
                        </View>
                    ))}
                </Swiper>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 10
    },
    productContainer: {
        width: '30%',
        height: 180, // Sửa lại height từ '180' thành 180
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderColor: '#F8f8f8',
        borderWidth: 1,
        marginTop: 10
    },
    productImage: {
        width: '90%',
        height: 130, // Sửa lại height từ '130' thành 130
        borderRadius: 10,
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 13,
        textAlign: 'center',
        overflow: 'hidden',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#EE0000',
    },
});

export default TopSellingProducts;