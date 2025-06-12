import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Linking } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useSavedMovies } from '@/services/useSavedMovies'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'

const Profile = () => {
  const router = useRouter()
  const { savedMovies, clearAllSavedMovies } = useSavedMovies()

  const handleClearWatchlist = () => {
    if (savedMovies.length === 0) {
      Alert.alert("Empty Watchlist", "Your watchlist is already empty.")
      return
    }

    Alert.alert(
      "Clear Watchlist",
      `Are you sure you want to remove all ${savedMovies.length} movies from your watchlist? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const success = await clearAllSavedMovies()
            if (success) {
              Alert.alert("Success", "Your watchlist has been cleared.")
            } else {
              Alert.alert("Error", "Failed to clear watchlist. Please try again.")
            }
          }
        }
      ]
    )
  }

  const handleAbout = () => {
    Alert.alert(
      "About MovieApp",
      "A beautiful movie discovery app built with React Native and Expo.\n\nVersion 1.0.0\n\nPowered by The Movie Database (TMDB)",
      [{ text: "OK" }]
    )
  }

  const handleFeedback = () => {
    Alert.alert(
      "Send Feedback",
      "We'd love to hear from you! How can we improve your movie discovery experience?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Email Us", 
          onPress: () => {
            Linking.openURL('mailto:feedback@movieapp.com?subject=MovieApp Feedback')
              .catch(() => Alert.alert("Error", "Unable to open email app"))
          }
        }
      ]
    )
  }

  const handleRateApp = () => {
    Alert.alert(
      "Rate MovieApp",
      "Enjoying MovieApp? Please take a moment to rate us on the App Store!",
      [
        { text: "Later", style: "cancel" },
        { 
          text: "Rate Now", 
          onPress: () => {
            // In a real app, this would open the app store
            Alert.alert("Thank You!", "This would open the App Store in a real app.")
          }
        }
      ]
    )
  }

  const handleNavigateToSaved = () => {
    router.push('/(tabs)/saved')
  }

  const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View className="mb-6">
      <Text className="text-white text-lg font-bold mb-3">{title}</Text>
      <View className="bg-dark-200/50 rounded-lg border border-accent/20">
        {children}
      </View>
    </View>
  )

  const ProfileItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    destructive = false 
  }: { 
    icon: any, 
    title: string, 
    subtitle?: string, 
    onPress?: () => void,
    showArrow?: boolean,
    destructive?: boolean
  }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center p-4 border-b border-accent/10 last:border-b-0"
      disabled={!onPress}
    >
      <View className="w-10 h-10 bg-accent/20 rounded-full items-center justify-center mr-4">
        <Image source={icon} className="w-5 h-5" tintColor={destructive ? "#EF4444" : "#AB8BFF"} />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold ${destructive ? 'text-red-400' : 'text-white'}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-light-300 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      {showArrow && onPress && (
        <Image source={icons.arrow} className="w-4 h-4" tintColor="#A8B5DB" />
      )}
    </TouchableOpacity>
  )

  const getWatchlistStats = () => {
    if (savedMovies.length === 0) return "No movies saved yet"
    
    const totalMovies = savedMovies.length
    const avgRating = savedMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / totalMovies
    
    return `${totalMovies} ${totalMovies === 1 ? 'movie' : 'movies'} • Avg rating ${avgRating.toFixed(1)}/10`
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      
      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="mt-16 mb-8 items-center">
          <View className="w-24 h-24 bg-accent/20 rounded-full items-center justify-center mb-4 border-2 border-accent/30">
            <Image source={icons.person} className="w-12 h-12" tintColor="#AB8BFF" />
          </View>
          <Text className="text-white text-2xl font-bold">Movie Lover</Text>
          <Text className="text-light-300 text-sm mt-1">Discover • Save • Enjoy</Text>
        </View>

        {/* Watchlist Stats */}
        <ProfileSection title="My Watchlist">
          <ProfileItem
            icon={icons.save}
            title="Saved Movies"
            subtitle={getWatchlistStats()}
            onPress={handleNavigateToSaved}
            showArrow={true}
          />
          <ProfileItem
            icon={icons.star}
            title="Favorites"
            subtitle="Coming soon - Mark your favorite movies"
            showArrow={false}
          />
        </ProfileSection>

        {/* App Settings */}
        <ProfileSection title="Settings">
          <ProfileItem
            icon={icons.save}
            title="Clear Watchlist"
            subtitle="Remove all saved movies"
            onPress={handleClearWatchlist}
            destructive={true}
          />
        </ProfileSection>

        {/* App Info */}
        <ProfileSection title="About">
          <ProfileItem
            icon={icons.star}
            title="Rate MovieApp"
            subtitle="Help us improve with your feedback"
            onPress={handleRateApp}
          />
          <ProfileItem
            icon={icons.search}
            title="Send Feedback"
            subtitle="Share your thoughts and suggestions"
            onPress={handleFeedback}
          />
          <ProfileItem
            icon={icons.logo}
            title="About MovieApp"
            subtitle="Version 1.0.0"
            onPress={handleAbout}
          />
        </ProfileSection>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Image source={icons.logo} className="w-8 h-6 mb-2 opacity-50" />
          <Text className="text-light-300 text-xs text-center">
            Made with ❤️ for movie enthusiasts
          </Text>
          <Text className="text-light-300 text-xs text-center mt-1">
            Powered by The Movie Database (TMDB)
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default Profile