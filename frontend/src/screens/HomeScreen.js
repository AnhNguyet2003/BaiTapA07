// import React, { useEffect, useState } from 'react';
// import { View, ScrollView, ActivityIndicator, StyleSheet, Text, Image, Dimensions } from 'react-native';
// import axios from 'axios';
// import DrawerMenu from '../components/DrawerMenu';
// import ProductList from '../components/ProductList';
// import SearchBar from '../components/SearchBar';
// import Filter from '../components/Filter';
// import TopSellingProducts from '../components/TopSellingProducts'; // Import component mới
// import Swiper from 'react-native-swiper';

// const { width: viewportWidth } = Dimensions.get('window');

// export const apiGetProducts = (params) => axios({
//     url: 'http://192.168.171.30:5000/api/product/',
//     method: 'get',
//     params
// });

// const HomeScreen = () => {
//     const [categories, setCategories] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [searchValue, setSearchValue] = useState('');
//     const [activeFilter, setActiveFilter] = useState(null);
//     const [filterValue, setFilterValue] = useState([]);
//     const [bestSellingProducts, setBestSellingProducts] = useState([]);

//     const slideshowData = [
//         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLydSdCQpfkTYXEr9h6QtbbX7kil98KchigjGcJABZipGc9HYtCS2EM6Afi3DdbsX8n30&usqp=CAU',
//         'https://kenhphunu.com/media/102015/1536771600/mypham1.jpg',
//         'https://media.hasaki.vn/hsk/sua-rua-mat-cho-da-dau-mun-tuoi-day-thi-2.png',
//     ];

//     useEffect(() => {
//         fetchCategories();
//         fetchProducts();
//         fetchBestSellingProducts();
//     }, [selectedCategory, activeFilter, filterValue, searchValue]);

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`http://192.168.171.30:5000/api/productCategory`);
//             if (response.data.success) {
//                 setCategories(response.data.productCategory);
//             }
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     };

//     const fetchProducts = async () => {
//         setLoading(true);
//         let params = {};
//         if (searchValue) {
//             params.productName = searchValue;
//         } else if (selectedCategory) {
//             params.categoryId = selectedCategory._id;
//         }
//         if (filterValue && activeFilter != null) {
//             params.sort = filterValue.sort;
//         }

//         try {
//             const response = await apiGetProducts(params);
//             if (response.data.success) {
//                 setProducts(response.data.productData);
//                 setFilteredProducts(response.data.productData);
//             }
//         } catch (error) {
//             setProducts([]);
//             setFilteredProducts([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = (query) => {
//         setSearchValue(query);
//         fetchProducts();
//     };

//     const handleFilter = (filterType) => {
//         if (activeFilter === filterType) {
//             setActiveFilter(null);
//         } else {
//             setActiveFilter(filterType);
//             let params;
//             switch (filterType) {
//                 case 'best-seller':
//                     params = { sort: '-soldQuantity' };
//                     break;
//                 case 'new-product':
//                     params = { sort: '-createdAt' };
//                     break;
//                 case 'featured':
//                     params = { sort: '-rating' };
//                     break;
//                 default:
//                     params = {};
//             }
//             setFilterValue(params);
//         }
//     };

//     const handleCategorySelect = (category) => {
//         setSelectedCategory(category);
//     };

//     const fetchBestSellingProducts = async () => {
//         try {
//             const response = await apiGetProducts({ sort: '-soldQuantity', page: 1, limit: 12 });
//             if (response.data.success) {
//                 setBestSellingProducts(response.data.productData);
//             }
//         } catch (error) {
//             setBestSellingProducts([]);
//         }
//     };

//     const groupedProducts = bestSellingProducts.length > 0 ? groupProducts(bestSellingProducts, 3) : [];

//     return (
//         <View style={styles.container}>
//             <SearchBar onSearch={handleSearch} />
    
//             <View style={{ height: 120, marginBottom: 10 }}>
//                 <Swiper showsButtons={true} autoplay={true}>
//                     {slideshowData.map((item, index) => (
//                         <View style={styles.slide} key={index}>
//                             <Image source={{ uri: item }} style={styles.image} />
//                         </View>
//                     ))}
//                 </Swiper>
//             </View>
    
//             <DrawerMenu
//                 categories={categories}
//                 onSelectCategory={handleCategorySelect}
//                 disabled={!!searchValue}
//             />
    
//             <View style={styles.filterContainer}>
//                 <Filter onFilter={handleFilter} activeFilter={activeFilter} />
//             </View>
    
//             {loading ? (
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color="#0000ff" />
//                 </View>
//             ) : (
//                 <ScrollView contentContainerStyle={styles.scrollViewContent}>
//                     <TopSellingProducts groupedProducts={groupedProducts} />
//                     {filteredProducts.length === 0 ? (
//                         <Text style={styles.noProductsText}>Không có sản phẩm</Text>
//                     ) : (
//                         <ProductList products={filteredProducts} />
//                     )}
//                 </ScrollView>
//             )}
//         </View>
//     );
// };

