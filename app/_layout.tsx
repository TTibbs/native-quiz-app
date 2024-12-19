import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
