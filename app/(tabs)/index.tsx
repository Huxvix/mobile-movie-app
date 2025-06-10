import { ScrollView, Text, View, Image, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import MovieCard from "@/components/MovieCard";

export default function Index() {

  const router = useRouter();

  const { 
    data: movies,
    loading: moviesLoading,
    error: moviesError } = useFetch(() => fetchMovies({ query:"" })); 

  return (
    <View className="flex-1 bg-primary">

      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>

        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : moviesError ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-white text-center text-lg mb-4">Unable to load movies</Text>
            <Text className="text-light-300 text-center text-sm px-4">
              Please check your internet connection and API configuration
            </Text>
            <Text className="text-red-400 text-center text-xs mt-2 px-4">
              Error: {moviesError}
            </Text>
          </View>
        ) : (
          <View className="flex-1 mt-5">
                      <SearchBar 
              onPress={() => router.push("/(tabs)/search?autoFocus=true")}
              placeholder="Search for a movie"
            />

          <>
            <Text className="text-lg text-white font-bold mt-5 mb-3">Popular Movies</Text>

            <FlatList 
              className="mt-2 pb-32"
              data={movies}
              renderItem={({ item }) => (
                <MovieCard
                  {...item}
                />
              )}
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
          </>

        </View>
        )}

      </ScrollView>

    </View>
  );
}
