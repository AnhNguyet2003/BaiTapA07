import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

const DrawerMenu = ({ categories, onSelectCategory, disabled }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedCategoryName, setSelectedCategoryName] = useState('Danh Mục');

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

    const handleCategorySelect = (category) => {
        if (disabled) {
            Alert.alert('Thông báo', 'Vui lòng xóa tìm kiếm để chọn danh mục.');
            return; // Dừng lại nếu bị vô hiệu hóa
        }
        setSelectedCategoryName(category.categoryName);
        onSelectCategory(category);
        toggleModal();
    };

    const handleAllProductsSelect = () => {
        setSelectedCategoryName('Tất cả sản phẩm');
        onSelectCategory(null);
        toggleModal();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={toggleModal} 
                style={[styles.toggleButton, disabled && styles.disabledButton]} // Thay đổi màu sắc khi bị vô hiệu hóa
                disabled={disabled}
            >
                <Text style={styles.toggleText}>{selectedCategoryName}</Text>
                <Icon name="angle-down" size={20} color="#000000" style={{marginTop: 5}}/>
            </TouchableOpacity>

            <Modal isVisible={isVisible} onBackdropPress={toggleModal} style={styles.modal}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.title}>Danh Mục</Text>
                    <TouchableOpacity onPress={handleAllProductsSelect}>
                        <Text style={styles.categoryText}>Tất cả sản phẩm</Text>
                    </TouchableOpacity>
                    {categories.map(category => (
                        <TouchableOpacity 
                            key={category._id} 
                            onPress={() => handleCategorySelect(category)} 
                            disabled={disabled} // Vô hiệu hóa nếu cần
                        >
                            <Text style={styles.categoryText}>{category.categoryName}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#FF69B4',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabledButton: {
        position: 'absolute', // Thêm thuộc tính absolute
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#C0C0C0', // Màu xám khi bị vô hiệu hóa
    },
    toggleText: {
        fontSize: 18,
        color: '#000000',
        fontWeight: 'bold',
        marginRight: 5,
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10
    },
    modal: {
        justifyContent: 'flex-start',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeText: {
        fontSize: 24,
        color: 'red',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 18,
        marginVertical: 10,
        color: '#000000',
    },
});

export default DrawerMenu;