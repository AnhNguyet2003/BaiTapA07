import React, { memo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import logo from '../../assets/logo.png';
import { voteOptions } from '../utils/constants';
import Button from './Button';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const VoteOption = ({ product, handleSubmitVoteOption, rerender }) => {
    const [chooseStar, setChooseStar] = useState(null);
    const [comment, setComment] = useState('');

    console.log("PRODUCT " + product);

    const handleVoteSubmit = async () => {
        // Kiểm tra dữ liệu đầu vào
        if (!comment || chooseStar === null) {
            Alert.alert('Thông báo', 'Vui lòng thêm nhận xét của bạn và chọn đánh giá sao.');
            return;
        }
        console.log("START " + chooseStar)
        console.log("PID " + product?._id);
        try {
            const token = await AsyncStorage.getItem('token'); // Lấy token từ AsyncStorage

            // Gọi API để gửi đánh giá
            const response = await fetch('http://192.168.171.30:5000/api/product/ratings', { // Thay đổi URL API
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                },
                body: JSON.stringify({
                    star: chooseStar,     // Thêm trường star
                    comment,              // Thêm trường comment
                    pid: product?._id,    // Thêm trường pid
                    updatedAt: Date.now(), // Thêm trường updatedAt
                }),
            });

            const data = await response.json(); // Phân tích dữ liệu phản hồi
            console.log("RS " + JSON.stringify(data))
            if (response.status==200) {
                // Gọi hàm handleSubmitVoteOption sau khi API thành công
                handleSubmitVoteOption({ comment, star: chooseStar });
                // Reset các trường
                setChooseStar(null);
                setComment('');
                Alert.alert("Thông báo", "Đánh giá của bạn đã được gửi thành công.");
                rerender(); // Gọi lại hàm để render lại nếu cần
            } else {
                Alert.alert("Lỗi", data.message || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>{`Đánh giá sản phẩm ${product?.productName}`}</Text>
            <TextInput
                style={styles.textarea}
                placeholder='Thêm bình luận của bạn'
                value={comment}
                onChangeText={setComment}
            />
            <View style={styles.voteOptions}>
                <Text style={styles.voteTitle}>Bạn thấy sản phẩm thế nào?</Text>
                <View style={styles.stars}>
                    {voteOptions.map((el) => (
                        <TouchableOpacity
                            key={el.id}
                            onPress={() => setChooseStar(el.id)}
                            style={styles.voteOption}
                        >
                            <Icon name="star" size={30} color={chooseStar >= el.id ? 'orange' : 'gray'} />
                            <Text style={styles.voteText}>{el.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <Button fw name='Gửi' handleOnClick={handleVoteSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFCCFF',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        width: '100%',
        position: 'absolute',
    },
    textarea: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    logo: {
        width: 350,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
    },
    voteOptions: {
        width: '100%',
        alignItems: 'center',
    },
    voteTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    stars: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    voteOption: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    voteText: {
        fontSize: 12,
    },
});

export default memo(VoteOption);