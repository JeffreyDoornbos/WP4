import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CarProvider } from './context/CarContext';
import DrawerNavigator from './navigation/DrawerNavigator';
import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { LoginScreen } from './screens/LoginScreen';
import { RegistrationScreen } from './screens/RegistrationScreen';
import { AuthProvider } from "./context/userContext";

enableScreens();

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Unsupported top level event type "topInsetsChange" dispatched',
  /topInsetsChange/,
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <DrawerNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
