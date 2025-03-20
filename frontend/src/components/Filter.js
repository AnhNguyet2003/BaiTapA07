import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const Filter = ({ onFilter, activeFilter }) => {
    const filters = [
        { key: 'best-seller', label: 'Best Seller' },
        { key: 'new-product', label: 'New Product' },
        { key: 'featured', label: 'Featured' },
    ];

    const handleFilterSelect = (filterKey) => {
        if (activeFilter === filterKey) {
            // Nếu bộ lọc đã được chọn thì tắt
            onFilter(null); // Gọi hàm filter với tham số null
        } else {
            // Nếu bộ lọc chưa được chọn thì bật
            onFilter(filterKey); // Gọi hàm filter với bộ lọc đã chọn
        }
    };

    return (
        <ScrollView horizontal style={{
            height: 60,
            backgroundColor: '#FFFFFF',
            paddingBottom: 10,
            paddingTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
        }}>
            {filters.map((filter) => (
                <TouchableOpacity
                    key={filter.key}
                    onPress={() => handleFilterSelect(filter.key)}
                    style={{
                        padding: 10,
                        backgroundColor: activeFilter === filter.key ? '#FF69B4' : '#FFCCFF', // Đổi màu thẻ khi active
                        borderRadius: 5,
                        marginRight: 15,
                        marginLeft: 15,
                        paddingLeft: 20,
                        paddingRight: 20
                    }}
                >
                    <Text style={{
                        fontSize: 15,
                        color: activeFilter === filter.key ? '#FFFFFF' : '#000000'
                    }}>
                        {filter.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default Filter;