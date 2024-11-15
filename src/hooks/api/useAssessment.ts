import { useMutation } from '@tanstack/react-query';
import { assessmentApi } from '@/lib/services/api';
import { toast } from 'react-toastify';

export function useAssessment() {
  return useMutation({
    mutationFn: assessmentApi.assess,
    onError: () => {
      toast.error('Failed to assess answer');
    },
    onSuccess: () => {
      toast.success('Assessment completed');
    },
  });
}
