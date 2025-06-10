import { TouchableOpacity, View, Text, Image } from "react-native";
import { icons } from "@/constants/icons";

interface Props {
  placeholder: string;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
          tintColor="#AB8BFF"
        />
        <Text className="flex-1 ml-3 text-light-300 text-base">
          {placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;
