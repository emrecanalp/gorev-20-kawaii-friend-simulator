import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function SettingsScreen() {
  const { userData, signOut, updateFriendState } = useAuth();
  const { notificationsEnabled, toggleNotifications, sendTestNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabından çıkış yapmak istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılamadı');
            }
          },
        },
      ]
    );
  };

  const handleResetFriend = () => {
    Alert.alert(
      'Arkadaşı Sıfırla',
      `${userData?.friendName}'ın durumunu sıfırlamak istediğine emin misin?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await updateFriendState('happy');
              Alert.alert('✨', 'Arkadaşın sıfırlandı ve tekrar mutlu!');
            } catch (error) {
              Alert.alert('Hata', 'Sıfırlama başarısız');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleTestNotification = async () => {
    if (!notificationsEnabled) {
      Alert.alert('Bildirimler Kapalı', 'Önce bildirimleri açman gerekiyor!');
      return;
    }
    
    await sendTestNotification();
    Alert.alert('✨', 'Test bildirimi 2 saniye içinde gelecek!');
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView className="flex-1">
        <View className="px-6 pb-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-pink-400">
              Ayarlar
            </Text>
          </View>

          {/* Profile Section */}
          <View className="bg-white rounded-2xl p-5 mb-6 border border-pink-100">
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 bg-pink-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-bold text-lg">Hesabım</Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                  {userData?.email || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Notifications Section */}
          <Text className="text-gray-600 font-medium mb-3 ml-2">
            Bildirimler
          </Text>
          <View className="bg-white rounded-2xl border border-pink-100 mb-6">
            {/* Notification Toggle */}
            <View className="p-4 flex-row items-center justify-between border-b border-pink-50">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-lg">🔔</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-700 font-medium">Push Bildirimler</Text>
                  <Text className="text-gray-500 text-sm">
                    Arkadaşından haberler al
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#E5E7EB', true: '#FFB6C1' }}
                thumbColor={notificationsEnabled ? '#FF69B4' : '#f4f3f4'}
              />
            </View>

            {/* Test Notification Button */}
            <TouchableOpacity
              className="p-4 flex-row items-center"
              onPress={handleTestNotification}
            >
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🧪</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium">Test Bildirimi Gönder</Text>
                <Text className="text-gray-500 text-sm">
                  Bildirimlerin çalıştığını kontrol et
                </Text>
              </View>
              <Text className="text-gray-400 text-xl">→</Text>
            </TouchableOpacity>
          </View>

          {/* Friend Settings */}
          <Text className="text-gray-600 font-medium mb-3 ml-2">
            Arkadaş Ayarları
          </Text>
          <View className="bg-white rounded-2xl border border-pink-100 mb-6">
            <TouchableOpacity
              className="p-4 flex-row items-center"
              onPress={handleResetFriend}
              disabled={loading}
            >
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🔄</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium">Arkadaşı Sıfırla</Text>
                <Text className="text-gray-500 text-sm">
                  Durumu başa döndür
                </Text>
              </View>
              <Text className="text-gray-400 text-xl">→</Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <Text className="text-gray-600 font-medium mb-3 ml-2">
            Uygulama
          </Text>
          <View className="bg-white rounded-2xl border border-pink-100 mb-6">
            <View className="p-4 flex-row items-center border-b border-pink-50">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">📱</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium">Versiyon</Text>
                <Text className="text-gray-500 text-sm">1.0.0</Text>
              </View>
            </View>

            <View className="p-4 flex-row items-center">
              <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">❤️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 font-medium">Kawaii Friend Simulator</Text>
                <Text className="text-gray-500 text-sm">Made with 💕</Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            className="bg-red-100 rounded-2xl p-4 flex-row items-center justify-center border border-red-200"
            onPress={handleSignOut}
          >
            <Text className="text-red-500 font-bold text-lg">🚪 Çıkış Yap</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center mt-8">
            <Text className="text-gray-400 text-sm">
              🐣 Kawaii Friend Simulator
            </Text>
            <Text className="text-gray-300 text-xs mt-1">
              © 2024 - Tüm hakları saklıdır
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}