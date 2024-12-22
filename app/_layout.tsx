import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f62020",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="quiz/index" options={{ title: "Create Quiz" }} />
      <Stack.Screen name="quiz/[id]" options={{ title: "Quiz" }} />
    </Stack>
  );
}
