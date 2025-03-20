import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import Dialog from 'react-native-dialog';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(''); // Trạng thái cho OTP
  const [dialogVisible, setDialogVisible] = useState(false);

    const validateInputs = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!email || !password || !name || !phone) {
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
      if(phone.length != 10){
        console.log(phone.length)
        Alert.alert('Lỗi', 'SĐT phải có  10 số.');
        return false;
      }
      return true;
    };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    try {
      const response = await axios.post('http://192.168.171.30:5000/api/user/register', {
        email,
        password,
        name,
        phone,
      });
      console.log("Phản hồi từ server:", response);
      if (response.data.success) {
        setDialogVisible(true); // Hiển thị dialog khi đăng ký thành công
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

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.171.30:5000/api/user/finalregister', {
        email,
        otp,
      });
      if (response.data.success) {
        Alert.alert('Xác nhận thành công', 'Bạn đã đăng ký thành công!');
        navigation.navigate('Login'); // Chuyển đến màn hình chính hoặc màn hình khác
      } else {
        Alert.alert('Lỗi', response.data.mess);
      }
    } catch (error) {
      console.error('Lỗi xác nhận OTP:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundregister.jpg')} // Điều chỉnh đường dẫn hình ảnh nếu cần
      style={styles.background}
    >
      <View>           
        <Text style={styles.header}>Đăng Ký</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
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
          <Text style={styles.textnote}>Lưu ý: Mật khẩu phải có ít nhất 6 ký tự</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link} onPress={() => navigation.replace('Login')}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
        </View>

      {/* Dialog để xác nhận OTP */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Xác nhận OTP</Dialog.Title>
        <Dialog.Description>
          Vui lòng kiểm tra email để nhận mã OTP.
        </Dialog.Description>
        <TextInput
          placeholder="Nhập mã OTP"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          keyboardType="numeric"
        />
        <Dialog.Button label="Xác nhận" onPress={handleOtpSubmit} />
        <Dialog.Button label="Hủy" onPress={() => setDialogVisible(false)} />
      </Dialog.Container>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: 'column',
  },
  togglePasswordText: {
    color: '#000000',
    marginLeft: 300,
    marginTop: 15,
  },
  button: {
    backgroundColor: '#FF9999',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#000000',
    textAlign: 'center',
    marginTop: 10,
    cursor: 'pointer'
  },
  textnote: {
    marginLeft: 30,
    marginBottom: 30,
  }
});

export default Register;