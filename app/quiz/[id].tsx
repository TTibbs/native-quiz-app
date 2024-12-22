import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Modal, Pressable } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { TriviaQuestion } from "../../types/quiz";
import { fetchTriviaQuestions } from "../../utils/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const decodeHTMLEntities = (text: string): string => {
  const entities: Record<string, string> = {
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&#039;": "'",
    "&rsquo;": "'",
    "&lsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&hellip;": "...",
    "&shy;": "",
    "&mdash;": "—",
    "&ndash;": "–",
    "&nbsp;": " ",
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
};

const QuizScreen = () => {
  const { id, amount, difficulty, type } = useLocalSearchParams<{
    id: string;
    amount: string;
    difficulty: string;
    type: string;
  }>();
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
        const data = await fetchTriviaQuestions(
          questionAmount,
          categoryId,
          difficulty as "easy" | "medium" | "hard",
          type as "multiple" | "boolean"
        );
        const decodedData = data.map((q) => ({
          ...q,
          question: decodeHTMLEntities(q.question),
          correct_answer: decodeHTMLEntities(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHTMLEntities),
        }));
        setQuestions(decodedData);

        if (decodedData.length > 0) {
          const firstQuestion = decodedData[0];
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
  }, [id, amount, difficulty, type]);

  const shuffleAnswers = (answers: string[]): string[] =>
    answers.sort(() => Math.random() - 0.5);

  const handleAnswerSelect = (selectedAnswer: string) => {
    setSelectedAnswer(selectedAnswer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((prev) => prev + 1);
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
      } else setModalVisible(true);
      setSelectedAnswer(null);
      setAnswerStatus(null);
    }, 1000);
  };

  const restartQuiz = () => {
    setModalVisible(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    const firstQuestion = questions[0];
    setShuffledAnswers(
      shuffleAnswers([
        ...firstQuestion.incorrect_answers,
        firstQuestion.correct_answer,
      ])
    );
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
      <SafeAreaView className="flex-1 items-center justify-center p-4">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-modalBg bg-opacity-500">
            <View className="w-4/5 bg-white p-6 rounded-lg shadow-lg">
              <Text className="text-2xl font-bold text-center mb-4">
                Quiz Completed!
              </Text>
              <Text className="text-xl text-center mb-4">
                Your Score: {score} / {questions.length}
              </Text>
              <Pressable
                className="bg-redSecondary w-[50%] mx-auto py-3 rounded-xl mb-4"
                onPress={restartQuiz}
              >
                <Text className="text-xl text-white text-center font-bold">
                  Restart Quiz
                </Text>
              </Pressable>
              <Pressable className="bg-redSecondary w-[50%] mx-auto py-3 rounded-xl mb-4">
                <Link
                  href="/quiz"
                  className="text-xl text-white text-center font-bold"
                >
                  New Quiz
                </Link>
              </Pressable>
              <Pressable className="bg-redPrimary w-[50%] mx-auto py-3 rounded-xl">
                <Link
                  href="/"
                  className="text-xl text-white text-center font-bold"
                >
                  Home
                </Link>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Text className="text-xl text-center font-bold mb-4">
          {currentQuestion.question}
        </Text>
        <View className="w-full px-4">
          <View className="flex-row flex-wrap justify-between">
            {shuffledAnswers.map((answer, index) => {
              const isSelected = answer === selectedAnswer;
              const answerClass =
                isSelected && answerStatus === "correct"
                  ? "bg-green-500"
                  : isSelected && answerStatus === "incorrect"
                    ? "bg-red-500"
                    : "bg-white";

              return (
                <Pressable
                  key={index}
                  className={`p-4 border border-gray-300 rounded-xl ${answerClass} mb-4 w-[48%] justify-center items-center`}
                  disabled={selectedAnswer !== null}
                  onPress={() => handleAnswerSelect(answer)}
                >
                  <Text className="text-center flex-shrink-1 flex-wrap">
                    {answer}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default QuizScreen;
