import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext';

const BASE_URL = 'http://127.0.0.1:8000/api/studenten';

export default function BronWijzigenScreen({ route, navigation }) {
  const { id } = route.params;
  const { user } = useAuth();
  const studentId = user?.id;

  const [bron, setBron] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editedTitel, setEditedTitel] = useState('');
  const [editedTekst, setEditedTekst] = useState('');
  const [editedLink, setEditedLink] = useState('');
  const [editedVideo, setEditedVideo] = useState('');
  const [editingTitel, setEditingTitel] = useState(false);
  const [editingTekst, setEditingTekst] = useState(false);
  const [editingLink, setEditingLink] = useState(false);
  const [editingVideo, setEditingVideo] = useState(false);

  const fetchBronDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/bron_bekijken/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Bron niet gevonden");
        else throw new Error("Server fout");
      }
      const data = await res.json();
      console.log(data);

      setBron(data);
            const [
        _id,
        bron_titel,
        bron_tekst,
        bron_link,
        bron_video,

      ] = data;
      setBron({
        id: _id,
        bron_titel,
        bron_tekst,
        bron_link,
        bron_video,
      })
      setEditedTitel(data.bron_titel || '');
      setEditedTekst(data.bron_tekst || '');
      setEditedLink(data.bron_link || '');
      setEditedVideo(data.bron_video || '');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const saveBron = async () => {
    setSaving(true);
    try {
      const updatedData = {
        bron_titel: editedTitel || bron.bron_titel,
        bron_tekst: editedTekst || bron.bron_tekst,
        bron_link: editedLink || bron.bron_link,
        bron_video: editedVideo || bron.bron_video,
      };
      const res = await fetch(`${BASE_URL}/wijzig_bron/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        throw new Error('Fout bij het opslaan van de bron');
      }

      setBron(prev =>
          ({
            ...prev,
            ...updatedData,
          }));

      setEditingTitel(false);
      setEditingTekst(false);
      setEditingLink(false);
      setEditingVideo(false);

      Alert.alert(
        'Succes',
        'Bron succesvol bijgewerkt!',
        navigation.goBack()
        [
          {
            text: 'OK',
            onPress: () => {
              setEditingTitel(false);
              setEditingTekst(false);
              setEditingLink(false);
              setEditingVideo(false);

              fetchBronDetails();
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert('Fout', err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = (field) => {
    switch (field) {
      case 'titel':
        setEditedTitel(bron?.bron_titel || '');
        setEditingTitel(false);
        break;
      case 'tekst':
        setEditedTekst(bron?.bron_tekst || '');
        setEditingTekst(false);
        break;
      case 'link':
        setEditedLink(bron?.bron_link || '');
        setEditingLink(false);
        break;
      case 'video':
        setEditedVideo(bron?.bron_video || '');
        setEditingVideo(false);
        break;
    }
  };

  const hasChanges = () => {
    if (!bron) return false;
    return (
      editedTitel !== (bron.bron_titel || '') ||
      editedTekst !== (bron.bron_tekst || '') ||
      editedLink !== (bron.bron_link || '') ||
      editedVideo !== (bron.bron_video || '')
    );
  };

  useEffect(() => {
    fetchBronDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageWrapper}>
          <ActivityIndicator size="large" color="#e60038" />
          <Text style={{ marginTop: 16, color: '#e60038' }}>Laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageWrapper}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBronDetails}>
            <Text style={styles.retryButtonText}>Opnieuw proberen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderEditableField = (label, value, editedValue, isEditing, setEditing, setValue, placeholder, multiline = false) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          {isEditing ? (
            <TextInput
              style={[styles.input, multiline && styles.textArea]}
              value={editedValue}
              onChangeText={setValue}
              placeholder={placeholder}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              textAlignVertical={multiline ? "top" : "center"}
              autoFocus={true}
            />
          ) : (
            <View style={styles.displayContainer}>
              <Text style={styles.displayText}>
                {value || `Geen ${label.toLowerCase()} ingesteld`}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => cancelEdit(label.toLowerCase())}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={() => setEditing(false)}
              >
                <Ionicons name="checkmark" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="pencil" size={20} color="#e60038" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/*Header*/}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#e60038" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bron Wijzigen</Text>
        <View style={{ width: 28 }} />
      </View>

      {/*pagina Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {bron && (
          <>
            {renderEditableField(
              'Titel',
              bron.bron_titel,
              editedTitel,
              editingTitel,
              setEditingTitel,
              setEditedTitel,
              'Voer titel in...'
            )}

            {renderEditableField(
              'Tekst',
              bron.bron_tekst,
              editedTekst,
              editingTekst,
              setEditingTekst,
              setEditedTekst,
              'Voer beschrijving in...',
              true
            )}

            {renderEditableField(
              'Link',
              bron.bron_link,
              editedLink,
              editingLink,
              setEditingLink,
              setEditedLink,
              'https://example.com'
            )}

            {renderEditableField(
              'Video',
              bron.bron_video,
              editedVideo,
              editingVideo,
              setEditingVideo,
              setEditedVideo,
              'https://youtube.com/watch?v=...'
            )}
          </>
        )}
      </ScrollView>

      {/*Button om opte slaan*/}
      {hasChanges() && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={saveBron}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Wijzigingen Opslaan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0e8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { padding: 16, paddingBottom: 100 },

  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fieldContent: {
    flex: 1,
    marginRight: 12,
  },
  displayContainer: {
    minHeight: 48,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
  },
  displayText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e60038',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    minHeight: 48,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#fff',
    borderColor: '#d1104b',
  },
  confirmButton: {
    backgroundColor: '#fff',
    borderColor: '#9a163d',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#666',
  },

  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#e60038',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  messageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e60038',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e60038',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});