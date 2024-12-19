import axios from "axios";
import {
  TriviaApiResponse,
  TriviaCategory,
  TriviaQuestion,
} from "../types/quiz";

const apiClient = axios.create({
  baseURL: "https://opentdb.com",
  timeout: 10000,
});

export const fetchTriviaQuestions = async (
  amount: number,
  category: number
): Promise<TriviaQuestion[]> => {
  try {
    const response = await apiClient.get<TriviaApiResponse<TriviaQuestion>>(
      "/api.php",
      {
        params: {
          amount,
          category,
          type: "multiple",
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    throw error;
  }
};

export const fetchTriviaCategories = async (): Promise<TriviaCategory[]> => {
  try {
    const response = await apiClient.get<{
      trivia_categories: TriviaCategory[];
    }>("/api_category.php");
    return response.data.trivia_categories;
  } catch (error) {
    console.error("Error fetching trivia categories:", error);
    throw error;
  }
};
