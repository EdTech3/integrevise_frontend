import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';
import { AssessmentRequest } from '@/types/api';


interface AssessmentResponse {
  success: boolean;
  message: string;
}

export const assessmentApi = {
  assess: async (data: AssessmentRequest): Promise<AssessmentResponse> => {
    const response = await axiosInstance.post(
      API_ROUTES.assessment,
      data
    );

    return response.data;
  }
};
