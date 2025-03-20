// import React, { useState, useContext } from 'react';
// import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, ImageBackground, Image } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { UserContext } from '../config/UserContext';


// const Login = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [otp, setOtp] = useState('');

//   const { updateInfoUser } = useContext(UserContext);

//   const validateInputs = () => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if(!email || !password){
//       Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường');
//       return false;
//     }
//     if (!emailPattern.test(email)) {
//       Alert.alert('Lỗi', 'Email không hợp lệ.');
//       return false;
//     }
//     if (password.length < 6) {
//       Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
//       return false;
//     }
//     return true;
//   };

//   const handleLogin = async () => {
//     if (!validateInputs()) return;
//     try {
//       const response = await axios.post('http://192.168.171.30:5000/api/user/login', {
//         email,
//         password,
//       });
//       if (response.data.success) {
//         const token = response.data.accessToken; // Giả sử token được trả về trong response
//         await AsyncStorage.setItem('token', token); // Lưu token vào AsyncStorage
//         updateInfoUser();
//         navigation.navigate('HomeTabs'); // Chuyển đến màn hình chính hoặc màn hình khác
//       } else {
//         console.log("111")
//         Alert.alert('Lỗi', response.data.mess);
//       }
//     } catch (error) {
//       if (error.response) {
//         Alert.alert('Lỗi', `${JSON.stringify(error.response.data.mess)}`);
//       } else if (error.request) {
//         Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
//       } else {
//         Alert.alert('Lỗi', `Lỗi: ${error.message}`);
//       }
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleForgotPassword = async () => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if(!email){
//       Alert.alert('Lỗi', 'Vui lòng nhập email');
//       return false;
//     }
//     if (!emailPattern.test(email)) {
//       Alert.alert('Lỗi', 'Email không hợp lệ.');
//       return false;
//     }
//     try {
//       const response = await axios.post('http://192.168.171.30:5000/api/user/forgetpassword', {
//         email,
//       });
//       if (response.data.success) {
//         Alert.alert('Thông báo', response.data.mess);
//         setShowResetPassword(true)
//       } else {
//         Alert.alert('Lỗi', response.data.mess);
//       }
//     } catch (error) {
//       Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
//     }
//   };

//   const handleResetPassword = async () => {
//     console.log("======== " + otp +"  " + password)
//     try {
//       const response = await axios.put('http://192.168.171.30:5000/api/user/resetpassword', {
//         email,
//         otp,
//         password,
//       });
//       if (response.data.success) {
//         setShowForgotPassword(false);
//         setShowResetPassword(false); // Đóng form cập nhật mật khẩu
//         Alert.alert('Thông báo', 'Cập nhật mật khẩu thành công.', [
//           {
//             text: 'OK',
//             onPress: () => navigation.navigate('Login'), // Chuyển tới giao diện đăng nhập
//           },
//         ]);
//       } else {
//         Alert.alert('Lỗi', response.data.mess);
//       }
//     } catch (error) {
//       console.log("LOI NE " + error)
//       Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
//     }
//   };

//   return (
//       <>
//         {(!showForgotPassword && !showResetPassword)? (
//           <ImageBackground
//             source={require('../../assets/backgroundlogin.jpg')} // Thay đường dẫn tới ảnh nền của bạn
//             style={styles.background}
//           >
//           <View style= {styles.container}>
//             <Text style={styles.header}>Đăng Nhập</Text>
//             <Image 
//               source={require('../../assets/people-skin-care.png')} // Thay đường dẫn tới ảnh nền của bạn
//               style={styles.imgicon}
//             />
//             <TextInput
//               placeholder="Email"
//               placeholderColor="#FF6347"
//               value={email}
//               onChangeText={setEmail}
//               style={styles.input}
//               autoCapitalize="none"
//             />
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 placeholder="Mật khẩu"
//                 placeholderColor="#FF6347"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 style={styles.input}
//               />
//               <TouchableOpacity onPress={togglePasswordVisibility}>
//                 <Text style={styles.togglePasswordText}>{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</Text>
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity style={styles.button} onPress={handleLogin}>
//               <Text style={styles.buttonText}>Đăng Nhập</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
//               <Text style={styles.link}>Quên mật khẩu?</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.link}  onPress={() => navigation.replace('Register')}>Đăng ký</Text>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Text style={styles.link}  onPress={() => navigation.replace('HomeTabs')}>Về trang chủ</Text>
//             </TouchableOpacity>
//            </View>
//           </ImageBackground>
//         ): (showForgotPassword && !showResetPassword) ?(
//           <ImageBackground
//             source={require('../../assets/backgroundlogin.jpg')} // Thay đường dẫn tới ảnh nền của bạn
//             style={styles.background}
//           >
//             <View style= {styles.container}>
//               <Text 
//                 style={{fontSize: 35,
//                 fontWeight: 'bold',
//                 marginBottom: 10,
//                 marginLeft: 110,
//                 color: '#333',}}
//               >
//               Quên mật khẩu
//               </Text>
//               <Image 
//                 source={require('../../assets/fogot-icon.png')} // Thay đường dẫn tới ảnh nền của bạn
//                 style={{
//                   width: 230,
//                   height: 230,
//                   marginLeft: 110
//                 }}
//               />
//               <View style={styles.forgotPasswordContainer}>
//                 <TextInput
//                   placeholder="Nhập email"
//                   value={email}
//                   onChangeText={setEmail}
//                   style={styles.inputFogot}
//                   placeholderColor="#FF6347"
//                   autoCapitalize="none"
//                 />
//                 <TouchableOpacity style={styles.buttonFogot} onPress={handleForgotPassword}>
//                   <Text style={styles.buttonText}>Gửi Email</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setShowForgotPassword(false)}>
//                   <Text style={styles.link}>Quay lại đăng nhập</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ImageBackground>
//         ): showResetPassword? (
//           <ImageBackground
//           source={require('../../assets/backgroundlogin.jpg')}
//           style={styles.background}
//         >
//           <View style={styles.container}>
//             <Text style={{
//               fontSize: 35,
//               fontWeight: 'bold',
//               marginBottom: 10,
//               marginLeft: 80,
//               color: '#333',
//             }}>Cập nhật mật khẩu</Text>
//             <Image 
//               source={require('../../assets/fogot-icon.png')}
//               style={{
//                 width: 230,
//                 height: 230,
//                 marginLeft: 110
//               }}
//             />
//             <View style={styles.forgotPasswordContainer}>
//               <TextInput
//                 placeholderColor="#FF6347"
//                 autoCapitalize="none"
//                 placeholder="Nhập OTP"
//                 value={otp}
//                 onChangeText={setOtp}
//                 style={styles.inputFogot}
//               />
//               <TextInput
//                 placeholderColor="#FF6347"
//                 autoCapitalize="none"
//                 placeholder="Mật khẩu mới"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 style={styles.inputFogot}
//               />
//               <TouchableOpacity onPress={togglePasswordVisibility}>
//                 <Text style={styles.togglePasswordText}>{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.buttonFogot} onPress={handleResetPassword}>
//                 <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => {  setShowResetPassword(false); setShowForgotPassword(false);}}>
//                 <Text style={styles.link}>Quay lại đăng nhập</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ImageBackground>
//         ): null}
//      </>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   imgicon: {
//     width: 200,
//     height: 200,
//     marginLeft: 110
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF', // Nền trắng với độ trong suốt
//     borderTopRightRadius: 40, // Bo tròn viền cho container
//     borderTopLeftRadius: 40,
//     marginTop: 60,
//   },
//   header: {
//     fontSize: 35,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     marginLeft: 130,
//     color: '#333',
//   },
//   input: {
//     height: 50,
//     borderColor: '#000000',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 20,
//     paddingLeft: 15,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//     marginLeft: 30,
//     marginRight: 30,
//   },
//   inputFogot: {
//     width: 350,
//     height: 50,
//     borderColor: '#000000',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 20,
//     paddingLeft: 15,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//     marginLeft: 30,
//     marginRight: 30,
//   },
//   passwordContainer: {
//     flexDirection: 'column',
//   },
//   togglePasswordText: {
//     color: '#007BFF',
//     marginLeft: 300,
//     marginTop: 10,
//     marginBottom: 30
//   },
//   button: {
//     backgroundColor: '#FF99CC',
//     borderRadius: 8,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     marginLeft: 30,
//     marginRight: 30
//   },
//   buttonFogot: {
//     width: 350,
//     backgroundColor: '#FF9999',
//     borderRadius: 8,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 30,
//     marginBottom: 40,
//     marginLeft: 30,
//     marginRight: 30
//   },
//   buttonText: {
//     color: '#000000',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   link: {
//     color: '#007BFF',
//     textAlign: 'center',
//     marginTop: 10,
//     cursor: 'pointer'
//   },
//   forgotPasswordContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Login;


import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../config/UserContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const { updateInfoUser } = useContext(UserContext);

  const validateInputs = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường');
      return false;
    }
    if (!emailPattern.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      const response = await axios.post('http://192.168.171.30:5000/api/user/login', {
        email,
        password,
      });
      if (response.data.success) {
        const token = response.data.accessToken;
        await AsyncStorage.setItem('token', token);
        updateInfoUser();
        navigation.navigate('HomeTabs');
      } else {
        Alert.alert('Lỗi', response.data.mess);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Lỗi', `${JSON.stringify(error.response.data.mess)}`);
      } else if (error.request) {
        Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        Alert.alert('Lỗi', `Lỗi: ${error.message}`);
      }
    }
  };

  const handleForgotPassword = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return false;
    }
    if (!emailPattern.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ.');
      return false;
    }
    try {
      const response = await axios.post('http://192.168.171.30:5000/api/user/forgetpassword', {
        email,
      });
      if (response.data.success) {
        Alert.alert('Thông báo', response.data.mess);
        setShowResetPassword(true);
      } else {
        Alert.alert('Lỗi', response.data.mess);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp. Vui lòng nhập lại.');
      return;
    }
    try {
      const response = await axios.put('http://192.168.171.30:5000/api/user/resetpassword', {
        email,
        otp,
        password,
      });
      if (response.data.success) {
        setShowForgotPassword(false);
        setShowResetPassword(false);
        Alert.alert('Thông báo', 'Cập nhật mật khẩu thành công.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Lỗi', response.data.mess);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {(!showForgotPassword && !showResetPassword) ? (
        <ImageBackground
          source={require('../../assets/backgroundlogin.jpg')}
          style={styles.background}
        >
          <View style={styles.container}>
            <Text style={styles.header}>Đăng Nhập</Text>
            <Image 
              source={require('../../assets/people-skin-care.png')}
              style={styles.imgicon}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Text style={styles.togglePasswordText}>{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
              <Text style={styles.link}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('HomeTabs')}>
              <Text style={styles.link}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (showResetPassword ? (
        <ImageBackground
          source={require('../../assets/backgroundlogin.jpg')}
          style={styles.background}
        >
          <View style={styles.container}>
            <Text style={styles.header}>Cập nhật mật khẩu</Text>
            <Image 
              source={require('../../assets/fogot-icon.png')}
              style={styles.imgicon}
            />
            <View style={styles.forgotPasswordContainer}>
              <TextInput
                placeholder="Nhập OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.inputFogot}
              />
              <TextInput
                placeholder="Mật khẩu mới"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.inputFogot}
              />
              <TextInput
                placeholder="Xác nhận mật khẩu mới" // New confirmation password field
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                style={styles.inputFogot}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Text style={styles.togglePasswordText}>{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonFogot} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowResetPassword(false); setShowForgotPassword(false); }}>
                <Text style={styles.link}>Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={require('../../assets/backgroundlogin.jpg')}
          style={styles.background}
        >
          <View style={styles.container}>
            <Text style={styles.header}>Quên mật khẩu</Text>
            <Image 
              source={require('../../assets/fogot-icon.png')}
              style={styles.imgicon}
            />
            <View style={styles.forgotPasswordContainer}>
              <TextInput
                placeholder="Nhập email"
                value={email}
                onChangeText={setEmail}
                style={styles.inputFogot}
              />
              <TouchableOpacity style={styles.buttonFogot} onPress={handleForgotPassword}>
                <Text style={styles.buttonText}>Gửi Email</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowForgotPassword(false)}>
                <Text style={styles.link}>Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  imgicon: {
    width: 200,
    height: 200,
    marginLeft: 110
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: 60,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 130,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    paddingLeft: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginLeft: 30,
    marginRight: 30,
  },
  inputFogot: {
    width: 350,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    paddingLeft: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginLeft: 30,
    marginRight: 30,
  },
  passwordContainer: {
    flexDirection: 'column',
  },
  togglePasswordText: {
    color: '#007BFF',
    marginLeft: 300,
    marginTop: 10,
    marginBottom: 30
  },
  button: {
    backgroundColor: '#FF99CC',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30
  },
  buttonFogot: {
    width: 350,
    backgroundColor: '#FF9999',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 30,
    marginRight: 30
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    cursor: 'pointer'
  },
  forgotPasswordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;