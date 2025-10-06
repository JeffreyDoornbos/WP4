// components/RatingButton.js

import React from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StarSize = 24;
const StarCount = 5;

export default function RatingButton({ initialRating = 0, onRate }) {
  const [rating, setRating] = React.useState(initialRating);

  const handlePress = (starIndex) => {
    const newRating = starIndex + 1; // van 0-based naar 1–5
    setRating(newRating);
    if (onRate) onRate(newRating);
  };

  return (
    <SafeAreaView>
      <View style={styles.stars}>
        {Array.from({ length: StarCount }).map((_, idx) => (
          <TouchableOpacity key={idx} onPress={() => handlePress(idx)}>
            <MaterialIcons
              name={idx < rating ? 'star' : 'star-border'}
              size={StarSize}
              style={idx < rating ? styles.filled : styles.empty}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stars: { flexDirection: 'row' },
  filled: { color: '#e6b800', marginHorizontal: 2 },
  empty: { color: '#999', marginHorizontal: 2 },
});