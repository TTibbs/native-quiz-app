import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { TriviaQuestion } from "../../types/quiz";
import { fetchTriviaQuestions } from "../../utils/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const QuizScreen = () => {
  const { id, amount } = useLocalSearchParams<{ id: string; amount: string }>();
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const categoryId = parseInt(id, 10);
        const questionAmount = parseInt(amount, 10);
        const data = await fetchTriviaQuestions(questionAmount, categoryId);
        setQuestions(data);

        if (data.length > 0) {
          const firstQuestion = data[0];
          setShuffledAnswers(
            shuffleAnswers([
              ...firstQuestion.incorrect_answers,
              firstQuestion.correct_answer,
            ])
          );
        }
      } catch (error) {
        console.error("Error fetching trivia questions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [id, amount]);

  const shuffleAnswers = (answers: string[]): string[] => {
    return answers.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    setSelectedAnswer(selectedAnswer);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    setAnswerStatus(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        const nextQuestion = questions[nextIndex];
        setShuffledAnswers(
          shuffleAnswers([
            ...nextQuestion.incorrect_answers,
            nextQuestion.correct_answer,
          ])
        );
      } else {
        setModalVisible(true);
      }
      setSelectedAnswer(null);
      setAnswerStatus(null);
    }, 1000);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 p-4">
        {/* Modal for Quiz End */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="w-4/5 bg-white p-6 rounded-lg shadow-lg">
              <Text className="text-xl font-bold text-center mb-4">
                Quiz Completed!
              </Text>
              <Text className="text-lg text-center mb-4">
                Your Score: {score} / {questions.length}
              </Text>
              <Pressable className="bg-blue-500 p-4 rounded mb-4">
                <Link
                  href="/quizcreate"
                  className="text-white text-center font-bold"
                >
                  New Quiz
                </Link>
              </Pressable>
              <Pressable className="bg-gray-500 p-4 rounded">
                <Link href="/" className="text-white text-center font-bold">
                  Home
                </Link>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Text className="text-lg font-bold mb-4">
          {currentQuestion.question}
        </Text>
        <View className="grid grid-cols-2 gap-4">
          {shuffledAnswers.map((answer, index) => {
            const isSelected = answer === selectedAnswer;
            const answerClass =
              isSelected && answerStatus === "correct"
                ? "bg-green-500"
                : isSelected && answerStatus === "incorrect"
                ? "bg-red-500"
                : "bg-white";

            return (
              <TouchableOpacity
                key={index}
                className={`p-4 border border-gray-300 rounded ${answerClass}`}
                disabled={selectedAnswer !== null}
                onPress={() => handleAnswerSelect(answer)}
              >
                <Text className="text-center">{answer}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default QuizScreen;
