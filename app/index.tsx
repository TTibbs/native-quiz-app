import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex flex-col items-center justify-center gap-6 py-4">
        <View>
          <Text className="text-2xl text-center">Welcome to Quizzup</Text>
        </View>
        <View className="border-4 border-red-600 w-24">
          <TouchableOpacity>
            <Link
              href="/profile"
              className="bg-zinc-900 text-zinc-100 text-lg font-bold text-center py-2 px-3"
            >
              Profile
            </Link>
          </TouchableOpacity>
        </View>
        <View className="border-4 border-red-600 w-24">
          <TouchableOpacity>
            <Link
              href="/quizcreate"
              className="bg-zinc-900 text-zinc-100 text-lg font-bold text-center py-2 px-3"
            >
              Create Quiz
            </Link>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
