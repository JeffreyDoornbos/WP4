// screens/BronnenOverzicht.js

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/userContext';

const BASE_URL = 'http://127.0.0.1:8000/api/studenten';


const POLLING_INTERVAL = 30000;

const BronnenOverzicht = ({ navigation }) => {
  const { user } = useAuth();
  const studentId = user?.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Alles');
  const [bronnen, setBronnen] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uniekeCategorieen, setUniekeCategorieen] = useState(['Alles']);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // 1) Haal alle bronnen op
  const fetchBronnen = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/alle_bronnen`);
      if (!res.ok) throw new Error('Fout bij ophalen bronnen');
      const data = await res.json();
      setBronnen(data);

      // categorieën extraheren
      const cats = data
        .flatMap(b => (b.categorieen || '').split(',').map(s => s.trim()))
        .filter(s => !!s);
      setUniekeCategorieen(['Alles', ...Array.from(new Set(cats))]);
    } catch (err) {
      console.error(err);
      Alert.alert('Netwerkfout', 'Kon bronnen niet ophalen.');
    } finally {
      setLoading(false);
    }
  };

  // 2) Haal favorieten op
  const fetchFavorites = async () => {
    if (!studentId) return;
    try {
      const res = await fetch(
        `${BASE_URL}/favorieten?studenten_id=${studentId}`
      );
      if (!res.ok) throw new Error('Fout bij ophalen favorieten');
      const favs = await res.json();
      const ids = favs.map(item => Array.isArray(item) ? item[0] : item.id);
      setFavoriteIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  // initial load + polling
  useEffect(() => {
    fetchBronnen();
    fetchFavorites();
    const iv = setInterval(() => {
      fetchBronnen();
      fetchFavorites();
    }, POLLING_INTERVAL);
    return () => clearInterval(iv);
  }, [studentId]);

  // Re-filter als iets verandert
  useEffect(() => {
    let temp = [...bronnen];

    if (showFavorites) {
      temp = temp.filter(b => favoriteIds.includes(b.id));
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      temp = temp.filter(b =>
        b.bron_titel.toLowerCase().includes(term)
      );
    }
    if (selectedSubject !== 'Alles') {
      temp = temp.filter(b =>
        (b.categorieen || '')
          .toLowerCase()
          .split(',')
          .map(s => s.trim())
          .includes(selectedSubject.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [showFavorites, searchTerm, selectedSubject, bronnen, favoriteIds]);

  return (
    <SafeAreaView style={styles.container}>
      {/* header met extra knop */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bronnen Overzicht</Text>
        <TouchableOpacity
          style={styles.mySourcesBtn}
          onPress={() => navigation.navigate('MijnBronnenScreen')}
        >
          <Ionicons name="folder-open-outline" size={20} color="#fff" />
          <Text style={styles.mySourcesText}>Mijn Bronnen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <Text>Alle bronnen</Text>
        <Switch
          value={showFavorites}
          onValueChange={setShowFavorites}
        />
        <Text>Favorieten</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Zoek op titel..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={setSelectedSubject}
          style={styles.picker}
        >
          {uniekeCategorieen.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BronToevoegen')}
      >
        <Text style={styles.addButtonText}>Bron toevoegen</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#e60038" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filtered.length > 0 ? (
            filtered.map(bron => (
              <TouchableOpacity
                key={bron.id}
                style={styles.sourceCard}
                onPress={() => navigation.navigate('BronDetail', { id: bron.id })}
              >
                <Text style={styles.sourceTitle}>{bron.bron_titel}</Text>
                <Text numberOfLines={2} style={styles.sourceText}>
                  {bron.bron_tekst}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {bron.datum_aangemaakt.split(' ')[0]}
                  </Text>
                  <Text style={styles.metaText}>
                    {bron.beoordeeld ? 'Beoordeeld' : 'Niet beoordeeld'}
                  </Text>
                </View>
                {bron.categorieen ? (
                  <View style={styles.tagWrapper}>
                    {bron.categorieen.split(',').map((c, i) => (
                      <Text key={i} style={styles.tag}>
                        {c.trim()}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {showFavorites
                ? 'Geen favoriete bronnen gevonden.'
                : 'Geen bronnen gevonden.'}
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default BronnenOverzicht;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0e8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e60038',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mySourcesBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  mySourcesText: {
    color: '#e60038',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#e60038',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sourceCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sourceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#eee',
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
    fontSize: 16,
  },
});