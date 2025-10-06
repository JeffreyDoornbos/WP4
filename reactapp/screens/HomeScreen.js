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
import Header from '../components/header';

const CARDS = [
  {
    id: '1',
    title: 'Heb jij goede bronnen nodig?',
    description:
      'Check het nu en bekijk de bronnen die de hogerejaars voor je hebben klaarstaan!',
    // thumbnail: require('../assets/video_placeholder.png'),
  },
  {
    id: '2',
    title: 'Heb jij goede bronnen nodig?',
    description:
      'Check het nu en bekijk de bronnen die de hogerejaars voor je hebben klaarstaan!',
    // thumbnail: require('../assets/video_placeholder.png'),
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header/>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image carousel placeholder */}
        <View style={styles.carousel}>
          <Image
            source={{ uri: 'https://rotterdammakeithappen.nl/app/uploads/2020/06/locatie-mp-e1593452842364.jpg' }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          <View style={styles.dotsContainer}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>Voorbereid in het eerste jaar!</Text>
        </View>

        {CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => {
              /* navigation to video detail or play */
            }}
          >
            <Image source={card.thumbnail} style={styles.cardThumb} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0e8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#d1d1d1',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e60038',
  },
  headerButtons: { flexDirection: 'row' },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#888',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 8,
  },
  headerBtnText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },

  scrollContent: { paddingBottom: 16 },

  carousel: {
    height: 200,
    backgroundColor: '#ccc',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  carouselImage: { width: '100%', height: '100%' },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },

  banner: {
    backgroundColor: '#e60038',
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  cardThumb: {
    width: 120,
    height: 80,
    backgroundColor: '#000',
  },
  cardTextContainer: {
    flex: 1,
    backgroundColor: '#e60038',
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});