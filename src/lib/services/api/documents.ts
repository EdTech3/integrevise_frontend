import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';
import { Document } from '@/types/api';


type UploadDocument = {
  title: string;
  description: string;
  category: string;
  file: File | null;
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
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('vivaSessionId', data.vivaSessionId);
    if (data.file) {
      formData.append('file', data.file);
    }

    await axiosInstance.post(API_ROUTES.documents.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // await new Promise((resolve) => setTimeout(resolve, 3000));
  },

  process: async (documentId: string): Promise<void> => {
    await axiosInstance.post(API_ROUTES.documents.process, { documentId });
  }
};
