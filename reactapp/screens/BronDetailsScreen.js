// screens/BronDetailsScreen.js

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RatingButton from '../components/ratingButton';
import { useAuth } from '../context/userContext';

const BASE_URL = 'http://127.0.0.1:8000/api/studenten';

export default function BronDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const { user } = useAuth();
  const studentId = user?.id;

  const [bron, setBron] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isFavoriet, setIsFavoriet] = useState(false);

  useEffect(() => {
    fetchBronDetail();
  }, [id]);

  const fetchBronDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/bron_bekijken/${id}?studenten_id=${studentId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Bron niet gevonden.');
        else throw new Error('Server gaf een fout.');
      }
      const data = await res.json();
      const [
        _id,
        bron_titel,
        bron_tekst,
        bron_link,
        bron_video,
        datum_aangemaakt,
        beoordeeld,
        student_naam,
        aantal_reacties,
        categorie_namen,
        indeling_namen,
        gemiddelde_beoordeling,
      ] = data;

      setBron({
        id: _id,
        bron_titel,
        bron_tekst,
        bron_link,
        bron_video,
        datum_aangemaakt,
        beoordeeld,
        student_naam,
        aantal_reacties,
        categorie_namen,
        indeling_namen,
        gemiddelde_beoordeling,
      });
      setUserRating(beoordeeld || 0);

      // favoriet-status
      if (studentId) {
        const favRes = await fetch(
          `${BASE_URL}/favorieten?studenten_id=${studentId}`
        );
        if (favRes.ok) {
          const favs = await favRes.json();
          setIsFavoriet(Array.isArray(favs) && favs.some(f => f[0] === _id));
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (ratingValue) => {
    if (!studentId) {
      Alert.alert('Je moet ingelogd zijn om te beoordelen.');
      return;
    }
    try {
      const url = `${BASE_URL}/beoordeel_bron?studenten_id=${studentId}&bronnen_id=${id}&beoordeling=${ratingValue}`;
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Beoordeling mislukt.');
      setUserRating(ratingValue);
      await fetchBronDetail();
      Alert.alert('Bedankt!', 'Je beoordeling is opgeslagen.');
    } catch (e) {
      Alert.alert('Fout', e.message);
    }
  };

  const toggleFavoriet = async () => {
    if (!studentId) {
      Alert.alert('Je moet ingelogd zijn om favoriet te zetten.');
      return;
    }
    try {
      const endpoint = isFavoriet ? 'favoriet_verwijderen' : 'favoriet_toevoegen';
      const method = isFavoriet ? 'DELETE' : 'POST';
      const url = `${BASE_URL}/${endpoint}?studenten_id=${studentId}&bronnen_id=${id}`;
      const res = await fetch(url, { method });
      if (!res.ok) throw new Error('Kon favoriet niet wijzigen.');
      setIsFavoriet(!isFavoriet);
    } catch (e) {
      Alert.alert('Fout', e.message);
    }
  };

  const shareBron = async () => {
    if (!bron) return;
    try {
      await Share.share({
        message: `Bekijk deze bron: ${bron.bron_titel}\n\n${bron.bron_link}`,
        url: bron.bron_link,
        title: bron.bron_titel,
      });
    } catch {
      /* no-op */
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e60038" />;
  }
  if (error) {
    return (
      <View style={styles.messageWrapper}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!bron) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#e60038" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bron Detail</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Bron titel</Text>
        <Text style={styles.value}>{bron.bron_titel}</Text>

        <Text style={styles.label}>Gemaakt door</Text>
        <Text style={styles.value}>{bron.student_naam}</Text>

        <Text style={styles.label}>Bron tekst</Text>
        <Text style={styles.value}>{bron.bron_tekst}</Text>

        <Text style={styles.label}>Bron link</Text>
        <Text
          style={[styles.value, styles.link]}
          onPress={() => Linking.openURL(bron.bron_link)}
        >
          {bron.bron_link}
        </Text>

        <Text style={styles.label}>Bron video</Text>
        {bron.bron_video ? (
          <TouchableOpacity
            style={styles.videoPlaceholder}
            onPress={() => Linking.openURL(bron.bron_video)}
          >
            <Ionicons name="play-circle-outline" size={48} color="#fff" />
            <Text style={styles.playText}>Bekijk video</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.value}>Geen video beschikbaar</Text>
        )}

        <Text style={styles.label}>Datum aangemaakt</Text>
        <Text style={styles.value}>
          {bron.datum_aangemaakt.split(' ')[0] || 'Onbekend'}
        </Text>

        <Text style={styles.label}>Gem. beoordeling</Text>
        <Text style={styles.value}>
          {bron.gemiddelde_beoordeling != null
            ? bron.gemiddelde_beoordeling.toFixed(1)
            : 'Niet beoordeeld'}
        </Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Jouw beoordeling</Text>
        <RatingButton initialRating={userRating} onRate={submitRating} />
      </ScrollView>

      {/* Bottom buttons: favoriet + share */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.favButton} onPress={toggleFavoriet}>
          <Ionicons
            name={isFavoriet ? 'heart' : 'heart-outline'}
            size={24}
            color="#fff"
          />
          <Text style={styles.favButtonText}>
            {isFavoriet ? 'Verwijder favoriet' : 'Voeg toe aan favorieten'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={shareBron}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Delen</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { padding: 16, paddingBottom: 100 },
  label: { fontSize: 14, fontWeight: 'bold', marginTop: 12, color: '#333' },
  value: { fontSize: 14, marginTop: 4, color: '#333' },
  link: { color: '#007bff', textDecorationLine: 'underline' },
  videoPlaceholder: {
    height: 180,
    borderRadius: 8,
    backgroundColor: '#000',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: { marginTop: 8, color: '#fff', fontWeight: 'bold' },
  messageWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#e60038', fontSize: 16 },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  favButton: {
    flexDirection: 'row',
    backgroundColor: '#e60038',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  favButtonText: { color: '#fff', fontSize: 14, marginLeft: 8 },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#e60038',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: { color: '#fff', fontSize: 14, marginLeft: 8 },
});