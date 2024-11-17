import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';
import { QuestionsResponse } from '@/types/api';

interface GetQuestionsParams {
  vivaSessionId: string;
}

export const questionsApi = {
  getQuestions: async ({ vivaSessionId }: GetQuestionsParams): Promise<QuestionsResponse> => {
    const response = await axiosInstance.get<QuestionsResponse>(
      `${API_ROUTES.questions}?vivaSessionId=${vivaSessionId}`
    );
    return response.data;
  }
}; 