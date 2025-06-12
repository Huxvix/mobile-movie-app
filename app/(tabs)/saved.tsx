import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { useSavedMovies } from '@/services/useSavedMovies'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import SavedMovieCard from '@/components/SavedMovieCard'

const Saved = () => {
  const { savedMovies, loading, error, removeMovie, clearAllSavedMovies, refreshSavedMovies } = useSavedMovies()

  // Refresh saved movies whenever the tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshSavedMovies()
    }, [refreshSavedMovies])
  )

  const handleRemoveMovie = async (movieId: number, movieTitle: string) => {
    Alert.alert(
      "Remove Movie",
      `Remove "${movieTitle}" from your watchlist?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const success = await removeMovie(movieId)
            if (!success) {
              Alert.alert("Error", "Failed to remove movie. Please try again.")
            }
          }
        }
      ]
    )
  }

  const handleClearAll = () => {
    if (savedMovies.length === 0) return

    Alert.alert(
      "Clear Watchlist",
      "Are you sure you want to remove all movies from your watchlist? This action cannot be undone.",
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
            if (!success) {
              Alert.alert("Error", "Failed to clear watchlist. Please try again.")
            }
          }
        }
      ]
    )
  }

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Image source={icons.save} className="w-20 h-20 opacity-30 mb-6" tintColor="#A8B5DB" />
      <Text className="text-white text-center text-2xl font-bold mb-4">
        Your Watchlist is Empty
      </Text>
      <Text className="text-light-300 text-center text-base leading-6 mb-8">
        Save movies you want to watch later by tapping the "Add to Watchlist" button on any movie detail page.
      </Text>
      <TouchableOpacity 
        onPress={refreshSavedMovies}
        className="bg-accent px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Refresh</Text>
      </TouchableOpacity>
    </View>
  )

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Text className="text-white text-center text-xl font-bold mb-4">
        Unable to Load Watchlist
      </Text>
      <Text className="text-light-300 text-center text-base mb-6">
        {error || "Something went wrong while loading your saved movies."}
      </Text>
      <TouchableOpacity 
        onPress={refreshSavedMovies}
        className="bg-accent px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  )

  const renderMovieItem = ({ item }: { item: any }) => (
    <SavedMovieCard 
      {...item} 
      onRemove={() => handleRemoveMovie(item.id, item.title)}
    />
  )

  const renderHeader = () => (
    <View className="flex-row justify-between items-center mb-6">
      <View>
        <Text className="text-white text-2xl font-bold">My Watchlist</Text>
        <Text className="text-light-300 text-sm mt-1">
          {savedMovies.length} {savedMovies.length === 1 ? 'movie' : 'movies'} saved
        </Text>
      </View>
      {savedMovies.length > 0 && (
        <TouchableOpacity 
          onPress={handleClearAll}
          className="bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/30"
        >
          <Text className="text-red-400 text-sm font-medium">Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      
      <View className="flex-1 px-5">
        <View className="mt-16 mb-6">
          {renderHeader()}
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#AB8BFF" />
            <Text className="text-white mt-4">Loading your watchlist...</Text>
          </View>
        ) : error ? (
          renderErrorState()
        ) : savedMovies.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList 
            data={savedMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshing={loading}
            onRefresh={refreshSavedMovies}
          />
        )}
      </View>
    </View>
  )
}

export default Saved