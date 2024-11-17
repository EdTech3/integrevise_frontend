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

// Add these interfaces alongside existing ones
export interface Question {
  main: string;
  friendlyVersion: string;
  followUp: string[];
  friendlyFollowUp: string[];
  context: string;
  criteria: string;
  encouragement: string;
}

export interface AssessmentRequest {
  vivaSessionId: string;
  question: {
    id: string;
    text: string;
  };
  answer: string;
  timing: {
    displayedAt: string;
    answeredAt: string;
  };
}
