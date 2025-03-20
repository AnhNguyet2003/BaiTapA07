import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        avatar: null,
        name: '',
        email: '',
        address: '',
        phone: '',
        birthday: ''
    });

    const updateInfoUser = async () => {
        const token = await AsyncStorage.getItem('token'); 
        try {
            const response = await axios.get('http://192.168.173.30:5000/api/user/current', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }); 

            if (response.data.success) {
                const userData = response.data.rs; 
                setUser(userData); // Cập nhật thông tin người dùng
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateInfoUser }}>
            {children}
        </UserContext.Provider>
    );
};