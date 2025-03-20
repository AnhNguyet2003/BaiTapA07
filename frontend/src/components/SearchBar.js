import React, { useState, useEffect , useContext} from 'react';
import { View, TextInput, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../config/UserContext';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const { user } = useContext(UserContext); // Lấy user từ context
    const avatar = user.avatar; // Lấy avatar từ user 

    const handleSearch = () => {
        onSearch(query); 
    };

    const clearSearch = () => {
        setQuery(''); 
        onSearch(''); 
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Tìm sản phẩm..."
                value={query}
                onChangeText={setQuery}
            />
            <Button title="Tìm" onPress={handleSearch} />
            {query.length > 0 && ( // Hiện nút xóa nếu có giá trị tìm kiếm
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <Icon name="times" size={20} color="#FF0000" />
                </TouchableOpacity>
            )}
            <Image
                source={{ uri:  avatar? avatar : 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png' }} // Thay thế bằng URL của hình avatar
                style={{
                width: 40, 
                height: 40,
                borderRadius: 20, 
                marginLeft: 10
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        flex: 1,
        marginRight: 10,
        padding: 5,
    },
    clearButton: {
        marginLeft: 10,
        padding: 5,
    },
});

export default SearchBar;