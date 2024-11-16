import { axiosInstance } from '@/lib/axios';
import { API_ROUTES } from '@/lib/config/api';
import { Document } from '@prisma/client';



type UploadDocument = {
  title: string;
  description: string;
  category: string;
  file: File | null;
  vivaSessionId: string;
}

type UpdateDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  file: File | null;
  fileName: string;
  filePath: string;
}

export const documentsApi = {
  getAll: async (vivaSessionId: string): Promise<Document[]> => {
    const { data } = await axiosInstance.get<Document[]>(
      `${API_ROUTES.documents.list}?vivaSessionId=${vivaSessionId}`
    );
    return data;
  },

  getDocumentFile: async (documentId: string): Promise<File> => {
    const response = await axiosInstance.get(
      `${API_ROUTES.documents.instance}/?documentId=${documentId}`,
      {
        responseType: 'blob'
      } 
    );
    
    const blob = response.data;
    const fileName = response.headers['x-file-name'];
    const lastModified = parseInt(response.headers['x-last-modified'] || '0');
    const type = response.headers['content-type']
    
    return new File([blob], fileName, {
      type,
      lastModified
    });
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
  },

  process: async (documentId: string): Promise<void> => {
    await axiosInstance.post(API_ROUTES.documents.process, { documentId });
  },

  update: async (data: UpdateDocument): Promise<void> => {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('fileName', data.fileName);
    formData.append('filePath', data.filePath);
    if (data.file) {
        formData.append('file', data.file);
    }

    await axiosInstance.patch(API_ROUTES.documents.edit, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
  }
};
