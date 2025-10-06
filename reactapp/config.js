import { Platform } from 'react-native';

export const BASE_URL = Platform.select({
  ios: 'http://192.168.1.85:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});