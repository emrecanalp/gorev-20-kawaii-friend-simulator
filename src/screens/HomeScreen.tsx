import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { FriendState } from '../types';

// Friend state configurations
const stateConfig: Record<FriendState, {
  emoji: string;
  message: string;
  color: string;
  bgColor: string;
}> = {
  happy: {
    emoji: '😊',
    message: 'Çok mutluyum!',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  hungry: {
    emoji: '🥺',
    message: 'Acıktım...',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  tired: {
    emoji: '😴',
    message: 'Çok yorgunum...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  bored: {
    emoji: '😐',
    message: 'Sıkıldım...',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
};

// State transition logic
const getNewState = (currentState: FriendState, action: 'feed' | 'play' | 'rest'): FriendState => {
  const transitions: Record<string, FriendState> = {
    'hungry-feed': 'happy',
    'tired-feed': 'tired',
    'happy-feed': 'happy',
    'bored-feed': 'bored',
    
    'hungry-play': 'hungry',
    'tired-play': 'tired',
    'happy-play': 'happy',
    'bored-play': 'happy',
    
    'hungry-rest': 'hungry',
    'tired-rest': 'happy',
    'happy-rest': 'happy',
    'bored-rest': 'bored',
  };

  return transitions[`${currentState}-${action}`] || 'happy';
};

export default function HomeScreen() {
  const { userData, updateFriendState } = useAuth();
  const { scheduleFriendReminder, notificationsEnabled } = useNotifications();

  const currentState = userData?.friendState || 'happy';
  const config = stateConfig[currentState];

  useEffect(() => {
    if (notificationsEnabled && userData) {
      scheduleFriendReminder(`${userData.friendName} seni özledi! 🥺`, 60);
    }
  }, [userData?.friendState]);

  const handleInteraction = async (action: 'feed' | 'play' | 'rest') => {
    if (!userData) return;

    const newState = getNewState(currentState, action);
    
    const messages: Record<string, string> = {
      feed: newState === currentState && currentState !== 'hungry'
        ? `${userData.friendName} tok ama yine de yedi! 🍎`
        : `${userData.friendName} beslendin! Afiyetler! 🍎`,
      play: currentState === 'hungry'
        ? `${userData.friendName} aç olduğu için oynayamıyor 😢`
        : currentState === 'tired'
        ? `${userData.friendName} çok yorgun, dinlenmeli 😴`
        : `${userData.friendName} ile oynadın! Çok eğlendik! 🎮`,
      rest: newState === 'happy' && currentState === 'tired'
        ? `${userData.friendName} güzelce dinlendi! 💤`
        : `${userData.friendName} biraz dinlendi 💤`,
    };

    try {
      await updateFriendState(newState);
      Alert.alert('✨', messages[action]);
    } catch (error) {
      Alert.alert('Hata', 'Bir şeyler yanlış gitti');
    }
  };

  const getLastInteractionText = () => {
    if (!userData?.lastInteraction) return '';
    const date = new Date(userData.lastInteraction);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Az önce';
    if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} saat önce`;
    return `${Math.floor(diffMinutes / 1440)} gün önce`;
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pb-6">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-pink-400">
              Arkadaşım
            </Text>
          </View>

          {/* Character Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 items-center mb-6">
            <View className="mb-4">
              <Text className="text-8xl">🐣</Text>
            </View>

            <Text className="text-2xl font-bold text-gray-700 mb-2">
              {userData?.friendName || 'Arkadaş'}
            </Text>

            <View className={`${config.bgColor} px-4 py-2 rounded-full flex-row items-center`}>
              <Text className="text-xl mr-2">{config.emoji}</Text>
              <Text className={`${config.color} font-medium`}>
                {config.message}
              </Text>
            </View>

            <Text className="text-gray-400 text-sm mt-4">
              Son etkileşim: {getLastInteractionText()}
            </Text>
          </View>

          {/* State Info Card */}
          <View className="bg-white rounded-2xl p-4 mb-6 border border-pink-100">
            <Text className="text-gray-600 text-center">
              {currentState === 'hungry' && '🍎 Besle butonuna bas!'}
              {currentState === 'tired' && '💤 Dinlendir butonuna bas!'}
              {currentState === 'bored' && '🎮 Oyna butonuna bas!'}
              {currentState === 'happy' && '💕 Harika! Her şey yolunda!'}
            </Text>
          </View>

          {/* Interaction Buttons */}
          <Text className="text-gray-600 font-medium mb-3 ml-2">
            Etkileşimler
          </Text>
          
          <View className="space-y-3">
            {/* Feed Button */}
            <TouchableOpacity
              className="bg-orange-100 rounded-2xl p-4 flex-row items-center border border-orange-200"
              onPress={() => handleInteraction('feed')}
            >
              <View className="w-12 h-12 bg-orange-200 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">🍎</Text>
              </View>
              <View className="flex-1">
                <Text className="text-orange-700 font-bold text-lg">Besle</Text>
                <Text className="text-orange-600 text-sm">Arkadaşını doyur</Text>
              </View>
              <Text className="text-orange-400 text-2xl">→</Text>
            </TouchableOpacity>

            {/* Play Button */}
            <TouchableOpacity
              className="bg-purple-100 rounded-2xl p-4 flex-row items-center border border-purple-200 mt-3"
              onPress={() => handleInteraction('play')}
            >
              <View className="w-12 h-12 bg-purple-200 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">🎮</Text>
              </View>
              <View className="flex-1">
                <Text className="text-purple-700 font-bold text-lg">Oyna</Text>
                <Text className="text-purple-600 text-sm">Birlikte eğlen</Text>
              </View>
              <Text className="text-purple-400 text-2xl">→</Text>
            </TouchableOpacity>

            {/* Rest Button */}
            <TouchableOpacity
              className="bg-blue-100 rounded-2xl p-4 flex-row items-center border border-blue-200 mt-3"
              onPress={() => handleInteraction('rest')}
            >
              <View className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">💤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-blue-700 font-bold text-lg">Dinlendir</Text>
                <Text className="text-blue-600 text-sm">Biraz uyusun</Text>
              </View>
              <Text className="text-blue-400 text-2xl">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}