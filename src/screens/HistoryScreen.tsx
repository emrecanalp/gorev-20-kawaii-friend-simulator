import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function HistoryScreen() {
  const { userData } = useAuth();

  const getTimeWithFriend = () => {
    if (!userData?.createdAt) return '0 gün';
    const created = new Date(userData.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün tanıştık!';
    if (diffDays === 1) return '1 gün';
    return `${diffDays} gün`;
  };

  const getStateEmoji = () => {
    const states = {
      happy: '😊',
      hungry: '🥺',
      tired: '😴',
      bored: '😐',
    };
    return states[userData?.friendState || 'happy'];
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView className="flex-1">
        <View className="px-6 pb-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-pink-400">
              Arkadaşlık Bilgileri
            </Text>
          </View>

          {/* Friend Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 items-center mb-6">
            <Text className="text-6xl mb-3">🐣</Text>
            <Text className="text-xl font-bold text-gray-700">
              {userData?.friendName || 'Arkadaş'}
            </Text>
            <Text className="text-gray-500 mt-1">ile birliktesin</Text>
          </View>

          {/* Stats Cards */}
          <View className="space-y-4">
            {/* Days Together */}
            <View className="bg-white rounded-2xl p-5 border border-pink-100 flex-row items-center">
              <View className="w-14 h-14 bg-pink-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Birlikte Geçen Süre</Text>
                <Text className="text-gray-700 font-bold text-lg">
                  {getTimeWithFriend()}
                </Text>
              </View>
            </View>

            {/* Current State */}
            <View className="bg-white rounded-2xl p-5 border border-pink-100 flex-row items-center mt-4">
              <View className="w-14 h-14 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">{getStateEmoji()}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Şu Anki Durum</Text>
                <Text className="text-gray-700 font-bold text-lg capitalize">
                  {userData?.friendState === 'happy' && 'Mutlu'}
                  {userData?.friendState === 'hungry' && 'Aç'}
                  {userData?.friendState === 'tired' && 'Yorgun'}
                  {userData?.friendState === 'bored' && 'Sıkılmış'}
                </Text>
              </View>
            </View>

            {/* Happiness Score */}
            <View className="bg-white rounded-2xl p-5 border border-pink-100 flex-row items-center mt-4">
              <View className="w-14 h-14 bg-yellow-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">⭐</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Mutluluk Puanı</Text>
                <Text className="text-gray-700 font-bold text-lg">
                  {userData?.happinessScore || 100}/100
                </Text>
              </View>
            </View>

            {/* Email */}
            <View className="bg-white rounded-2xl p-5 border border-pink-100 flex-row items-center mt-4">
              <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">📧</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Hesap</Text>
                <Text className="text-gray-700 font-medium text-sm" numberOfLines={1}>
                  {userData?.email || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Tips Card */}
          <View className="bg-pink-100 rounded-2xl p-5 mt-6 border border-pink-200">
            <Text className="text-gray-700 font-bold mb-2">💡 İpucu</Text>
            <Text className="text-gray-600">
              Arkadaşını mutlu tutmak için düzenli olarak besle, oyna ve dinlendir. 
              Her etkileşim arkadaşlığınızı güçlendirir!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}