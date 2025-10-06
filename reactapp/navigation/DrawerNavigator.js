import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import { Text, View, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

const HelpScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hulp & FAQ</Text>
    <Text style={styles.subtitle}>Hoe gebruik je deze app:</Text>
    <View style={styles.list}>
      <Text style={styles.listItem}>• Blader door auto's in het Auto's tabblad</Text>
      <Text style={styles.listItem}>• Filter auto's op merk, model of kleur</Text>
      <Text style={styles.listItem}>• Tik op een auto om details te bekijken</Text>
      <Text style={styles.listItem}>• Gebruik de tabs onderaan om tussen secties te navigeren</Text>
      <Text style={styles.listItem}>• Open het zijmenu voor aanvullende opties</Text>
    </View>

    <Text style={styles.subtitle}>Navigatietypes gedemonstreerd:</Text>
    <View style={styles.list}>
      <Text style={styles.listItem}>• Stack Navigatie - Schakelen tussen schermen met een terugknop</Text>
      <Text style={styles.listItem}>• Tab Navigatie - Tabs onderaan voor hoofdsecties</Text>
      <Text style={styles.listItem}>• Drawer Navigatie - Zijmenu voor aanvullende opties</Text>
    </View>
  </View>
);

const ContactScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Neem Contact Op</Text>
    <Text style={styles.text}>
      Dit is een demo-applicatie gemaakt voor educatieve doeleinden.
    </Text>
    <Text style={styles.text}>
      Voor meer informatie over React Native navigatie, bezoek:
    </Text>
    <Text style={styles.link}>https://reactnavigation.org/</Text>
  </View>
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#007bff',
        drawerInactiveTintColor: '#555',
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen 
        name="Thuis" 
        component={TabNavigator} 
        options={{
          headerShown: true,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Hulp" 
        component={HelpScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Contact" 
        component={ContactScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="mail-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
  },
  link: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default DrawerNavigator;
