import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/config/queryKeys';
import { questionsApi } from '@/lib/services/api/questions';

export function useQuestions(vivaSessionId: string) {
  return useQuery({
    queryKey: queryKeys.questions.get(vivaSessionId),
    queryFn: () => questionsApi.getQuestions({ vivaSessionId }),
  });
} 