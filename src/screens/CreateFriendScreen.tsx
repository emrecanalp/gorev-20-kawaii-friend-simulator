import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function CreateFriendScreen() {
  const [friendName, setFriendName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createFriend } = useAuth();

  const handleCreate = async () => {
    if (!friendName.trim()) {
      Alert.alert('Hata', 'Lütfen arkadaşına bir isim ver');
      return;
    }

    if (friendName.length < 2) {
      Alert.alert('Hata', 'İsim en az 2 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      await createFriend(friendName.trim());
    } catch (error) {
      Alert.alert('Hata', 'Arkadaş oluşturulamadı, tekrar dene');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-pink-50 justify-center px-8">
      {/* Header */}
      <View className="items-center mb-10">
        <Text className="text-8xl mb-4">🥚</Text>
        <Text className="text-3xl font-bold text-pink-400 text-center">
          Yeni Arkadaşını{'\n'}Oluştur!
        </Text>
        <Text className="text-gray-500 mt-4 text-center">
          Yumurtadan çıkacak arkadaşına{'\n'}bir isim ver
        </Text>
      </View>

      {/* Character Preview */}
      <View className="items-center mb-8">
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
          <Text className="text-6xl text-center">🐣</Text>
          {friendName ? (
            <Text className="text-xl font-bold text-pink-400 text-center mt-2">
              {friendName}
            </Text>
          ) : (
            <Text className="text-gray-400 text-center mt-2">
              İsim girilmedi
            </Text>
          )}
        </View>
      </View>

      {/* Input */}
      <View>
        <Text className="text-gray-600 mb-2 ml-2">Arkadaşının İsmi</Text>
        <TextInput
          className="bg-white rounded-2xl px-4 py-4 text-gray-700 border border-pink-200 text-center text-lg"
          placeholder="Örn: Pamuk, Şeker, Tatlı..."
          placeholderTextColor="#9CA3AF"
          value={friendName}
          onChangeText={setFriendName}
          maxLength={15}
        />
        <Text className="text-gray-400 text-right mt-1 mr-2">
          {friendName.length}/15
        </Text>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        className={`mt-6 py-4 rounded-2xl items-center ${
          loading ? 'bg-pink-300' : 'bg-pink-400'
        }`}
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">
            🎉 Arkadaşımı Oluştur!
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}