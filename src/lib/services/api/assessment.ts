import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';

interface AssessmentRequest {
  vivaSessionId: string;
  question: string;
  answer: string;
}

interface Assessment {
  overallEvaluation: string;
  assessments: Array<{
    criteriaId: string;
    score: number;
    evidence: string;
    feedback: string;
  }>;
  suggestedFollowUp: string[];
}

export const assessmentApi = {
  assess: async (data: AssessmentRequest): Promise<Assessment> => {
    const response = await axiosInstance.post(
      API_ROUTES.assessment,
      data
    );

    return response.data;
  }
};
