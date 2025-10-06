import React, {useEffect, useState} from 'react';
import { useAuth } from "../context/userContext";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
    Button,
    Image,
} from 'react-native';
import {useNavigation} from "@react-navigation/native";


import {BASE_URL} from "../config";

const NewAdmin = () => {
  const [voornaam, setVoornaam]     = useState('');
  const [achternaam, setAchternaam]       = useState('');
  const [email, setEmail]             = useState('');
  const [wachtwoord, setWachtwoord]       = useState('');

  //navigatie constant
  const navigation = useNavigation();

  const { user } = useAuth();

  // const for de registratie
  const handleRegister = async() => {
    // E-mail validatie: moet @hr.nl
    if (!email.toLowerCase().endsWith('@hr.nl')) {
      Alert.alert('Ongeldig e-maildomein', 'E-mail moet eindigen op @hr.nl');
      return;
    }

    // kleine aanpassing, json data wordt form
    const formData = new FormData();
    formData.append('voornaam', voornaam);
    formData.append('achternaam', achternaam);
    formData.append('email', email);
    formData.append('wachtwoord', wachtwoord);

    try {
      const response = await fetch(`${BASE_URL}/api/dashboard/register`, {
        method: 'POST',
        body: formData,
        headers: {
        'accept': 'application/json',
           },
      });

      const data = await response.json();
      if (!data.success) {
        console.log("fout bij navigeren")
      } else {
        console.log("navigatie is succesvol");
        navigation.navigate('AdminView')
      }

    } catch (error) {
      console.error(error);
      setMessage("Netwerkfout of server onbereikbaar");
    }
  };

  useEffect(() => {
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>

        <Text style={styles.label}>Voornaam</Text>
        <TextInput
          style={styles.input}
          placeholder="Voornaam"
          value={voornaam}
          onChangeText={setVoornaam}
        />

        <Text style={styles.label}>Achternaam</Text>
        <TextInput
          style={styles.input}
          placeholder="Achternaam"
          value={achternaam}
          onChangeText={setAchternaam}
        />

        <Text style={styles.label}>E-mail (@hr.nl)</Text>
        <TextInput
          style={styles.input}
          placeholder="naam@hr.nl"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Wachtwoord</Text>
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          value={wachtwoord}
          onChangeText={setWachtwoord}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('AdminView')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registreren</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default NewAdmin;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0e8' },
  form: {
    padding: 16,
  },
  Image: {
    width: '200',
    height: '200',
  },
  photo: {
  width: 200,
  height: 200,
  borderRadius: 100,
  alignSelf: 'center',
  marginBottom: 20,
},
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: '#5a5a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showFields: {
    marginTop: 24,

    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e60038',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 6,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#e60038',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});