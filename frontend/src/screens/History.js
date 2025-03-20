import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import HistoryOrderItem from '../components/HistoryOrderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal'; // Import thư viện modal

const statusMap = {
    All: "Tất cả",
    Pending: "Chờ xác nhận",
    Confirmed: "Đang giao",
    Shipped: "Hoàn thành",
    Cancelled: "Đã hủy",
};

const History = ({ navigation }) => {
    const [allListOrder, setAllListOrder] = useState([]);
    const [filterListOrder, setFilterListOrder] = useState([]);
    const [key, setKey] = useState("All");
    const [error, setError] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); // Trạng thái modal
    const [fetchData, setFetch] = useState(false); // Thêm state để gọi lại dữ liệu

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
            if (!token) {
                setModalVisible(true); // Hiện modal nếu chưa đăng nhập
                return; // Dừng thực hiện nếu chưa đăng nhập
            }
            try {
                const response = await axios.get('http://192.168.171.30:5000/api/bill/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setAllListOrder(response.data.result);
                } else {
                    setError('Không tìm thấy đơn hàng.');
                }
            } catch (err) {
                if (err.response && err.response.data) {
                    setError(err.response.data.mess || 'Đã xảy ra lỗi khi lấy dữ liệu.');
                } else {
                    setError('Đã xảy ra lỗi khi lấy dữ liệu.');
                }
                console.error(err);
            }
        })();
    }, [fetchData]);

    useEffect(() => {
        const newList = allListOrder.filter(order => order.status === key || key === "All");
        setFilterListOrder(newList);
    }, [allListOrder, key]);

    const renderOrders = () => {
        if (key === "All") {
            return <HistoryOrderItem setFetch={setFetch}  listOrder={allListOrder} />;
        }
        return <HistoryOrderItem setFetch={setFetch} listOrder={filterListOrder} />;
    };

    const navigateToLogin = () => {
        setModalVisible(false);
        navigation.navigate('Login'); // Điều hướng đến trang đăng nhập
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Lịch sử đặt hàng</Text>
                {error && <Text style={styles.error}>{error}</Text>}
                
                <View style={styles.tabsContainer}>
                    <View style={styles.tabBar}>
                        {Object.keys(statusMap).map(tab => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tab, key === tab && styles.activeTab]}
                                onPress={() => setKey(tab)}
                            >
                                <Text style={[styles.tabText, key === tab && styles.activeTabText]}>
                                    {statusMap[tab]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.ordersContainer}>
                        {renderOrders()}
                    </View>
                </View>
            </ScrollView>

            {/* Modal yêu cầu đăng nhập */}
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Chưa đăng nhập...</Text>
                    <Text style={styles.message}>Vui lòng đăng nhập để xem lịch sử đặt hàng.</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#FF0000', padding: 10, borderRadius: 5, marginRight: 20 }} 
                            onPress={() => {setModalVisible(false), navigation.replace('HomeTabs')}}
                        >
                            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Không bây giờ!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#00FF00', padding: 10, borderRadius: 5 }} 
                            onPress={navigateToLogin}
                        >
                            <Text style={{ color: '#000000', textAlign: 'center' }}>Đi đến trang đăng nhập!</Text>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#555',
        paddingBottom: 10,
    },
    tabsContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    tabText: {
        fontSize: 14,
        color: '#000',
    },
    activeTabText: {
        fontWeight: 'bold',
        color: 'blue',
    },
    ordersContainer: {
        padding: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
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

export default History;
