export const queryKeys = {
  documents: {
    all: ['documents'] as const,
    list: (vivaSessionId: string) => [...queryKeys.documents.all, vivaSessionId] as const,
    detail: (id: string) => [...queryKeys.documents.all, id] as const,
    instance: (id: string) => [...queryKeys.documents.all, id] as const,
  },
  assessment: {
    all: ['assessment'] as const,
    bySession: (vivaSessionId: string) => [...queryKeys.assessment.all, vivaSessionId] as const,
  },
  subjects: {
    all: ['subjects'] as const,
    detail: (id: string) => [...queryKeys.subjects.all, id] as const,
  },
  questions: {
    all: ['questions'] as const,
    get: (vivaSessionId: string) => [...queryKeys.questions.all, vivaSessionId] as const,
  },
} as const;
