import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dronifdsy/image/upload/v1703691000/CosmeticsShop/srde4anqx7ogxodvrpef.jpg'; // Thay thế bằng URL của ảnh đại diện mặc định

const ReviewScreen = () => {
    const route = useRoute();
    const { ratings } = route.params;  // Nhận dữ liệu đánh giá từ ProductDetail

    // Tính toán số lượng đánh giá và phần trăm
    const totalReviews = ratings.length;
    const starCounts = useMemo(() => {
        const counts = [0, 0, 0, 0, 0]; // Đếm từ 1 sao đến 5 sao
        ratings.forEach(review => {
            if (review.star >= 1 && review.star <= 5) {
                counts[review.star - 1]++;
            }
        });
        return counts;
    }, [ratings]);

    const calculatePercentage = (count) => {
        return totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : 0;
    };

    const renderStars = (count) => {
        return Array.from({ length: count }, (_, index) => (
            <Text key={index} style={styles.star}>⭐</Text>
        ));
    };

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewItem}>
            <Image 
                source={{ uri: item.postedBy ? item.postedBy.avatar : DEFAULT_AVATAR_URL }} 
                style={styles.avatar} 
            />
            <View style={styles.reviewContent}>
                <Text style={styles.reviewerName}>
                    {item.postedBy ? item.postedBy.name : 'Người dùng không xác định'}
                </Text>
                <Text style={styles.reviewStars}>{renderStars(item.star)}</Text>
                <Text style={styles.reviewComment}>{item.comment}</Text>
                <Text style={styles.reviewDate}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tất cả đánh giá</Text>

            <View style={styles.statsContainer}>
                {starCounts.map((count, index) => (
                    <View key={index} style={styles.statItem}>
                        <Text style={styles.statStars}>
                            {renderStars(index + 1)}: {count} ({calculatePercentage(count)}%)
                        </Text>
                    </View>
                ))}
            </View>

            <FlatList
                data={ratings}
                keyExtractor={(item) => item._id}
                renderItem={renderReviewItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginBottom: 100
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    statsContainer: {
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    statItem: {
        marginVertical: 5,
    },
    statStars: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    star: {
        fontSize: 20, // Kích thước sao
    },
    reviewItem: {
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor:'#C0C0C0',
        marginRight: 10,
    },
    reviewContent: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewStars: {
        fontSize: 16,
    },
    reviewComment: {
        fontSize: 14,
        marginTop: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: '#aaa',
    },
});

export default ReviewScreen;