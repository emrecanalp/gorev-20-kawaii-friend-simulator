import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen email ve şifre girin');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      let message = 'Giriş yapılamadı';
      if (error.code === 'auth/user-not-found') {
        message = 'Kullanıcı bulunamadı';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Yanlış şifre';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Geçersiz email adresi';
      }
      Alert.alert('Hata', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-pink-50"
    >
      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-6xl mb-2">🐣</Text>
          <Text className="text-3xl font-bold text-pink-400">
            Kawaii Friend
          </Text>
          <Text className="text-gray-500 mt-2">
            Dijital arkadaşınla tanış!
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-2 ml-2">Email</Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-gray-700 border border-pink-200"
              placeholder="email@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <Text className="text-gray-600 mb-2 ml-2">Şifre</Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-gray-700 border border-pink-200"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-4 rounded-2xl items-center ${
              loading ? 'bg-pink-300' : 'bg-pink-400'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Giriş Yap</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Hesabın yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-pink-400 font-bold">Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}