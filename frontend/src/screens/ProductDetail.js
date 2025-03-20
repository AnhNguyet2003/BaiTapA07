import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import VoteOption from '../components/VoteOption';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { CartContext } from '../../src/config/CartContext';
import { renderStarFromNumber } from '../utils/constants';

const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dronifdsy/image/upload/v1703691000/CosmeticsShop/srde4anqx7ogxodvrpef.jpg';

const ProductDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { productId } = route.params;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showVoteOption, setShowVoteOption] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const { addToCart } = useContext(CartContext);
    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://192.168.171.30:5000/api/product/${productId}`);
            if (response.data.success) {
                setProduct(response.data.productData);
            } else {
                setError('Không tìm thấy sản phẩm.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchProductDetails();
    }, [productId]);

    const handleAddToCart = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setModalVisible(true);
        } else {
            try {
                const response = await axios.put('http://192.168.171.30:5000/api/user/add/cart', {
                    pid: product._id,
                    quantity
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    Alert.alert("Success", response.data.mess, [{ text: "OK" }]);
                    addToCart(product, quantity);
                } else {
                    Alert.alert("Error", response.data.mess, [{ text: "OK" }]);
                }
            } catch (error) {
                Alert.alert("Error", 'Có lỗi xảy ra khi cập nhật giỏ hàng.', [{ text: "OK" }]);
            }
        }
    };

    const navigateToLogin = () => {
        setModalVisible(false);
        navigation.navigate('Login');
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const totalStars = ratings.reduce((acc, rating) => acc + rating.star, 0);
        return (totalStars / ratings.length).toFixed(1);
    };

    const rerender = () => {
        // Logic to re-fetch or refresh product details
        fetchProductDetails();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Sản phẩm không tồn tại.</Text>
            </View>
        );
    }

    const averageRating = calculateAverageRating(product.ratings);

    return (
        <View style={styles.container}>
            <FlatList
                data={[product]}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
                        </View>
                        <Text style={styles.productName}>{item.productName}</Text>
                        <Text style={styles.price}>{item.price.toLocaleString()} VNĐ</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.brand}>Thương hiệu: {item.brand.brandName}</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
                                <Text style={styles.quantityButton}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                                <Text style={styles.quantityButton}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                        <View style={styles.commenttitle}>
                            <Text style={styles.averageRating}>Đánh giá trung bình: {averageRating} ⭐</Text>
                            <TouchableOpacity 
                                style={styles.viewAllButton} 
                                onPress={() => navigation.navigate('ReviewScreen', { ratings: item.ratings })}
                            >
                                <Text style={styles.viewAllText}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={product?.ratings.slice(-3)}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.reviewItem}>
                                    <Image 
                                        source={{ uri: item.postedBy ? item.postedBy.avatar : DEFAULT_AVATAR_URL }} 
                                        style={styles.avatar} 
                                    />
                                    <View style={styles.reviewContent}>
                                        <Text style={styles.reviewerName}>
                                            {item.postedBy ? item.postedBy.name : 'Người dùng không xác định'}
                                        </Text>
                                        <Text style={styles.reviewStars}>{renderStarFromNumber(item.star)}</Text>
                                        <Text style={styles.reviewComment}>{item.comment}</Text>
                                        <Text style={styles.reviewDate}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            )}
                        />

                        <TouchableOpacity style={styles.voteButton} onPress={() => setShowVoteOption(true)}>
                            <Text style={styles.voteButtonText}>Đánh giá sản phẩm</Text>
                        </TouchableOpacity>
                        {showVoteOption && (
                            <VoteOption product={item} handleSubmitVoteOption={() => setShowVoteOption(false)} rerender={rerender} />
                        )}
                    </>
                )}
            />
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Almost...</Text>
                    <Text style={styles.message}>Please login first</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#FF0000', padding: 10, borderRadius: 5, marginRight: 20 }} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Not now!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#00FF00', padding: 10, borderRadius: 5, marginLeft: 20 }} 
                            onPress={navigateToLogin}
                        >
                            <Text style={{ color: '#000000', textAlign: 'center' }}>Go login page!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    price: {
        fontSize: 20,
        color: '#FF0000',
        fontWeight: '600',
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        marginTop: 8,
        lineHeight: 24,
    },
    brand: {
        fontSize: 16,
        marginTop: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    quantityButton: {
        fontSize: 24,
        marginHorizontal: 16,
        padding: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        textAlign: 'center',
    },
    quantityText: {
        fontSize: 18,
    },
    addToCartButton: {
        backgroundColor: '#FF69B4',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
    },
    addToCartText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    averageRating: {
        fontSize: 18,
        marginVertical: 8,
    },
    voteButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 100,
    },
    voteButtonText: {
        color: '#FFCCFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginVertical: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewItem: {
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor:'#C0C0C0',
        marginRight: 10,
    },
    reviewContent: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewStars: {
        fontSize: 16,
    },
    reviewComment: {
        fontSize: 14,
        marginTop: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: '#aaa',
    },
    commenttitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default ProductDetail;