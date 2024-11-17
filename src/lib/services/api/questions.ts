import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';
import { QuestionAnswer } from '@prisma/client';


interface GetQuestionsParams {
  vivaSessionId: string;
}

export const questionsApi = {
  getQuestions: async ({ vivaSessionId }: GetQuestionsParams): Promise<QuestionAnswer[]> => {
    const response = await axiosInstance.get<QuestionAnswer[]>(
      `${API_ROUTES.questions}?vivaSessionId=${vivaSessionId}`
    );
    return response.data;
  }
}; 