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
import DonutChart from "../components/donutChart";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfielBewerken = ({ navigation }) => {
    const { user, logout } = useAuth();

    const [studentenData, setStudentenData] = useState('geen');
    const placeholderImage = 'https://picsum.photos/id/1/200/300';
    const tempscore = 30;

    const [gebruikersnaam, setGebruikersnaam] = useState('');
    const [postcode, setPostcode] = useState('');
    const [huisnummer, setHuisnummer] = useState('');
    const [telefoonnummer, setTelefoonnummer] = useState('');
    const [profielicoon, setProfielicoon] = useState('');

    const [wachtwoord, setWachtwoord] = useState('');

    const [voornaam, setVoornaam] = useState('');
    const [achternaam, setAchternaam] = useState('');
    const [email, setEmail] = useState('');
    const [studentnummer, setStudentnummer] = useState('');
    const [geboortedatum, setGeboortedatum] = useState('');
    const [geslacht, setGeslacht] = useState('');

    // const [score, setScore] = useState('');
    // const [waarschuwing, setWaarschuwing] = useState('');
    // const [muted, setMuted] = useState('');
    // const [geblokkeerd, setGeblokkeerd] = useState('');

    const [loading, setLoading] = useState(false);

    const [showWachtwoord, setShowWachtwoord] = useState(false);
    const toggleShowWachwoord = () => {
        setShowWachtwoord(!showWachtwoord);
    };


    useEffect(() => {

        if (studentenData) {
            setVoornaam(studentenData[1] || "");
            setAchternaam(studentenData[2] || "");
            setEmail(studentenData[3] || "");
            setStudentnummer(studentenData[4] || "");
            setGeboortedatum(studentenData[5] || "");
            setPostcode(studentenData[6] || "");
            setHuisnummer(studentenData[7] || "");
            setTelefoonnummer(studentenData[8] || "");
            setGeslacht(studentenData[9] || "");
            setProfielicoon(studentenData[12] || "");
            setGebruikersnaam(studentenData[13] || "");
            setWachtwoord('');

            // setWaarschuwing(studenten[14] || "");
            // setMuted(studenten[15] || "");
            // setGeblokkeerd(studenten[16] || "");

        }

    }, [studentenData]);

    const submitHandler = async () => {
        const formData = new FormData();
        formData.set('student_id', user.id);
        formData.set('gebruikersnaam', gebruikersnaam);
        formData.set('postcode', postcode);
        formData.set('huisnummer', huisnummer);
        formData.set('telefoonnummer', telefoonnummer);
        formData.set('wachtwoord', wachtwoord);
        formData.set('afbeelding_icoon', profielicoon);
        formData.set('voornaam', voornaam);
        formData.set('achternaam', achternaam);
        formData.set('email', email);
        formData.set('studentnummer', studentnummer);
        formData.set('geboortedatum', geboortedatum);
        formData.set('geslacht', geslacht);

        // formData.set('waarschuwing', waarschuwing);
        // formData.set('muted', muted);
        // formData.set('geblokkeerd', geblokkeerd);

        if (email && !email.toLowerCase().endsWith('@hr.nl')) {
          Alert.alert('Ongeldig e-maildomein', 'E-mail moet eindigen op @hr.nl');
          return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/studenten/profiel_bewerken/${user.id}`, {
                method: 'PUT',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                Alert.alert(result.message || "Je profiel is succesvol gewijzigd!");
                navigation.navigate('StudentProfile')
            } else {
                Alert.alert(result.message || "Profiel wijzigen is niet gelukt!");
            }

        } catch (err) {
            console.error(err);
            Alert.alert(err.message || "Er ging iets fout bij het opslaan van uw wijzigingen.");
        }
    };


        useEffect(() => {
        const fetchStudentProfiel = async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/studenten/profiel/${user.id}`);
            const result = await response.json();
            setStudentenData(result);
          } catch (err) {
            console.error("Fout bij ophalen van uw profiel:", err);
          }
        };

        if (user?.id) {
          fetchStudentProfiel();
        }
      }, [user]);


    const handleLogout = () => {
        logout();
        navigation.navigate("Home");
    };

    const studenten = studentenData || user?.studenten;

    if (!studenten) return <Text>Profiel wordt geladen...</Text>;

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
                           source={{uri: placeholderImage || ""}}
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

                       <Text style={styles.label}>gebruikersnaam</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je gebruikersnaam in (Hou het vriendelijk)"
                           value={gebruikersnaam}
                           onChangeText={setGebruikersnaam}
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

                       <Text style={styles.label}>Studentnummer</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je studentnummer in"
                           value={studentnummer}
                           onChangeText={setStudentnummer}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Geboortedatum</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je geboortedatum in"
                           value={geboortedatum}
                           onChangeText={setGeboortedatum}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Postcode</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je postcode in"
                           value={postcode}
                           onChangeText={setPostcode}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Huisnummer</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je huisnummer in"
                           value={huisnummer}
                           onChangeText={setHuisnummer}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Telefoonnummer</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je telefoonnummer in"
                           value={telefoonnummer}
                           onChangeText={setTelefoonnummer}
                           editable={!loading}
                       />

                       <Text style={styles.label}>Geslacht</Text>
                       <TextInput
                           style={[styles.input, styles.textArea]}
                           placeholder="Voer hier je geslacht in"
                           value={geslacht}
                           onChangeText={setGeslacht}
                           editable={!loading}
                       />

                       {/*/!* Moet nog aangepast worden?*!/*/}
                       {/*<Text style={styles.label}>Profiel foto</Text>*/}
                       {/*<TextInput*/}
                       {/* style={[styles.input, styles.textArea]}*/}
                       {/* placeholder="Voer beschrijving in"*/}
                       {/* value={text}*/}
                       {/* onChangeText={setText}*/}
                       {/* editable={!loading}*/}
                       {/*/>*/}
                   </View>
               </View>

               {/*Sanctie container = geen*/}
               {studenten[14] === 0 && studenten[15] === 0 && studenten[16] === 0 && (
               <View style={styles.infoContainer}>
                 <Text style={styles.smallText}>Sancties: Je hebt geen sancties, ga zo door! </Text>
               </View>
               )}

              {/*Sanctie container = hoger dan 0*/}
              {studenten[14] > 0 || studenten[15] === 1 || studenten[16] === 1 && (
              <View style={styles.infoContainer}>
                 {studenten[14] > 0 && (
                  <Text style={styles.smallText}>Waarschuwing: Je hebt {studenten[14]} waarschuwingen! </Text>
                 )}

                 {studenten[15] === 1 && (
                  <Text style={styles.smallText}>Muted: Je bent gemute, dit betekend dat je geen reactie mag geven!</Text>
                 )}

                 {studenten[16] === 1 && (
                  <Text style={styles.smallText}>Geblokkeerd: Je account is geblokkeerd, foutje? Neem contact op met de moderators. </Text>
                 )}
              </View>
              )}

                {/*component voor score*/}
                <View style={styles.infoContainer}>
                <Text style={styles.smallText}>score:</Text>
                <DonutChart percentage={tempscore}/>
                </View>

                {/*logout knop*/}
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                  <Text style={styles.buttonText}>logout</Text>
                </TouchableOpacity>

                {/*cancel knop*/}
                <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('StudentProfile')}>
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

export default ProfielBewerken;

// Deze heb ik van de studenten profile screen gepakt
const styles = StyleSheet.create({
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