import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, Alert, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { cash } from '../utils/constants';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Checkout = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { listCheckout } = route.params || [];
    const [isModalVisible, setModalVisible] = useState(false);
    
    const [formData, setFormData] = useState({
        recipient: '',
        phone: '',
        address: '',
        note: '',
    });
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState(listCheckout || []);

    useEffect(() => {
        const result = list.reduce((acc, curr) => acc + curr.quantity * curr.product.price, 0);
        setTotal(result);
    }, [list]);

    const onFinish = async () => {
        const products = list.map(item => ({
            product: item.product._id,
            count: item.quantity,
        }));

        const dataOrder = {
            products,
            paymentMethod: cash,
            total,
            ...formData,
        };

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setModalVisible(true);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://192.168.171.30:5000/api/bill', dataOrder, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLoading(false);
            if (response.data.success) {
                Alert.alert('Thành công', 'Đặt hàng thành công!', [
                    { text: 'OK', onPress: () => navigation.navigate('HomeTabs') },
                ]);
            } else {
                Alert.alert('Lỗi', response.data.message);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đặt hàng.');
        }
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const navigateToLogin = () => {
        setModalVisible(false);
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Image source={require('../../assets/logo.png')} style={styles.logo} />
                    </View>
                    <Text style={styles.title}>Thanh Toán</Text>
                    <Text style={styles.subtitle}>Danh Sách Sản Phẩm</Text>
                    {list.map(item => (
                        <View key={item.product._id} style={styles.productItem}>
                            <Image source={{ uri: item.product.image[0] }} style={styles.productImage} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.product.productName}</Text>
                                <Text style={styles.productPrice}>
                                    {item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Text>
                                <Text style={styles.productQuantity}>x {item.quantity}</Text>
                            </View>
                        </View>
                    ))}
                    <Text style={styles.subtitle}>Thông Tin Giao Hàng</Text>
                    <TextInput
                        placeholder="Tên Người Nhận"
                        style={styles.input}
                        value={formData.recipient}
                        onChangeText={value => handleInputChange('recipient', value)}
                    />
                    <TextInput
                        placeholder="Số Điện Thoại"
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={value => handleInputChange('phone', value)}
                    />
                    <TextInput
                        placeholder="Địa Chỉ Giao Hàng"
                        style={styles.input}
                        value={formData.address}
                        onChangeText={value => handleInputChange('address', value)}
                    />
                    <TextInput
                        placeholder="Ghi Chú"
                        style={styles.input}
                        value={formData.note}
                        onChangeText={value => handleInputChange('note', value)}
                    />
                    <Text style={styles.total}>Tổng Tiền: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title="Đặt Hàng" onPress={onFinish} />
                </View>
                <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Almost...</Text>
                        <Text style={styles.message}>Please login first</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Not now!" onPress={() => setModalVisible(false)} />
                            <Button title="Go login page!" onPress={navigateToLogin} />
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inner: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100, // Dành không gian cho nút Đặt Hàng
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 10,
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#333',
    },
    productQuantity: {
        color: '#888',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    buttonContainer: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 60, // Để đảm bảo nút không bị che khuất
    },
});

export default Checkout;