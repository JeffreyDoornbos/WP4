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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/userContext";


const Header = () => {
    const navigation = useNavigation();
    const { isLoggedIn, logout, user } = useAuth();

    return (
        <View style={styles.header}>

            <View style={styles.headerButtons}>


                {/*login en registrerent verschijnen wanneer student nog niet is ingelogd*/}
                {!isLoggedIn && (<TouchableOpacity style={styles.headerBtn}
                                   onPress={() => navigation.navigate('LoginScreen')}>

                    <Ionicons name="person" size={20} color="#fff"/>
                </TouchableOpacity>)}


                {isLoggedIn && (
                <TouchableOpacity style={styles.headerBtn}
                                   onPress={() => navigation.navigate('StudentProfile')}>

                    <Ionicons name="person" size={20} color="#fff"/>
                </TouchableOpacity>
                )}

            </View>
        </View>
    );
};
export default Header;

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
    headerText: {
      color: '#ffffff',
        marginLeft: 4,
        fontSize: 20,
        fontWeight: 'bold',
    }
});