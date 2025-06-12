import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants/icons";

interface SavedMovieCardProps {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
  onRemove?: () => void;
}

const SavedMovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  onRemove,
}: SavedMovieCardProps) => {
  return (
    <View className="relative flex-1 mb-4">
      <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className="w-full">
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://via.placeholder.com/300x450/404040/404040",
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />

          <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
            {title}
          </Text>

          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date?.split("-")[0]}
            </Text>
            <Text className="text-xs font-medium text-light-300 uppercase">
              Movie
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      
      {/* Saved indicator */}
      <View className="absolute top-2 left-2 bg-green-600 rounded-full p-1">
        <Image source={icons.star} className="w-3 h-3" tintColor="white" />
      </View>
      
      {/* Remove button */}
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="absolute top-2 right-2 bg-red-500 rounded-full p-2 shadow-lg"
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-xs font-bold">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SavedMovieCard; 