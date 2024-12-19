import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="quizcreate" options={{ title: "Create Quiz" }} />
      <Stack.Screen name="quiz/[id]" options={{ title: "Quiz" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}
