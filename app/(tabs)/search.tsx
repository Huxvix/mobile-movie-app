import { View, Text, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const searchInputRef = useRef<TextInput>(null)
  const { autoFocus } = useLocalSearchParams()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Avengers', 'Spider-Man', 'Batman', 'Star Wars', 'Marvel'
  ])

  // Fetch popular movies when no search query
  const { 
    data: popularMovies,
    loading: popularLoading,
    error: popularError 
  } = useFetch(() => fetchMovies({ query: "" }))

  // Search results state
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Auto-focus when coming from home screen
  useFocusEffect(
    React.useCallback(() => {
      if (autoFocus === 'true') {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 300)
      }
    }, [autoFocus])
  )

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery.trim())
      } else {
        setSearchResults([])
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setSearchLoading(true)
    setSearchError(null)
    setIsSearching(true)

    try {
      const results = await fetchMovies({ query })
      setSearchResults(results)
      
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 4)])
      }
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed')
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearching(false)
    setSearchError(null)
  }

  const renderSearchContent = () => {
    if (isSearching && searchQuery.trim().length > 0) {
      if (searchLoading) {
        return (
          <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color="#AB8BFF" />
            <Text className="text-white mt-4">Searching for "{searchQuery}"...</Text>
          </View>
        )
      }

      if (searchError) {
        return (
          <View className="flex-1 justify-center items-center mt-20 px-4">
            <Text className="text-white text-center text-lg mb-4">Search Error</Text>
            <Text className="text-light-300 text-center text-sm mb-4">
              {searchError}
            </Text>
            <TouchableOpacity 
              onPress={() => performSearch(searchQuery)}
              className="bg-accent px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        )
      }

      if (searchResults.length === 0) {
        return (
          <View className="flex-1 justify-center items-center mt-20 px-4">
            <Image source={icons.search} className="w-16 h-16 opacity-50 mb-4" tintColor="#A8B5DB" />
            <Text className="text-white text-center text-lg mb-2">No movies found</Text>
            <Text className="text-light-300 text-center text-sm">
              Try searching with different keywords
            </Text>
          </View>
        )
      }

      return (
        <View className="flex-1 mt-6">
          <Text className="text-white text-lg font-bold mb-4">
            Search Results ({searchResults.length})
          </Text>
          <FlatList 
            data={searchResults}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{ 
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      )
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {(searchHistory.length > 0 || recentSearches.length > 0) && (
          <View className="mt-6">
            <Text className="text-white text-lg font-bold mb-4">
              {searchHistory.length > 0 ? 'Recent Searches' : 'Popular Searches'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-x-3">
                {(searchHistory.length > 0 ? searchHistory : recentSearches).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecentSearchPress(item)}
                    className="bg-dark-200 px-4 py-2 rounded-full border border-accent/30"
                  >
                    <Text className="text-light-200 text-sm">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <View className="mt-8">
          <Text className="text-white text-lg font-bold mb-4">Popular Movies</Text>
          
          {popularLoading ? (
            <View className="justify-center items-center mt-10">
              <ActivityIndicator size="large" color="#AB8BFF" />
              <Text className="text-white mt-4">Loading popular movies...</Text>
            </View>
          ) : popularError ? (
            <View className="justify-center items-center mt-10 px-4">
              <Text className="text-white text-center text-lg mb-4">Unable to load movies</Text>
              <Text className="text-light-300 text-center text-sm">
                Please check your internet connection
              </Text>
            </View>
          ) : (
            <FlatList 
              data={popularMovies?.slice(0, 12)}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{ 
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    )
  }

  return (
    <View className="flex-1 bg-primary">

      <Image source={images.bg} className="absolute w-full z-0" />
      
      <View className="flex-1 px-5">
        <View className="mt-16 mb-6">
          <Text className="text-white text-2xl font-bold">Search Movies</Text>
          <Text className="text-light-300 text-sm mt-1">
            Discover your next favorite movie
          </Text>
        </View>

        <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4 mb-2">
          <Image
            source={icons.search}
            className="w-5 h-5"
            resizeMode="contain"
            tintColor="#AB8BFF"
          />
          <TextInput
            ref={searchInputRef}
            placeholder="Search for movies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-white text-base"
            placeholderTextColor="#A8B5DB"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                performSearch(searchQuery.trim())
              }
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="ml-2">
              <View className="bg-light-300/20 rounded-full p-1">
                <Text className="text-light-300 text-xs font-bold px-2">✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {renderSearchContent()}
      </View>
    </View>
  )
}

export default Search