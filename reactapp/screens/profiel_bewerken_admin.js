import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { useAuth } from '../context/userContext';
import { BASE_URL } from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const AdminBewerken = ({ navigation }) => {
    const { user, logout } = useAuth();

    const [adminData, setAdminData] = useState('');
    const placeholderImage = 'https://picsum.photos/id/1/200/300';
    const isFocused = useIsFocused();

    const [voornaam, setVoornaam] = useState('');
    const [achternaam, setAchternaam] = useState('');
    const [email, setEmail] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');

    const [loading, setLoading] = useState(false);

    const [showWachtwoord, setShowWachtwoord] = useState(false);
    const toggleShowWachwoord = () => {
        setShowWachtwoord(!showWachtwoord);
    };

    const fetchAdminProfiel = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/dashboard/admin/profiel/${user.id}`);
        const result = await response.json();
        setAdminData(result);
        console.log(user);
        console.log(result);
      } catch (err) {
        console.error("Fout bij ophalen van uw profiel:", err);
      }
    };

    useEffect(() => {
        if (isFocused && user?.id) {
            fetchAdminProfiel();
       }
    }, [isFocused]);

    useEffect(() => {

        if (adminData) {
            setVoornaam(adminData[1] || "");
            setAchternaam(adminData[2] || "");
            setEmail(adminData[3] || "");
            setWachtwoord('');

        }

    }, [adminData]);


    const submitHandler = async () => {
        const formData = new FormData();
        formData.set('admin_id', user.id);
        formData.set('voornaam', voornaam);
        formData.set('achternaam', achternaam);
        formData.set('email', email);
        formData.set('wachtwoord', wachtwoord);

        if (email && !email.toLowerCase().endsWith('@hr.nl')) {
          Alert.alert('Ongeldig e-maildomein', 'E-mail moet eindigen op @hr.nl');
          return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/dashboard/admin/profiel_bewerken/${user.id}`, {
                method: 'PUT',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                await fetchAdminProfiel();
                Alert.alert(result.message || "Je profiel is succesvol gewijzigd!");
                navigation.navigate('AdminProfile')
            } else {
                Alert.alert(result.message || "Profiel wijzigen is niet gelukt!");
            }

        } catch (err) {
            console.error(err);
            Alert.alert(err.message || "Er ging iets fout bij het opslaan van uw wijzigingen.");
        }
    };


    const handleLogout = () => {
        logout();
        navigation.navigate("Home");
    };

    // const admin = adminData || user;
    const admin = adminData || user;

    if (!admin) return <Text>Profiel wordt geladen...</Text>;

    return (
        <SafeAreaView style={styles.container}>
           <ScrollView contentContainerStyle={styles.form}>


              {/* account info zit in dit block*/}
               <View style={styles.infoBlock}>

                   <View style={styles.textContainer}>
                       <Text style={styles.largeText}>Profiel</Text>

                       <Text style={styles.label}>Profiel icoon</Text>
                       <View style={styles.infoBlock}>
                           <Image
                           source={{ uri: placeholderImage }}
                           style={styles.photo}
                           />
                       </View>

                       <Text style={styles.label}>Voornaam</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je voornaam in"
                           value={voornaam}
                           onChangeText={setVoornaam}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Achternaam</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je achternaam in"
                           value={achternaam}
                           onChangeText={setAchternaam}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Email</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je email in"
                           value={email}
                           onChangeText={setEmail}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Wachtwoord</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           // secureTextEntry={!showWachtwoord}
                           placeholder="Voer hier je wachtwoord in"
                           value={wachtwoord}
                           onChangeText={setWachtwoord}
                           editable={!loading}
                       />

                       <MaterialCommunityIcons
                        name={showWachtwoord ? 'eye-off' : 'eye'}
                        size={24}
                        color="#aaa"
                        style={styles.icon}
                        onPress={toggleShowWachwoord}
                       />

                   </View>
               </View>

                {/*logout knop*/}
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                  <Text style={styles.buttonText}>logout</Text>
                </TouchableOpacity>

                {/*cancel knop*/}
                <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('AdminProfile')}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                {/*Profiel wijzigen knop*/}
                <TouchableOpacity style={styles.button} onPress={submitHandler}>
                  <Text style={styles.buttonText}>Profiel wijzigen</Text>
                </TouchableOpacity>

           </ScrollView>
        </SafeAreaView>
    );

};

export default AdminBewerken;

// Deze heb ik van de studenten profile screen gepakt
const styles = StyleSheet.create({

  // headerRight: {
  //    icon
  // },
  form: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
smallText: {
  fontSize: 15,
  fontWeight: 'normal',
},
smallText2: {
  fontSize: 15,
  fontWeight: 'normal',
    color: '#9c9c9c',
},
    largeText: {
  fontSize: 25,
  fontWeight: 'bold',
        textTransform: 'uppercase',
},
    textContainer: {
      flex: 1,
  justifyContent: 'center',
        // paddingHorizontal: 20,
        padding: 10,
        marginBottom: 15,
        transform: [{ scale: 0.98 }],
    },
  photo: {
  width: 80,
  height: 80,
  borderRadius: 100,
  alignSelf: 'center',
  marginBottom: 20,
},
    infoContainer: {
      // flex: 1,
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 10,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.01,
      shadowRadius: 8,
      transform: [{ scale: 0.98 }],
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
    marginBottom: 5,
  },

    centerText: {
    fontSize: 14,
    color: '#333',
    marginTop: 12,
      textAlign: 'center',
      fontWeight: 'normal',
    },

    button: {
    marginTop: 10,
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

  infoBlock: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
  } ,
    errorMessage: {
    marginTop : 20,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#e60038'
  },
  inputField: {
    height: 40,
    borderColor: '#040404',
    borderWidth: 0.4,
    borderRadius: 4,
    marginTop: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
});