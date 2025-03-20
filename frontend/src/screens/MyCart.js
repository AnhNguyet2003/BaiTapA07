import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { CartContext } from '../config/CartContext'; 

const MyCart = () => {
    const navigation = useNavigation();
    const { cart, setCart } = useContext(CartContext);
    const [total, setTotal] = useState(0);
    const [listCheckout, setListCheckout] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false); // Trạng thái modal

    useEffect(() => {
        fetchCart();
    }, []);
    
    const fetchCart = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log("TOKEN " + token);
        if (!token) {
            setModalVisible(true);
            return; // Thoát hàm nếu chưa đăng nhập
        }
        try {
            const response = await axios.get('http://192.168.171.30:5000/api/user/current-cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setCart(response.data.userCart.cart.products);
            } else {
                Alert.alert("Thông báo", response.data.mess);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Thông báo", 'Lỗi khi lấy giỏ hàng');
        }
    };

    useEffect(() => {
        const result = listCheckout.reduce((acc, current) => {
            return acc + current.quantity * current.product.price;
        }, 0);
        setTotal(result);
    }, [listCheckout]);

    const toggleCheck = (cartItem) => {
        const check = listCheckout.find(item => item.product._id === cartItem.product._id);
        if (check) {
            const newListCheckout = listCheckout.filter(item => item.product._id !== cartItem.product._id);
            setListCheckout(newListCheckout);
        } else {
            setListCheckout(prev => [...prev, cartItem]);
        }
    };

    const handleCartUpdate = async (cartItem, quantity) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setModalVisible(true);
            return; // Thoát hàm nếu chưa đăng nhập
        }
        try {
            const response = await axios.put('http://192.168.171.30:5000/api/user/add/cart', {
                pid: cartItem.product._id,
                quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                const updatedCart = await axios.get('http://192.168.171.30:5000/api/user/current-cart', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCart(updatedCart.data.userCart.cart.products);
            } else {
                Alert.alert("Thông báo", response.data.mess);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Thông báo", 'Lỗi khi cập nhật giỏ hàng');
        }
    };

    const handleMinusCart = (cartItem) => {
        if (cartItem.quantity > 1) {
            handleCartUpdate(cartItem, -1);
        } else {
            Alert.alert("Thông báo", "Số lượng sản phẩm phải lớn hơn 0");
        }
    };

    const handlePlusCart = (cartItem) => {
        if (cartItem.quantity < 100) {
            handleCartUpdate(cartItem, 1);
        } else {
            Alert.alert("Thông báo", "Số lượng sản phẩm phải nhỏ hơn 100");
        }
    };

    const handleRemoveToCart = async (pid) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setModalVisible(true);
            return; // Thoát hàm nếu chưa đăng nhập
        }
        try {
            const response = await axios.delete(`http://192.168.171.30:5000/api/user/remove-cart/${pid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                Alert.alert("Thông báo", response.data.mess);
                const updatedCart = await axios.get('http://192.168.171.30:5000/api/user/current-cart', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCart(updatedCart.data.userCart.cart.products);
            } else {
                Alert.alert("Thông báo", response.data.mess);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Thông báo", 'Lỗi khi xóa sản phẩm');
        }
    };

    const navigateToLogin = () => {
        setModalVisible(false);
        navigation.navigate('Login');
        console.log('Đi đến trang đăng nhập');
    };

    const renderCartItem = ({ item }) => {
        console.log("CHECK " + item)
        if (!item || !item.product) {
            return null; // Hoặc có thể hiển thị một thông báo khác
        }
    
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 8 }}>
                <Checkbox
                    status={listCheckout.some(cartItem => cartItem.product._id === item.product._id) ? 'checked' : 'unchecked'}
                    onPress={() => toggleCheck(item)}
                />
                <Image source={{ uri: item.product.image[0] }} style={{ width: 100, height: 100, marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.product.productName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => handleMinusCart(item)}>
                            <Text style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 5 }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => handlePlusCart(item)}>
                            <Text style={{ padding: 10, backgroundColor: 'lightgray', borderRadius: 5 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 16 }}>
                        {item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveToCart(item.product._id)}>
                    <Text style={{ color: 'red' }}>Xóa</Text>
                </TouchableOpacity>
            </View>
        );
    };

    console.log("CART " + cart)

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8', padding: 20 }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Giỏ hàng của tôi</Text>
            {(cart && cart.length > 0) ? (
                <FlatList
                    data={cart}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.product._id.toString()}
                />
            ) : (
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text>Giỏ hàng trống</Text>
                </View>
            )}
            <View style={{
                marginTop: 20,
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.5,
                elevation: 5,
            }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tổng cộng: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: total === 0 ? 'lightgray' : 'blue',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                    }}
                    disabled={total === 0}
                    onPress={() => navigation.navigate('Checkout', { listCheckout })}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Thanh toán</Text>
                </TouchableOpacity>
            </View>

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Chưa đăng nhập...</Text>
                    <Text style={styles.message}>Vui lòng đăng nhập để xem giỏ hàng của bạn.</Text>
                    <View style={styles.buttonContainer}>
                        <View style={{ marginRight: 20 }}>
                            <TouchableOpacity 
                                style={{ backgroundColor: '#FF0000', padding: 10, borderRadius: 5 }} 
                                onPress={() => { setModalVisible(false); navigation.replace('HomeTabs'); }}
                            >
                                <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Không bây giờ!</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <TouchableOpacity 
                                style={{ backgroundColor: '#00FF00', padding: 10, borderRadius: 5 }} 
                                onPress={navigateToLogin}
                            >
                                <Text style={{ color: '#000000', textAlign: 'center' }}>Đi đến trang đăng nhập!</Text>
                            </TouchableOpacity>
                        </View>                        
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default MyCart;