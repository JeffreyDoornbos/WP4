import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CarDetailScreen = ({ route, navigation }) => {
  const { car } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{car.brand} {car.model}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Merk:</Text>
          <Text style={styles.value}>{car.brand}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{car.model}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Kleur:</Text>
          <Text style={styles.value}>{car.colour}</Text>
        </View>

        <View style={[styles.colorSwatch, { backgroundColor: getColorCode(car.colour) }]} />

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Terug naar Lijst</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getColorCode = (colorName) => {
  const colorMap = {
    'Rood': '#FF0000',
    'Blauw': '#0000FF',
    'Groen': '#008000',
    'Zwart': '#000000',
    'Wit': '#FFFFFF',
    'Zilver': '#C0C0C0',
    'Grijs': '#808080',
    'Geel': '#FFFF00',
    'Oranje': '#FFA500',
    'Paars': '#800080',
  };

  return colorMap[colorName] || '#CCCCCC'; // Default to gray if color not found
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  colorSwatch: {
    height: 50,
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  backButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CarDetailScreen;
