import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Image source={{ uri: product.imageUrl[0] }} style={styles.image} />
            <Text style={styles.productName}>{product.productName}</Text>
            <Text style={styles.productName}>{product.totalRatings} ⭐</Text>
            <Text style={styles.price}>{product.price} VNĐ</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        backgroundColor: '#FFFFFF',
        width: '44%', // Đặt chiều rộng là 44% để có không gian giữa các sản phẩm
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 2,
    },
    image: {
        width: '90%',
        marginLeft: 8,
        marginTop: 8,
        marginBottom: 8,
        height: 150,
        resizeMode: 'cover',
    },
    productName: {
        color: '#000000',
        margin: 8,
    },
    price: {
        color: '#FF0000',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ProductCard;