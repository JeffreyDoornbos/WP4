import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import StackNavigator from './StackNavigator';
import BronDetailsScreen from '../screens/BronDetailsScreen';
import BronToevoegenScreen from '../screens/BronToevoegenScreen';
import BronnenOverzicht from '../screens/BronnenOverzicht';
import StudentListScreen from '../screens/StudentListScreen';
import MijnBronnenScreen from '../screens/mijn_bronnen';
import StudentProfile from '../screens/StudentProfileScreen';
import AdminProfile from '../screens/AdminProfileScreen';
import { useAuth } from "../context/userContext";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useAuth();
  const isAdmin = user?.is_admin === true;

  console.log("USER:", user);
  console.log("isAdmin:", isAdmin);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Racademy") {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BronDetailsScreen') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'StudentListScreen') {
              iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'StudentProfileScreen') {
              iconName = focused ? 'people' : 'person-outline';
          } else if (route.name === 'AdminProfileScreen') {
              iconName = focused ? 'people' : 'person-outline';
          } else {
            iconName = focused ? 'home' : 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e60038',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Racademy"
        component={StackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen name="BronnenOverzicht" component={BronnenOverzicht} />
      {isAdmin && (
        <Tab.Screen name="StudentListScreen" component={StudentListScreen} />
      )}

      {user?.id !== undefined && (
      <Tab.Screen
          name="Mijn profiel"
          component={isAdmin? AdminProfile : StudentProfile}
          options={{ title: 'Mijn profiel' }}
      />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;