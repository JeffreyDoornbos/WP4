// screens/StudentListScreen.js

import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = 'http://127.0.0.1:8000/api/dashboard';

export default function StudentListScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/studenten_lijst`);
      if (!res.ok) throw new Error('Kon studenten niet ophalen');
      const data = await res.json();
      const mapped = data.map((row) => ({
        id: String(row[0]),
        name: `${row[1]} ${row[2]}`,
        sources: row[11] ?? 0,
        reactions: 0, // of uit API halen als beschikbaar
        points: row[10] ?? 0,
        muted: row[13] === 1,
        blocked: row[14] === 1,
      }));
      setStudents(mapped);
    } catch (err) {
      Alert.alert('Fout', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);


  const updateFlag = async (id, field, value) => {
    const endpoint = field === 'muted' ? 'student_mute' : 'student_block';
    const paramName = field === 'muted' ? 'muted' : 'geblokkeerd';

    try {
      const res = await fetch(
        `${BASE_URL}/${endpoint}?studenten_id=${id}&${paramName}=${value}`,
        { method: 'PUT' }
      );
      if (!res.ok) throw new Error();
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, [field]: value === 1 } : s
        )
      );
    } catch {
      Alert.alert('Fout', `Kon ${field === 'muted' ? 'mute' : 'block'} niet bijwerken`);
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <TouchableOpacity style={styles.radio} />
        <Text
          style={[
            styles.studentName,
            (item.muted || item.blocked) && styles.disabledText,
          ]}
        >
          {item.name}
        </Text>
        <View style={styles.metrics}>
          <TouchableOpacity>
            <Text style={styles.metricLink}>{item.sources} Bronnen</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.metricLink}>{item.reactions} Reacties</Text>
          </TouchableOpacity>
          <Text style={styles.points}>{item.points} Punten</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Muted</Text>
          <Switch
            value={item.muted}
            onValueChange={(v) => updateFlag(item.id, 'muted', v ? 1 : 0)}
            trackColor={{ false: '#ccc', true: '#e60038' }}
            thumbColor="#fff"
          />
          <Text style={styles.toggleLabel}>Geblok.</Text>
          <Switch
            value={item.blocked}
            onValueChange={(v) =>
              updateFlag(item.id, 'blocked', v ? 1 : 0)
            }
            trackColor={{ false: '#ccc', true: '#e60038' }}
            thumbColor="#fff"
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('GetStudentProfile', { id: item.id })}>
          <Text style={styles.profileLink}>Bekijk profiel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RAcademy</Text>
        <Ionicons name="menu" size={28} color="#e60038" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e60038" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderStudent}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f5f0e8' },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerTitle:    { fontSize: 24, fontWeight: 'bold', color: '#e60038' },

  listContent:    { paddingBottom: 16 },

  studentCard:    { backgroundColor: '#fff', margin: 16, borderRadius: 8, padding: 12, elevation: 1 },
  studentInfo:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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