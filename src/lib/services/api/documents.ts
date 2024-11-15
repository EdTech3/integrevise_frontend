import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';
import { Document } from '@/types/api';


type UploadDocument = {
  title: string;
  description: string;
  category: string;
  file: File | nul;
  vivaSessionId: string;
}

export const documentsApi = {
  getAll: async (vivaSessionId: string): Promise<Document[]> => {
    const { data } = await axiosInstance.get<Document[]>(
      `${API_ROUTES.documents.list}?vivaSessionId=${vivaSessionId}`
    );

    return data;
  },

  upload: async (data: UploadDocument): Promise<void> => {
    await axiosInstance.post(API_ROUTES.documents.upload, data);
  },

  process: async (documentId: string): Promise<void> => {
    await axiosInstance.post(API_ROUTES.documents.process, { documentId });
  }
};
