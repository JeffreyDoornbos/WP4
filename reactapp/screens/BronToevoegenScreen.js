// screens/BronToevoegenScreen.js
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useAuth} from "../context/userContext";

const BASE_URL = 'http://127.0.0.1:8000/api/studenten';

const BronToevoegenScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const studentId = user?.id;

  const handleSave = async () => {
    if (!title.trim() || !text.trim() || !link.trim()) {
      Alert.alert('Fout', 'Vul ten minste Titel, Tekst en Link in.');
      return;
    }

    const videoField = videoUrl.trim() || "";
    
    const payload = {
      bron_titel: title.trim(),
      bron_tekst: text.trim(),
      bron_link: link.trim(),
      bron_video: videoField,
    };

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/studenten/${studentId}/nieuwe_bron`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const json = await response.json();
        Alert.alert(
          'Succes',
          `Bron is succesvol opgeslagen (ID: ${json.id}).`
        );
        navigation.goBack();
      } else {
        // Foutmelding van de server uitlezen
        const errorData = await response.json();
        const msg = errorData.detail || errorData.message || 'Onbekende fout tijdens opslaan.';
        Alert.alert('Fout', msg);
      }
    } catch (err) {
      console.error('API‐fout:', err);
      Alert.alert('Fout', 'Kan geen verbinding maken met de server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#e60038" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bron Toevoegen</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Titel*</Text>
        <TextInput
          style={styles.input}
          placeholder="Voer titel in"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Tekst*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Voer beschrijving in"
          value={text}
          onChangeText={setText}
          multiline
          editable={!loading}
        />

        <Text style={styles.label}>Link*</Text>
        <TextInput
          style={styles.input}
          placeholder="https://"
          value={link}
          onChangeText={setLink}
          autoCapitalize="none"
          keyboardType="url"
          editable={!loading}
        />

        <Text style={styles.label}>Video URL (optioneel)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://youtu.be/..."
          value={videoUrl}
          onChangeText={setVideoUrl}
          autoCapitalize="none"
          keyboardType="url"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && { backgroundColor: '#aaa' }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Opslaan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BronToevoegenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#e60038',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});