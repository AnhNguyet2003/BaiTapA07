import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProductCard from './ProductCard'; // Đảm bảo đường dẫn chính xác
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const ProductList = ({ products }) => {
    const navigation = useNavigation(); // Khai báo navigation

    const handlePress = (product) => {
        navigation.navigate('ProductDetail', { productId: product._id }); // Điều hướng đến trang chi tiết
    };

    return (
        <View style={styles.container}>
            {products.map((product) => (
                <ProductCard key={product._id} product={product} onPress={() => handlePress(product)} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Căn giữa và phân bổ đều khoảng cách
        padding: 5,
    },
});

export default ProductList;