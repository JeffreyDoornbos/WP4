import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
    Modal,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import { useAuth } from "../context/userContext";

const BASE_URL = 'http://127.0.0.1:8000';

export default function LoginScreen() {
  const route = useRoute();
  const { login } = useAuth();
  const navigation  = useNavigation();

  const [Email, setEmail     ] = useState(route.params?.email ||'');
  const [Password, setPassword    ] = useState(route.params?.password ||'');
  const [message, setMessage] = useState('');

  const handleLogin= async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/login/adminlogin`, {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: Email,
          wachtwoord: Password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Login successful') {
        login(data.user);
        console.log("navigating");
        navigation.goBack();
        navigation.navigate('BronnenOverzicht');

      } else {
        setMessage('Error Login' + data.message);
      }

    } catch (error) {
      console.error(error);
      setMessage("Netwerkfout of server onbereikbaar");
    }
  };


  return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.form}>

            <Text style={styles.title}>Admin Login</Text>
            <TextInput
                style={styles.input}
                placeholder="email"
                value={Email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="password"
                secureTextEntry={true}
                value={Password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {message !== '' && (
                <Text style={styles.errorMessage}>{message}</Text>
            )}

          </ScrollView>
        </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e60038',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    height: 44,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    marginTop: 6,
  },
    label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },

    centerText: {
    fontSize: 14,
    color: '#333',
    marginTop: 12,
      textAlign: 'center',
      fontWeight: 'normal',
    },

    button: {
    marginTop: 24,
    backgroundColor: '#e60038',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorMessage: {
    marginTop : 20,
    fontweight: 'bold',
    fontSize: 14,
    color: '#e60038'
  }
});
