import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  QuizCreate: undefined;
  Quiz: {
    id: number;
    amount: number;
    difficulty: "easy" | "medium" | "hard";
    type: "multiple" | "boolean";
  };
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
