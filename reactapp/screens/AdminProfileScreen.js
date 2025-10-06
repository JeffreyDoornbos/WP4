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
import { useIsFocused } from '@react-navigation/native';


    const AdminProfile = () => {
        const navigation = useNavigation();
        const { logout,user } = useAuth();

        const [adminData, setAdminData] = useState('geen');
        const placeholderImage = 'https://picsum.photos/id/1/200/300';
        const isFocused = useIsFocused();


        // useEffect(() => {
        const fetchAdminProfiel = async () => {
          try {
            const response = await fetch(`${BASE_URL}/api/dashboard/admin/profiel/${user.id}`);
            const result = await response.json();
            setAdminData(result);
          } catch (err) {
            console.error("Fout bij ophalen van uw profiel:", err);
          }
        };

        useEffect(() => {
            if (isFocused && user?.id) {
                fetchAdminProfiel();
           }
        }, [isFocused]);

        const handleLogout = () => {
          logout();
          navigation.navigate("Home");
        };

        const admin = adminData || user?.beheerders;

        if (!admin) return <Text>Profiel wordt geladen...</Text>;

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
                          <Text style={styles.smallText}>Profiel</Text>
                          <Text style={styles.largeText}>{admin[1] || "Geen gegevens"}  {admin[2] || "Geen gegevens"}</Text>
                      </View>
                  </View>

                  {/*info chart*/}
                  <View style={styles.infoContainer}>
                      <Text style={styles.smallText}>Email: {admin[3] || "Geen gegevens"}</Text>
                  </View>

                    {/*Admin overzicht*/}
                    <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('AdminView', )}>
                      <Text style={styles.buttonText}>Admin overzicht</Text>
                    </TouchableOpacity>

                    {/*logout knop*/}
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                      <Text style={styles.buttonText}>logout</Text>
                    </TouchableOpacity>

                    {/*Profiel wijzigen knop*/}
                    <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('AdminBewerken', { id: user.id })}>
                      <Text style={styles.buttonText}>Profiel wijzigen</Text>
                    </TouchableOpacity>

              </ScrollView>
            </SafeAreaView>
        )
    };

export default AdminProfile;

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