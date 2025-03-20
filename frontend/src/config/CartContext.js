import React, { createContext, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = async (product, quantity) => {
        // Kiểm tra xem sản phẩm có hợp lệ hay không
        if (!product || !product._id || quantity <= 0) {
            console.error("Không có sản phẩm để thêm vào giỏ hàng hoặc số lượng không hợp lệ.");
            return;
        }
    
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://192.168.173.30:5000/api/user/current-cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const currentCart = response.data.userCart.cart.products; // Giả sử API trả về giỏ hàng trong 'data.cart'
            setCart(currentCart)
        } catch (error) {
            console.error("Lỗi khi gọi API để lấy giỏ hàng:", error);
        }
    };
    
    return (
        <CartContext.Provider value={{ cart, setCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};