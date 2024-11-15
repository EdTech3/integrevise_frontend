import { DocumentCategory } from '@prisma/client';

// Base API response type
export interface APIResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

// Document types
export interface Document {
  title: string;
  description: string;
  category: DocumentCategory;
  updatedAt: Date;
}

// Viva Session types
export interface VivaSession {
  id: string;
  userId: string;
  subjectId: string;
  startTime: Date;
  status: string;
  facialRecognitionStatus: boolean;
}
