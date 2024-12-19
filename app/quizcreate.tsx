import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { fetchTriviaCategories } from "../utils/api";
import { TriviaCategory } from "../types/quiz";

const QuizCreate = () => {
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>("10");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [selectedType, setSelectedType] = useState<"multiple" | "boolean">(
    "multiple"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchTriviaCategories();
        setCategories(data);
        setSelectedCategory(data[0]?.id || null);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleStartQuiz = () => {
    if (selectedCategory === null || !selectedAmount) {
      console.error("Category and amount must be selected.");
      return;
    }

    const amount = parseInt(selectedAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      console.error("Amount must be a positive number.");
      return;
    }

    router.push({
      pathname: `/quiz/[id]`,
      params: {
        id: selectedCategory.toString(),
        amount: amount.toString(),
        difficulty: selectedDifficulty,
        type: selectedType,
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-4">Select Category:</Text>
      <View className="border border-gray-300 rounded mb-4">
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
      </View>
      <Text className="text-lg font-bold mb-4">Enter Number of Questions:</Text>
      <TextInput
        className="border border-gray-300 rounded px-3 mb-4"
        value={selectedAmount}
        onChangeText={setSelectedAmount}
        keyboardType="numeric"
        placeholder="Enter amount (e.g., 10)"
      />
      <Text className="text-lg font-bold mb-4">Select Difficulty:</Text>
      <View className="border border-gray-300 rounded mb-4">
        <Picker
          selectedValue={selectedDifficulty}
          onValueChange={(value) => setSelectedDifficulty(value)}
        >
          <Picker.Item label="Easy" value="easy" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="Hard" value="hard" />
        </Picker>
      </View>
      <Text className="text-lg font-bold mb-4">Select Question Type:</Text>
      <View className="border border-gray-300 rounded mb-4">
        <Picker
          selectedValue={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <Picker.Item label="Multiple Choice" value="multiple" />
          <Picker.Item label="True / False" value="boolean" />
        </Picker>
      </View>
      <Button title="Start Quiz" onPress={handleStartQuiz} />
    </View>
  );
};

export default QuizCreate;
