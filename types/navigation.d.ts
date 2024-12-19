import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  QuizCreate: undefined;
  Quiz: {
    id: number;
    amount: number;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
