// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import SplashScreen from './src/screens/SplashScreen';
// import Onboarding from './src/screens/Onboarding';
// import HomeScreen from './src/screens/HomeScreen';
// import Login from './src/screens/Login';
// import Register from './src/screens/Register';
// import ProductDetail from './src/screens/ProductDetail';
// import ReviewScreen from './src/screens/ReviewScreen';
// import Toast from 'react-native-toast-message';
// import MyCart from './src/screens/MyCart';
// import Checkout from './src/screens/Checkout';
// import { CartProvider } from './src/config/CartContext';
// import History from './src/screens/History';
// import Personal from './src/screens/Personal';


// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// export default function App() {
//   return (
//     <CartProvider>
//         <NavigationContainer>
//           <Stack.Navigator initialRouteName="Splash">
//           <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
//           <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//           <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
//           <Stack.Screen name="HomeScreen" component={HomeDrawer} options={{ headerShown: false }}/>
//           <Stack.Screen name="ProductDetail" component={ProductDetail} />
//           <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
//           <Stack.Screen name="Checkout" component={Checkout} />
//           {/* <Stack.Screen name="HistoryOrderItem" component={HistoryOrderItem} /> */}
//         </Stack.Navigator>
//         {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
//       </NavigationContainer>
//     </CartProvider>
//   );
// }

// // Tạo một hàm component cho Drawer
// const HomeDrawer = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="MyCart" component={MyCart} /> 
//       <Drawer.Screen name="History" component={History} /> 
//       <Drawer.Screen name="Personal" component={Personal} /> 
//     </Drawer.Navigator>
//   );
// };


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './src/screens/SplashScreen';
import Onboarding from './src/screens/Onboarding';
import HomeScreen from './src/screens/HomeScreen';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import ProductDetail from './src/screens/ProductDetail';
import ReviewScreen from './src/screens/ReviewScreen';
import MyCart from './src/screens/MyCart';
import Checkout from './src/screens/Checkout';
import { CartProvider } from './src/config/CartContext';
import History from './src/screens/History';
import Personal from './src/screens/Personal';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider } from './src/config/UserContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // Use Bottom Tab Navigator

export default function App() {
  return (
    <CartProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
            <Stack.Screen name="Checkout" component={Checkout} />
          </Stack.Navigator>
          {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
        </NavigationContainer>
      </UserProvider>
    </CartProvider>
  );
}

// Tạo một hàm component cho Tab Navigator
const HomeTabs = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'MyCart':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'History':
            iconName = focused ? 'time' : 'time-outline';
            break;
          case 'Personal':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  > 
    <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyCart" component={MyCart} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Personal" component={Personal} />
  </Tab.Navigator>
  );
};