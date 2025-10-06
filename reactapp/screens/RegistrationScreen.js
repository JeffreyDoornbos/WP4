import React, { useState } from 'react';
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
import { useAuth } from "../context/userContext";
import * as ImagePicker from 'expo-image-picker';
// import * as mime from 'mime-types';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

const BASE_URL = 'http://127.0.0.1:8000/api/login';

const RegistrationScreen = () => {
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [email, setEmail]             = useState('');
  const [username, setusername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword]       = useState('');
  const [postalCode, setPostalCode]   = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender]           = useState('')
  const [message, setMessage] = useState('');
  const [homeadres, setHomeadres] = useState('');
  const [photo, setPhoto] = useState('');

  //optionele registratie velden
  const [ShowOptionalFields, setShowOptionalFields] = useState(false);

  //navigatie constant
  const navigation = useNavigation();


  // const for de registratie
  const handleRegister = async() => {
    // E-mail validatie: moet @hr.nl
    if (!email.toLowerCase().endsWith('@hr.nl')) {
      Alert.alert('Ongeldig e-maildomein', 'E-mail moet eindigen op @hr.nl');
      return;
    }

    // kleine aanpassing, json data wordt form
    const formData = new FormData();
    formData.append('voornaam', firstName);
    formData.append('achternaam', lastName);
    formData.append('gebruikersnaam', username);
    formData.append('wachtwoord', password);
    formData.append('studentnummer', studentNumber);
    formData.append('email', email);
    formData.append('telefoonnummer', phoneNumber);
    formData.append('postcode', postalCode);
    formData.append('geboortedatum', birthdate);
    formData.append('geslacht', gender);
    formData.append('huisnummer', homeadres);

    try {
      const response = await fetch(`${BASE_URL}/register`, {
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
        navigation.navigate("LoginScreen",
            {
              email: email,
              password: password,
            });
      }

    } catch (error) {
      console.error(error);
      setMessage("Netwerkfout of server onbereikbaar");
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>


        {/*
        <View style={styles.container}>
          <TouchableOpacity style={styles.editButton} onPress={selectPhoto}>
          <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: photo || placeholderImage }}
            style={styles.photo}
          />
        </View>
        */}


        <Text style={styles.label}>E-mail (@hr.nl)</Text>
        <TextInput
          style={styles.input}
          placeholder="naam@hr.nl"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>gebruikersnaam</Text>
        <TextInput
          style={styles.input}
          placeholder="gebruikersnaam"
          value={username}
          onChangeText={setusername}
        />
          <Text style={styles.label}>studentennummer</Text>
          <TextInput
            style={styles.input}
            placeholder="123456"
            value={studentNumber}
            onChangeText={setStudentNumber}
            keyboardType="email-address"
            autoCapitalize="none"
          />

        <Text style={styles.label}>Wachtwoord</Text>
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />


        <TouchableOpacity style={styles.showFields}
        onPress={()=>setShowOptionalFields(prev => !prev)}>
            <AntDesign name ={ShowOptionalFields ?  "up": "down"}
            size ={24}
            color = '#e60038'/>
        </TouchableOpacity>


        {ShowOptionalFields && (
            <>
          <Text style={styles.label}>Voornaam</Text>
          <TextInput
            style={styles.input}
            placeholder="Voornaam (optional)"
            value={firstName}
            onChangeText={setFirstName}
          />


          <Text style={styles.label}>Achternaam</Text>
          <TextInput
            style={styles.input}
            placeholder="Achternaam (optional)"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text style={styles.label}>geboortedatum</Text>
          <TextInput
            style={styles.input}
            placeholder="geboortedatum (optional)"
            value={birthdate}
            onChangeText={setBirthdate}
          />





            <Text style={styles.label}>adres</Text>
          <TextInput
            style={styles.input}
            placeholder="adres (optional)"
            value={homeadres}
            onChangeText={setHomeadres}
          />

          <Text style={styles.label}>Postcode</Text>
          <TextInput
            style={styles.input}
            placeholder="1234AB (optional)"
            value={postalCode}
            onChangeText={setPostalCode}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Telefoonnummer</Text>
          <TextInput
            style={styles.input}
            placeholder="0612345678 (optional)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Geslacht</Text>
          <TextInput
            style={styles.input}
            placeholder="Man / Vrouw / Anders"
            value={gender}
            onChangeText={setGender}
          />
          </>
        )}


        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registreren</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;

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