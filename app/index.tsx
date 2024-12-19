import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="w-1/2 mx-auto">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/profile" className="bg-zinc-900 text-zinc-100 py-2 px-3">
        Profile
      </Link>
    </View>
  );
}
