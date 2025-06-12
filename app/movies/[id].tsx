import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchMovieDetails } from '@/services/api'
import useFetch from '@/services/useFetch'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { useSavedMovies } from '@/services/useSavedMovies'

const { width } = Dimensions.get('window')

const MovieDetails = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { saveMovie, removeMovie, isMovieSaved } = useSavedMovies()
  const [isSaving, setIsSaving] = useState(false)

  const { 
    data: movie,
    loading: movieLoading,
    error: movieError 
  } = useFetch(() => fetchMovieDetails(id as string))

  const movieIsSaved = movie ? isMovieSaved(movie.id) : false

  if (movieLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
        <Text className="text-white mt-4">Loading movie details...</Text>
      </View>
    )
  }

  if (movieError) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-4">
        <Text className="text-white text-center text-lg mb-4">Unable to load movie details</Text>
        <Text className="text-light-300 text-center text-sm mb-4">
          Please check your internet connection and try again
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-accent px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!movie) return null

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  const getDirector = () => {
    if (movie.credits?.crew) {
      const director = movie.credits.crew.find((person: any) => person.job === 'Director')
      return director?.name || 'Unknown'
    }
    return 'Unknown'
  }

  const mainCast = movie.credits?.cast?.slice(0, 6) || []

  const handleWatchlistAction = async () => {
    if (!movie) return

    setIsSaving(true)
    try {
      if (movieIsSaved) {
        // Remove from watchlist
        const success = await removeMovie(movie.id)
        if (success) {
          Alert.alert("Removed", `"${movie.title}" has been removed from your watchlist.`)
        } else {
          Alert.alert("Error", "Failed to remove movie from watchlist.")
        }
      } else {
        // Add to watchlist
        const movieData = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        }
        const success = await saveMovie(movieData)
        if (success) {
          Alert.alert("Added", `"${movie.title}" has been added to your watchlist!`)
        } else {
          Alert.alert("Error", "Failed to add movie to watchlist.")
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header with Back Button */}
        <View className="absolute top-12 left-5 z-10">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-black/30 p-3 rounded-full"
          >
            <Image source={icons.arrow} className="w-6 h-6" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Movie Poster and Backdrop */}
        <View className="relative h-64">
          {movie.backdrop_path && (
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` }}
              className="w-full h-full opacity-50"
              resizeMode="cover"
            />
          )}
          <View className="absolute inset-0 bg-black/60" />
        </View>

        {/* Movie Information */}
        <View className="px-5 -mt-16 relative z-10">
          <View className="flex-row">
            {/* Movie Poster */}
            {movie.poster_path ? (
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                className="w-32 h-48 rounded-lg shadow-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="w-32 h-48 rounded-lg shadow-lg bg-dark-200/50 border border-accent/20 items-center justify-center">
                <Image source={icons.logo} className="w-8 h-6 opacity-30" tintColor="#AB8BFF" />
                <Text className="text-light-300 text-xs mt-2 text-center">No Image</Text>
              </View>
            )}
            
            {/* Movie Details */}
            <View className="flex-1 ml-4 justify-end pb-4">
              <Text className="text-white text-2xl font-bold mb-2" numberOfLines={3}>
                {movie.title || 'Unknown Title'}
              </Text>
              
              <View className="flex-row items-center mb-2">
                <Image source={icons.star} className="w-4 h-4 mr-1" />
                <Text className="text-accent text-lg font-bold mr-4">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </Text>
                <Text className="text-light-300 text-sm">
                  ({movie.vote_count || 0} reviews)
                </Text>
              </View>

              <View className="flex-row items-center flex-wrap">
                <Text className="text-light-300 text-sm mr-3">
                  {movie.release_date ? formatDate(movie.release_date) : 'Unknown'}
                </Text>
                {movie.runtime && (
                  <Text className="text-light-300 text-sm mr-3">
                    {formatRuntime(movie.runtime)}
                  </Text>
                )}
                <Text className="text-light-300 text-sm">
                  {movie.genres?.[0]?.name || 'Unknown Genre'}
                </Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleWatchlistAction}
            disabled={isSaving}
            className={`py-4 px-6 rounded-lg mt-6 flex-row items-center justify-center ${
              movieIsSaved ? 'bg-green-600' : 'bg-accent'
            } ${isSaving ? 'opacity-50' : ''}`}
          >
            <Image 
              source={movieIsSaved ? icons.star : icons.save} 
              className="w-5 h-5 mr-2" 
              tintColor="white" 
            />
            <Text className="text-white font-semibold text-lg">
              {isSaving 
                ? (movieIsSaved ? 'Removing...' : 'Adding...') 
                : (movieIsSaved ? 'In Watchlist' : 'Add to Watchlist')
              }
            </Text>
          </TouchableOpacity>

          {/* Overview */}
          {movie.overview && (
            <View className="mt-8">
              <Text className="text-white text-xl font-bold mb-3">Overview</Text>
              <Text className="text-light-200 text-base leading-6">
                {movie.overview}
              </Text>
            </View>
          )}

          {/* Movie Details Grid */}
          <View className="mt-8">
            <Text className="text-white text-xl font-bold mb-4">Details</Text>
            <View className="gap-y-3">
              <View className="flex-row justify-between">
                <Text className="text-light-300 text-base">Director</Text>
                <Text className="text-white text-base font-medium">{getDirector()}</Text>
              </View>
              
              {movie.genres && movie.genres.length > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-light-300 text-base">Genres</Text>
                  <Text className="text-white text-base font-medium flex-1 text-right">
                    {movie.genres.map((g: any) => g.name).join(', ')}
                  </Text>
                </View>
              )}
              
              {movie.production_countries && movie.production_countries.length > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-light-300 text-base">Country</Text>
                  <Text className="text-white text-base font-medium">
                    {movie.production_countries[0].name}
                  </Text>
                </View>
              )}
              
              {movie.budget > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-light-300 text-base">Budget</Text>
                  <Text className="text-white text-base font-medium">
                    ${movie.budget.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Cast */}
          {mainCast.length > 0 && (
            <View className="mt-8">
              <Text className="text-white text-xl font-bold mb-4">Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-x-4">
                  {mainCast.map((actor: any) => (
                    <View key={actor.id} className="items-center w-24">
                      {actor.profile_path ? (
                        <Image 
                          source={{ uri: `https://image.tmdb.org/t/p/w185${actor.profile_path}` }}
                          className="w-20 h-20 rounded-full mb-2"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-20 h-20 rounded-full mb-2 bg-dark-200/50 border border-accent/20 items-center justify-center">
                          <Image source={icons.person} className="w-8 h-8 opacity-50" tintColor="#AB8BFF" />
                        </View>
                      )}
                      <Text className="text-white text-xs font-medium text-center" numberOfLines={2}>
                        {actor.name || 'Unknown Actor'}
                      </Text>
                      <Text className="text-light-300 text-xs text-center mt-1" numberOfLines={2}>
                        {actor.character || 'Unknown Role'}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default MovieDetails