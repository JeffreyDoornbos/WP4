// AdminViewScreen (gekopieerd van Jeffrey's studentenlijst)

import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/userContext";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
import {BASE_URL} from "../config";
import {useIsFocused, useNavigation} from "@react-navigation/native";

// const BASE_URL = 'http://127.0.0.1:8000/api/dashboard';

export default function AdminView() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: loggedInUser } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/dashboard/admin_lijst`);
      if (!res.ok) throw new Error('Kon admins niet ophalen');
      const data = await res.json();
      const mapped = data.map((row) => ({
        id: String(row[0]),
        name: `${row[1]} ${row[2]}`,
        email: row[3],
      }));
      setAdmins(mapped);

    } catch (err) {
      Alert.alert('Fout', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
       if (isFocused) {
            fetchAdmins();
       }
  }, [isFocused]);

  const handleDelete = async (id) => {
    // setLoading(true);
    try {
        const res = await fetch(`${BASE_URL}/api/dashboard/delete/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Kon admin niet verwijderen');
        const result = await res.json();

        if (result.success) {
           await fetchAdmins();
           Alert.alert(result.message || "De admin is verwijderd!");
        } else {
           Alert.alert(result.message || "Admin is niet verwijderd!");
        }

      } catch (err) {
          console.error("Fout bij ophalen van uw profiel:", err);
          Alert.alert(err.message || "Er ging iets fout bij het verwijderen van de admin.");
      }

      // } finally {
      //   setLoading(false);
      // }

      // useEffect(() => {
      //   if (isFocused) {
      //         fetchAdmins();
      //   }
      // }, [isFocused]);

  };

  const renderAdmin = ({ item }) => (
    <View style={styles.adminCard}>
      <View style={styles.adminInfo}>
        <TouchableOpacity style={styles.radio} />
        <Text
          style={[
            styles.studentName,
          ]}
        >
          {item.name}
        </Text>
      </View>

        <Text
          style={[
            styles.adminInfo,
          ]}
        >
          {item.email}
        </Text>


        {/*Alert popup toevoegen (Weet je het zeker?)!*/}

        {String(item.id) !== String(loggedInUser?.id) && (
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.profileLink}>Verwijder admin</Text>
          </TouchableOpacity>
        )}

    </View>


  );

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RAcademy</Text>

          <View style={styles.buttongroup}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminProfile')}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewAdmin')}>
              <Text style={styles.buttonText}>Nieuwe admin</Text>
            </TouchableOpacity>
          </View>

        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#e60038" style={{flex: 1}}/>
        ) : (
            <FlatList
                data={admins}
                keyExtractor={(item) => item.id}
                renderItem={renderAdmin}
                contentContainerStyle={styles.listContent}
            />
        )}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f0e8'},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerTitle: {fontSize: 24, fontWeight: 'bold', color: '#e60038'},

  buttongroup: {flexDirection: 'row', justifyContent: 'flex-end', gap: 10, paddingVertical: 10, marginEnd: 10},
  button: {marginTop: 10, backgroundColor: '#e60038', paddingVertical: 14, borderRadius: 10, alignItems: 'center', width: 150 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  listContent:    { paddingBottom: 10 },

  adminCard:    { backgroundColor: '#fff', margin: 12, borderRadius: 8, padding: 12, elevation: 1 },
  adminInfo:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  radio:          { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#e60038' },
  studentName:    { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: 'bold', color: '#e60038' },
  disabledText:   { color: '#999' },

  metrics:        { flexDirection: 'row', alignItems: 'center' },
  metricLink:     { marginHorizontal: 8, color: '#e60038', textDecorationLine: 'underline' },
  points:         { fontWeight: 'bold', marginHorizontal: 8, color: '#333' },

  actions:        { marginTop: 12 },
  toggleRow:      { flexDirection: 'row', alignItems: 'center' },
  toggleLabel:    { fontSize: 14, marginHorizontal: 4, color: '#333' },
  profileLink:    { color: '#e60038', fontWeight: 'bold', marginTop: 8 },
});