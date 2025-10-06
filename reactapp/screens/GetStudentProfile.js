import React, {useEffect, useState} from 'react';
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
import  DonutChart from "../components/donutChart";
import {useNavigation, useRoute} from "@react-navigation/native";
import { useAuth } from "../context/userContext";
import {BASE_URL} from "../config";


    const GetStudentProfile = () => {
        const navigation = useNavigation();
        const { id } = route.params;
        const { user } = useAuth();
        const studentId = user?.id;

        const [studentenData, setStudentenData] = useState('geen');
        const placeholderImage = 'https://picsum.photos/id/1/200/300';
        const tempscore = 30;


        useEffect(() => {
            const fetchStudentProfiel = async () => {
              try {
                const response = await fetch(`${BASE_URL}/api/studenten/${id}`);
                const result = await response.json();
                setStudentenData(result);
              } catch (err) {
                console.error("Fout bij ophalen van uw profiel:", err);
              }
            };

            if (id) {
              fetchStudentProfiel();
            }
          }, [id]);

          const studenten = studentenData;

          if (!studenten) return <Text>Profiel wordt geladen...</Text>;

            return (
                <SafeAreaView style={styles.container}>
                  <ScrollView contentContainerStyle={styles.form}>


                      {/* account info zit in dit block*/}
                      <View style={styles.infoBlock}>
                          <Image
                            source={{ uri: placeholderImage }}
                            style={styles.photo}
                          />
                          <View style={styles.textContainer}>
                              <Text style={styles.smallText}>Profiel van:</Text>
                              <Text style={styles.largeText}>{studenten[1] || "Geen gegevens"} {studenten[2] || "Geen gegevens"}</Text>
                          </View>
                      </View>

                      {/*info chart*/}
                      <View style={styles.infoContainer}>
                          <Text style={styles.smallText}>Gebruikersnaam: {studenten[13] || "Geen gegevens"}</Text>
                          <Text style={styles.smallText}>Email: {studenten[3] || "Geen gegevens"}</Text>
                          <Text style={styles.smallText}>Studentnummer: {studenten[4] || "Geen gegevens"}</Text>
                          <Text style={styles.smallText}>Geboortedatum: {studenten[5] || "Geen gegevens"} </Text>
                          <Text style={styles.smallText}>Adres: {studenten[6] || "Geen gegevens"} {studenten[7] || "Geen gegevens"}</Text>
                          <Text style={styles.smallText}>Telefoonnummer: {studenten[8] || "Geen gegevens"}</Text>
                          <Text style={styles.smallText}>Geslacht: {studenten[9] || "Geen gegevens"}</Text>
                      </View>

                      {/*Sanctie container = geen*/}
                      {studenten[14] === 0 && studenten[15] === 0 && studenten[16] === 0 && (
                      <View style={styles.infoContainer}>
                         <Text style={styles.smallText}>Sancties: De student heeft geen sancties! </Text>
                      </View>
                      )}

                      {/*Sanctie container = hoger dan 0*/}
                      {studenten[14] > 0 || studenten[15] === 1 || studenten[16] === 1 && (
                      <View style={styles.infoContainer}>
                         {studenten[14] > 0 && (
                          <Text style={styles.smallText}>Waarschuwing: De student heeft {studenten[14]} waarschuwingen! </Text>
                         )}

                         {studenten[15] === 1 && (
                          <Text style={styles.smallText}>Muted: De student is gemute, dit betekend dat de student geen reactie mag geven!</Text>
                         )}

                         {studenten[16] === 1 && (
                          <Text style={styles.smallText}>Geblokkeerd: De student is geblokkeerd, foutje? Pas het aan. </Text>
                         )}
                      </View>
                      )}


                        {/*component voor score*/}
                        <View style={styles.infoContainer}>
                        <Text style={styles.smallText}>score:</Text>
                        <DonutChart percentage={tempscore}/>
                        </View>

                        {/*Aantal bronnen, incl naar aantal bronnen*/}
                          {studenten[10] > 0 && (
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('bronnenlijst')}>
                          <Text style={styles.buttonText}>Aantal bronnen: {studenten[10]}</Text>
                        </TouchableOpacity>
                          )}

                        {/*Profiel wijzigen knop*/}
                        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('ProfielBewerken', { id: user.id })}>
                          <Text style={styles.buttonText}>Profiel wijzigen</Text>
                        </TouchableOpacity>

                  </ScrollView>
                </SafeAreaView>
            )
        };

export default GetStudentProfile;

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
  paddingBottom: 3,
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
        paddingHorizontal: 20,
    },

  photo: {
  width: 80,
  height: 80,
  borderRadius: 100,
  alignSelf: 'center',
  marginBottom: 20,
},
    infoContainer: {
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
  }
});