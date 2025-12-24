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

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
    } catch (error: any) {
      let message = 'Kayıt olunamadı';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Bu email zaten kullanılıyor';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Geçersiz email adresi';
      } else if (error.code === 'auth/weak-password') {
        message = 'Şifre çok zayıf';
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
          <Text className="text-6xl mb-2">✨</Text>
          <Text className="text-3xl font-bold text-pink-400">
            Kayıt Ol
          </Text>
          <Text className="text-gray-500 mt-2">
            Yeni arkadaşın seni bekliyor!
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

          <View className="mt-4">
            <Text className="text-gray-600 mb-2 ml-2">Şifre Tekrar</Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-gray-700 border border-pink-200"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-4 rounded-2xl items-center ${
              loading ? 'bg-pink-300' : 'bg-pink-400'
            }`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Kayıt Ol</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Zaten hesabın var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-pink-400 font-bold">Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}