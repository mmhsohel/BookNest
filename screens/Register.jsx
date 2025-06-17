import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetAuthState } from '../redux/slices/authSlice';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const handleRegister = () => {
    dispatch(registerUser({ name, phone, password }));
  };

 useEffect(() => {
  if (success) {
    Toast.show({
      type: 'success',
      text1: 'Registration Successful 🎉',
      text2: 'You can now log in',
    });

    setTimeout(() => {
      dispatch(resetAuthState());
      navigation.replace('Login');
    }, 2000); // 2 seconds delay for toast to finish
  } else if (error) {
    Toast.show({
      type: 'error',
      text1: 'Registration Failed ❌',
      text2: error || 'Please try again.',
    });

    // Optionally clear error after toast is shown
    setTimeout(() => {
      dispatch(resetAuthState());
    }, 3000);
  }
}, [success, error]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Your Mobile Number"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryButtonText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>

      {/* Toast Component must be added in root App.js */}
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1abc9c',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  button: {
    backgroundColor: '#1abc9c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1abc9c',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#1abc9c',
    fontSize: 16,
    fontWeight: '500',
  },
});
