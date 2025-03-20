import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../config/UserContext';

const Personal = ({ navigation }) => {
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading

    const { updateInfoUser } = useContext(UserContext);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const token = await AsyncStorage.getItem('token'); 
        if (!token) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true); 
        try {
            const response = await axios.get('http://192.168.171.30:5000/api/user/current', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); 

            if (response.data.success) {
                const userData = response.data.rs; 
                setAvatar(userData.avatar);
                setName(userData.name);
                setAddress(userData.address);
                setPhone(userData.phone);
                setEmail(userData.email);
                setBirthday(moment(userData.birthday).format('YYYY-MM-DD'));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleChooseImage = async () => {
        // Yêu cầu quyền truy cập
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Bạn cần cấp quyền truy cập vào thư viện ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri); // Cập nhật state với uri của hình ảnh
        }
    };

    const handleUpdateInfo = async () => {
        setLoading(true); // Bắt đầu loading
        const formData = new FormData();
        if (avatar) {
            formData.append('avatar', {
                uri: avatar,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            });
        }
        formData.append('name', name);
        formData.append('address', address);
        formData.append('phone', phone);
        formData.append('birthday', birthday);

        try {
            const token = await AsyncStorage.getItem('token'); 
            if (!token) {
                setIsLoggedIn(false); 
                return;
            }
            const response = await axios.put('http://192.168.171.30:5000/api/user/customer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, 
                },
            });
            if (response.data.success) {
                updateInfoUser();
                Alert.alert("Thông báo", "Cập nhật thông tin thành công", [{ text: "OK" }]);
            } else {
                Alert.alert("Thông báo", "Cập nhật thất bại: " + response.data.mess, [{ text: "OK" }]);
            }
        } catch (error) {
            console.error('Error updating user info:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const handleResetPassword = async () => {
        const token = await AsyncStorage.getItem('token'); 
        if (!token) {
            setIsLoggedIn(false); 
            return;
        }
        try {
            const response = await axios.put('http://192.168.171.30:5000/api/user/customer/resetpassword', {
                currentPassword: password,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                Alert.alert("Thông báo", response.data.mess, [{ text: "OK" }]);
                setShowDialog(false);
            } else {
                Alert.alert("Thông báo", response.data.mess, [{ text: "OK" }]);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Xác nhận đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    onPress: async () => {
                        await AsyncStorage.removeItem('token'); // Xóa token
                        setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
                        navigation.navigate('HomeTabs'); // Điều hướng về trang chính
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {isLoggedIn ? (
                <>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: avatar || 'https://api.multiavatar.com/default.png' }} style={styles.avatar} />
                        <TouchableOpacity style={styles.cameraIcon} onPress={handleChooseImage}>
                            <Ionicons name="camera" size={20} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.emailText}>{email}</Text>
                    </View>

                    <Text>Tên:</Text>
                    <TextInput style={styles.input} placeholder="Nhập tên của bạn" value={name} onChangeText={setName} />
                    <Text>Địa chỉ:</Text>
                    <TextInput style={styles.input} placeholder="Nhập địa chỉ của bạn" value={address} onChangeText={setAddress} />
                    <Text>SĐT:</Text>
                    <TextInput style={styles.input} placeholder="Nhập số điện thoại của bạn" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    <Text>Ngày sinh:</Text>
                    <TextInput style={styles.input} placeholder="Nhập ngày sinh của bạn" value={birthday} onChangeText={setBirthday} />

                    <TouchableOpacity style={styles.button} onPress={() => setShowDialog(true)}>
                        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
                    </TouchableOpacity>

                    <Button title="Cập nhật thông tin" onPress={handleUpdateInfo} />

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>

                    {/* Modal for loading indicator */}
                    <Modal
                        transparent={true}
                        visible={loading}
                        animationType="none"
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <ActivityIndicator size="large" color="#007BFF" />
                                <Text style={styles.loadingText}>Đang tải...</Text>
                            </View>
                        </View>
                    </Modal>

                    {/* Modal for password change */}
                    <Modal
                        transparent={true}
                        visible={showDialog}
                        animationType="slide"
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => setShowDialog(false)}>
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.input1}
                                    placeholder="Mật khẩu hiện tại"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Text style={styles.showHideText}>{showPassword ? "Ẩn" : "Hiển thị"}</Text>
                                </TouchableOpacity>
                                
                                <TextInput
                                    style={styles.input1}
                                    placeholder="Mật khẩu mới"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                    <Text style={styles.showHideText}>{showNewPassword ? "Ẩn" : "Hiển thị"}</Text>
                                </TouchableOpacity>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity 
                                        style={styles.confirmButton} 
                                        onPress={handleResetPassword}
                                    >
                                        <Text style={styles.buttonText1}>Xác nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.cancelButton} 
                                        onPress={() => setShowDialog(false)}
                                    >
                                        <Text style={styles.buttonText1}>Hủy</Text>
                                    </TouchableOpacity>                            
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <View style={styles.noUserContainer}>
                    <Image source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' }} style={styles.noUserAvatar} />
                    <Text style={styles.noUserText}>Chưa có thông tin người dùng, hãy đăng nhập !</Text>
                    <Button title="Đăng nhập" onPress={() => navigation.navigate('Login')} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    avatarContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    emailText: {
        fontWeight: '500',
        fontSize: 16,
        marginTop: 10,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 20,
        right: 155,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    input1: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: 230,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonText1: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 40,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        flex: 1,
        borderRadius: 10,
        marginRight: 20,    
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        flex: 1,
        borderRadius: 10,
    },
    showHideText: {
        color: '#007BFF',
        textAlign: 'right',
        marginBottom: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    noUserContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
        backgroundColor: '#FFCCFF',
    },
    noUserAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    noUserText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Personal;