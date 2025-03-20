// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, Alert } from 'react-native';
// import { Button } from 'react-native-elements';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// function HistoryOrderItem({ setFetch, listOrder }) {
//     console.log("====="+listOrder)
//     const [orders, setOrders] = useState(listOrder); // Khởi tạo state cho danh sách đơn hàng

//     useEffect(() => {
//         setOrders(listOrder); // Cập nhật orders khi listOrder thay đổi
//     }, [listOrder]);

//     console.log("=====ORDER===="+ orders)
//     const formatDate = (dataDate) => {
//         const date = new Date(dataDate);
//         const formattedDate = date.toLocaleDateString('vi-VN');
//         const formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
//         return `${formattedDate} ${formattedTime}`;
//     };

//     const handleCancel = async (oid) => {
//         Alert.alert(
//             "Xác nhận hủy đơn hàng",
//             "Bạn có chắc chắn muốn hủy đơn hàng này?",
//             [
//                 {
//                     text: "Hủy",
//                     style: "cancel"
//                 },
//                 {
//                     text: "Xác nhận",
//                     onPress: async () => {
//                         try {
//                             const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage
//                             const response = await axios.put(`http://192.168.171.30:5000/api/bill/status/${oid}`, 
//                                 { status: 'Cancelled' },
//                                 {
//                                     headers: {
//                                         'Authorization': `Bearer ${token}`, // Thêm token vào header
//                                     }
//                                 }
//                             );
//                             if (response.data.success) {
//                                 setOrders(prevOrders => 
//                                     prevOrders.map(order => 
//                                         order._id === oid ? { ...order, status: 'Cancelled' } : order
//                                     )
//                                 );
//                                 setFetch(prev => !prev); // Gọi lại để lấy dữ liệu mới
//                             } else {
//                                 Alert.alert("Lỗi", response.data.result);
//                             }
//                         } catch (error) {
//                             console.log(error);
//                             Alert.alert("Lỗi", "Có lỗi xảy ra khi hủy đơn hàng.");
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     return (
//         <ScrollView>
//             {
//                 orders && orders.length > 0 ?
//                     orders.map(order => (
//                         <View key={order._id} style={styles.orderContainer}>
//                             <View style={styles.orderInfo}>
//                                 <View style={{flexDirection: 'row'}}>
//                                     <Text style={styles.labelInfo}>Mã đơn hàng:</Text>
//                                     <Text style={styles.valueInfo}>{order._id}</Text>
//                                 </View>
//                                 <View style={{flexDirection: 'row'}}>
//                                     <Text style={styles.labelInfo}>Ngày đặt hàng:</Text>
//                                     <Text style={styles.valueInfo}>{formatDate(order.createdAt)}</Text>
//                                 </View>
//                             </View>
                            
//                             <View style={styles.productList}>
//                                 {
//                                     order.products.map(product => (
//                                         <View key={product.product._id} style={styles.productContainer}>
//                                             <Image
//                                                 style={styles.productImage}
//                                                 source={{ uri: product.product?.imageUrl[0] }}
//                                             />
//                                             <View style={styles.productInfo}>
//                                                 <Text style={styles.productName}>{product.product?.productName}</Text>
//                                                 <Text style={styles.productPrice}>
//                                                     {product.product?.price.toLocaleString('vi-VN', {
//                                                         style: 'currency',
//                                                         currency: 'VND',
//                                                     })}
//                                                 </Text>
//                                                 <Text style={styles.productCount}>x {product.count}</Text>
//                                             </View>
//                                         </View>
//                                     ))
//                                 }
//                             </View>

//                             <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
//                                 <Text style={styles.label}>Tổng tiền:</Text>
//                                 <Text style={styles.value}>
//                                     {order.total ? order.total.toLocaleString('vi-VN', {
//                                         style: 'currency',
//                                         currency: 'VND',
//                                     }) : "0"}
//                                 </Text>
//                             </View>

//                             <View style={styles.buttonContainer}>
//                                 <Button
//                                     title={
//                                         order.status === "Pending" ? "Đang chờ xác nhận" :
//                                         order.status === "Confirmed" ? "Đang giao" :
//                                         order.status === "Shipped" ? "Hoàn thành" :
//                                         order.status === "Cancelled" ? "Đã hủy" : ""
//                                     }
//                                     disabled
//                                     buttonStyle={styles.statusButton}
//                                 />
//                                 {
//                                     order.status === "Pending" &&
//                                     <Button
//                                         onPress={() => handleCancel(order._id)}
//                                         title="Hủy đơn hàng"
//                                         buttonStyle={styles.cancelButton}
//                                     />
//                                 }
//                             </View>
//                         </View>
//                     ))
//                     : 
//                     <View style={styles.emptyContainer}>
//                         <Text>Danh sách đơn hàng trống</Text>
//                     </View>
//             }
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     orderContainer: {
//         backgroundColor: '#fff',
//         padding: 20,
//         marginBottom: 15,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 1.5,
//         elevation: 3,
//     },
//     orderInfo: {
//         marginBottom: 5,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     value: {
//         fontSize: 18,
//         color: '#555',
//         marginLeft: 10
//     },
//     labelInfo: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#333',
//     },
//     valueInfo: {
//         fontSize: 13,
//         color: '#555',
//         marginLeft: 10,
//     },
//     productList: {
//         marginBottom: 15,
//     },
//     productContainer: {
//         flexDirection: 'row',
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//         paddingBottom: 10,
//     },
//     productImage: {
//         width: 100,
//         height: 100,
//         borderRadius: 8,
//         marginRight: 10,
//     },
//     productInfo: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     productName: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//     },
//     productPrice: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     productCount: {
//         color: 'gray',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     statusButton: {
//         backgroundColor: '#007BFF',
//         padding: 10,
//         borderRadius: 5,
//     },
//     cancelButton: {
//         backgroundColor: 'red',
//     },
//     emptyContainer: {
//         padding: 20,
//         alignItems: 'center',
//     },
// });

// export default HistoryOrderItem;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HistoryOrderItem({ setFetch, listOrder }) {
    const [orders, setOrders] = useState(listOrder);

    useEffect(() => {
        setOrders(listOrder);
    }, [listOrder]);

    const formatDate = (dataDate) => {
        const date = new Date(dataDate);
        const formattedDate = date.toLocaleDateString('vi-VN');
        const formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
    };

    const handleCancel = async (oid) => {
        Alert.alert(
            "Xác nhận hủy đơn hàng",
            "Bạn có chắc chắn muốn hủy đơn hàng này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            const response = await axios.put(`http://192.168.171.30:5000/api/bill/status/${oid}`, 
                                { status: 'Cancelled' },
                                {
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                    }
                                }
                            );
                            if (response.data.success) {
                                setOrders(prevOrders => 
                                    prevOrders.map(order => 
                                        order._id === oid ? { ...order, status: 'Cancelled' } : order
                                    )
                                );
                                setFetch(prev => !prev);
                            } else {
                                Alert.alert("Lỗi", response.data.result);
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Lỗi", "Có lỗi xảy ra khi hủy đơn hàng.");
                        }
                    }
                }
            ]
        );
    };

    const handleReceive = async (oid) => {
        Alert.alert(
            "Xác nhận nhận hàng",
            "Bạn có chắc chắn đã nhận được hàng?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            const response = await axios.put(`http://192.168.171.30:5000/api/bill/status/${oid}`, 
                                { status: 'Shipped' }, // Cập nhật trạng thái thành "Completed"
                                {
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                    }
                                }
                            );
                            if (response.data.success) {
                                setOrders(prevOrders => 
                                    prevOrders.map(order => 
                                        order._id === oid ? { ...order, status: 'Shipped' } : order
                                    )
                                );
                                setFetch(prev => !prev);
                            } else {
                                Alert.alert("Lỗi", response.data.result);
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert("Lỗi", "Có lỗi xảy ra khi xác nhận nhận hàng.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView>
            {
                orders && orders.length > 0 ?
                    orders.map(order => (
                        <View key={order._id} style={styles.orderContainer}>
                            <View style={styles.orderInfo}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.labelInfo}>Mã đơn hàng:</Text>
                                    <Text style={styles.valueInfo}>{order._id}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.labelInfo}>Ngày đặt hàng:</Text>
                                    <Text style={styles.valueInfo}>{formatDate(order.createdAt)}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.productList}>
                                {
                                    order.products.map(product => (
                                        <View key={product.product._id} style={styles.productContainer}>
                                            <Image
                                                style={styles.productImage}
                                                source={{ uri: product.product?.imageUrl[0] }}
                                            />
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productName}>{product.product?.productName}</Text>
                                                <Text style={styles.productPrice}>
                                                    {product.product?.price.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </Text>
                                                <Text style={styles.productCount}>x {product.count}</Text>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={styles.label}>Tổng tiền:</Text>
                                <Text style={styles.value}>
                                    {order.total ? order.total.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }) : "0"}
                                </Text>
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    title={
                                        order.status === "Pending" ? "Đang chờ xác nhận" :
                                        order.status === "Confirmed" ? "Đang giao" :
                                        order.status === "Shipped" ? "Hoàn thành" :
                                        order.status === "Cancelled" ? "Đã hủy" : ""
                                    }
                                    disabled
                                    buttonStyle={styles.statusButton}
                                />
                                {
                                    order.status === "Pending" &&
                                    <Button
                                        onPress={() => handleCancel(order._id)}
                                        title="Hủy đơn hàng"
                                        buttonStyle={styles.cancelButton}
                                    />
                                }
                                {
                                    order.status === "Confirmed" && // Nếu trạng thái là "Đang giao"
                                    <Button
                                        onPress={() => handleReceive(order._id)} // Gọi hàm handleReceive
                                        title="Đã nhận được hàng"
                                        buttonStyle={styles.receiveButton}
                                    />
                                }
                            </View>
                        </View>
                    ))
                    : 
                    <View style={styles.emptyContainer}>
                        <Text>Danh sách đơn hàng trống</Text>
                    </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    orderContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    orderInfo: {
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    value: {
        fontSize: 18,
        color: '#555',
        marginLeft: 10
    },
    labelInfo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    valueInfo: {
        fontSize: 13,
        color: '#555',
        marginLeft: 10,
    },
    productList: {
        marginBottom: 15,
    },
    productContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    productCount: {
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    statusButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    receiveButton: {
        backgroundColor: 'green',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
});

export default HistoryOrderItem;