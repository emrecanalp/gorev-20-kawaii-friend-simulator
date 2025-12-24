import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import Navigation from './src/components/Navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <Navigation />
          <StatusBar style="dark" />
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}