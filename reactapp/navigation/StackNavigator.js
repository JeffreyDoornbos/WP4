// navigation/StackNavigator.js
import React from 'react';
import { useAuth } from "../context/userContext";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen        from '../screens/HomeScreen';
import BronDetailsScreen  from '../screens/BronDetailsScreen';
import BronToevoegenScreen from '../screens/BronToevoegenScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

import admin_login from '../screens/AdminLoginScreen';
import BronnenOverzicht from '../screens/BronnenOverzicht';
import StudentListScreen from '../screens/StudentListScreen';
import LoginScreen from '../screens/LoginScreen';
import StudentProfile from "../screens/StudentProfileScreen";
import ProfielBewerken from "../screens/mijn_profiel_wijzigen";
import MijnBronnenScreen from '../screens/mijn_bronnen';
import bronWijzigenScreen from '../screens/bronWijzigenScreen';
import AdminProfile from "../screens/AdminProfileScreen";
import AdminBewerken from "../screens/profiel_bewerken_admin";
import AdminView from '../screens/AdminViewScreen';
import NewAdmin from "../screens/NewAdminScreen";
import GetStudentProfile from "../screens/GetStudentProfile";

const Stack = createStackNavigator();


const StackNavigator = ()=> {
const { isLoggedIn } = useAuth();

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {backgroundColor: '#e60038'},
                headerTintColor: '#fff',
                headerTitleStyle: {fontWeight: 'bold'},
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{title: 'RAcademy'}}
            />
            <Stack.Screen
                name="StudentProfile"
                component={StudentProfile}
                options={{
                    title: 'StudentProfile',
                    presentation: 'modal',
                    animationEnabled: true,}}
            />
            <Stack.Screen
                name="BronDetail"
                component={BronDetailsScreen}
            />

            <Stack.Screen
                name="BronToevoegen"
                component={BronToevoegenScreen}
                options={{title: 'Bron Toevoegen'}}
            />

            <Stack.Screen
                name="Register"
                component={RegistrationScreen}
                options={{title: 'Registreren'}}
            />
            <Stack.Screen
                name="admin_login"
                component={admin_login}
                options={{title: 'admin_login'}}
            />

            <Stack.Screen
                name="Students"
                component={StudentListScreen}
                options={{title: 'Studenten'}}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    title: 'LoginScreen',
                    presentation: 'modal',
                    animationEnabled: true,}}
            />
            <Stack.Screen
                name="BronnenOverzicht"
                component={BronnenOverzicht}
                options={{ title: 'Bronnen' }}
            />
            <Stack.Screen
                name="ProfielBewerken"
                component={ProfielBewerken}
                options={{ title: 'Profiel Bewerken' }}
            />
            <Stack.Screen
                name="AdminProfile"
                component={AdminProfile}
                options={{ title: 'Profiel' }}
            />
            <Stack.Screen
                name="AdminBewerken"
                component={AdminBewerken}
                options={{ title: 'Profiel bewerken' }}
            />
            <Stack.Screen
                name="AdminView"
                component={AdminView}
                options={{ title: 'Admin overzicht' }}
            />
            <Stack.Screen
                name="NewAdmin"
                component={NewAdmin}
                options={{ title: 'Nieuwe admin' }}
            />
            <Stack.Screen
                name="bronWijzigen"
                component={bronWijzigenScreen}
                options={{ title: 'BronWijzigen' }}
            />
            <Stack.Screen
                name="GetStudentProfile"
                component={GetStudentProfile}
                options={{ title: 'Student profiel' }}
            />
            <Stack.Screen
                name="MijnBronnenScreen"
                component={MijnBronnenScreen}
                options={{ title: 'Mijn Bronnen' }}
            />

        </Stack.Navigator>
    );
}
export default StackNavigator;