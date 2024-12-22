import { Link } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
        <View className="items-center mb-6">
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="text-2xl font-bold text-center">
            Welcome to Quizzup
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-lg mb-4">
            Create a quiz using the button below
          </Text>
          <TouchableOpacity>
            <Link
              href="/quiz"
              className="w-36 bg-redSecondary text-zinc-100 text-lg font-bold text-center py-3 rounded-xl"
            >
              Create Quiz
            </Link>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
