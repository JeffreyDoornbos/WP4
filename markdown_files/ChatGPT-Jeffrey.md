Het beste bekijken als zonder markdown

**Hoe gebruik ik app.include_router in FastAPI?

Chat antwoord


from fastapi import FastAPI
from controllers.example_controller import router as example_router

app = FastAPI()

app.include_router(
    example_router,
    prefix="/api/example",
    tags=["example"],
)

OpenAI. (2025, juni 10). ChatGPT (versie 4.0) [Large language model]. https://chat.openai.com/chat












**Kun je me een voorbeeld geven van een React Native-pagina met een header, een afbeelding, wat tekst en kaarten die je kunt aanklikken?

Chat antwoord
✅ React Native Voorbeeld: HomeScreen.jsx

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ExampleScreen = () => {
  const cards = [
    {
      id: '1',
      title: 'Welkom bij de app!',
      description: 'Bekijk handige bronnen die ouderejaars hebben gedeeld.',
      // image: require('../assets/example1.png'),
    },
    {
      id: '2',
      title: 'Tips voor je eerste jaar',
      description: 'Lees hoe je het meeste uit je studie haalt.',
      // image: require('../assets/example2.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mijn Studie App</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Banner image */}
        <View style={styles.imageBanner}>
          <Image
            // source={require('../assets/banner.png')}
            style={styles.bannerImage}
          />
        </View>

        {/* Card List */}
        {cards.map((card) => (
          <TouchableOpacity key={card.id} style={styles.card}>
            <Image
              // source={card.image}
              style={styles.cardImage}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExampleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#e60038',
    color: '#fff',
    textAlign: 'center',
  },
  scroll: { padding: 16 },
  imageBanner: {
    height: 180,
    backgroundColor: '#ccc',
    marginBottom: 16,
    borderRadius: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
  },
  cardText: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
  },
});


OpenAI. (2025, 20 mei. ChatGPT (versie 4.0) [Large language model]. https://chat.openai.com/chat