// const groupProducts = (products, groupSize) => {
//     const grouped = [];
//     for (let i = 0; i < products.length; i += groupSize) {
//         grouped.push(products.slice(i, i + groupSize));
//     }
//     return grouped;
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFF0F5',
//         paddingBottom: 20,
//     },
//     filterContainer: {
//         height: 60,
//         marginBottom: 10,
//         marginTop: 10,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noProductsText: {
//         textAlign: 'center',
//         marginTop: 20,
//         fontSize: 18,
//         color: 'gray',
//     },
//     slide: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 10,
//         resizeMode: 'cover',
//     },
//     scrollViewContent: {
//         paddingBottom: 20,
//         backgroundColor: '#FFFFFF',
//     },
// });

// export default HomeScreen;


import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, Text, Image, Dimensions } from 'react-native';
import axios from 'axios';
import DrawerMenu from '../components/DrawerMenu';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import TopSellingProducts from '../components/TopSellingProducts';
import Swiper from 'react-native-swiper';

const { width: viewportWidth } = Dimensions.get('window');

export const apiGetProducts = (params) => axios({
    url: 'http://192.168.171.30:5000/api/product/',
    method: 'get',
    params
});

const HomeScreen = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);
    const [filterValue, setFilterValue] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    const slideshowData = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLydSdCQpfkTYXEr9h6QtbbX7kil98KchigjGcJABZipGc9HYtCS2EM6Afi3DdbsX8n30&usqp=CAU',
        'https://kenhphunu.com/media/102015/1536771600/mypham1.jpg',
        'https://media.hasaki.vn/hsk/sua-rua-mat-cho-da-dau-mun-tuoi-day-thi-2.png',
    ];

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        fetchBestSellingProducts();
    }, [selectedCategory, activeFilter, filterValue, searchValue]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://192.168.171.30:5000/api/productCategory`);
            if (response.data.success) {
                setCategories(response.data.productCategory);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async (page = 1) => {
        setLoading(page === 1);
        setLoadingMore(page > 1);
        let params = {
            page,
            limit: 12,
        };

        if (searchValue) {
            params.productName = searchValue;
        } else if (selectedCategory) {
            params.categoryId = selectedCategory._id;
        }
        if (filterValue && activeFilter != null) {
            params.sort = filterValue.sort;
        }

        try {
            const response = await apiGetProducts(params);
            if (response.data.success) {
                if (page === 1) {
                    setProducts(response.data.productData);
                    setFilteredProducts(response.data.productData);
                } else {
                    console.log('layz loading')
                    setProducts((prevProducts) => [...prevProducts, ...response.data.productData]);
                    setFilteredProducts((prevProducts) => [...prevProducts, ...response.data.productData]);
                }
            }
        } catch (error) {
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleSearch = (query) => {
        setSearchValue(query);
        fetchProducts();
    };

    const handleFilter = (filterType) => {
        if (activeFilter === filterType) {
            setActiveFilter(null);
        } else {
            setActiveFilter(filterType);
            let params;
            switch (filterType) {
                case 'best-seller':
                    params = { sort: '-soldQuantity' };
                    break;
                case 'new-product':
                    params = { sort: '-createdAt' };
                    break;
                case 'featured':
                    params = { sort: '-rating' };
                    break;
                default:
                    params = {};
            }
            setFilterValue(params);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset page when changing category
        fetchProducts(1);
    };

    const fetchBestSellingProducts = async () => {
        try {
            const response = await apiGetProducts({ sort: '-soldQuantity', page: 1, limit: 12 });
            if (response.data.success) {
                setBestSellingProducts(response.data.productData);
            }
        } catch (error) {
            setBestSellingProducts([]);
        }
    };

    const groupedProducts = bestSellingProducts.length > 0 ? groupProducts(bestSellingProducts, 3) : [];

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    return (
        <View style={styles.container}>
            <SearchBar onSearch={handleSearch} />

            <View style={{ height: 120, marginBottom: 10 }}>
                <Swiper showsButtons={true} autoplay={true}>
                    {slideshowData.map((item, index) => (
                        <View style={styles.slide} key={index}>
                            <Image source={{ uri: item }} style={styles.image} />
                        </View>
                    ))}
                </Swiper>
            </View>

            <DrawerMenu
                categories={categories}
                onSelectCategory={handleCategorySelect}
                disabled={!!searchValue}
            />

            <View style={styles.filterContainer}>
                <Filter onFilter={handleFilter} activeFilter={activeFilter} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            if (!loadingMore && filteredProducts.length > 0) {
                                setCurrentPage((prevPage) => {
                                    const nextPage = prevPage + 1;
                                    fetchProducts(nextPage);
                                    return nextPage;
                                });
                            }
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    <TopSellingProducts groupedProducts={groupedProducts} />
                    {filteredProducts.length === 0 ? (
                        <Text style={styles.noProductsText}>Không có sản phẩm</Text>
                    ) : (
                        <ProductList products={filteredProducts} />
                    )}
                    {loadingMore && <ActivityIndicator size="large" color="#0000ff" />}
                </ScrollView>
            )}
        </View>
    );
};

const groupProducts = (products, groupSize) => {
    const grouped = [];
    for (let i = 0; i < products.length; i += groupSize) {
        grouped.push(products.slice(i, i + groupSize));
    }
    return grouped;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F5',
        paddingBottom: 20,
    },
    filterContainer: {
        height: 60,
        marginBottom: 10,
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProductsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    scrollViewContent: {
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
});

export default HomeScreen;