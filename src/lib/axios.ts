import axios, { AxiosError } from 'axios';
import { errorToast } from './toast';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = error.response?.data?.error || 'An unexpected error occurred';
    const status = error.response?.status;

    // Show toast for user feedback
    errorToast(message);

    // Throw custom error
    throw new APIError(message, status);
  }
);
