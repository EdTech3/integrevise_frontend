export const API_ROUTES = {
  documents: {
    list: '/documents',
    process: '/document',
    upload: '/document/upload',
  },
  subjects: {
    list: '/subjects',
    create: '/subjects',
  },
  assessment: '/assessment',
  questions: '/question',
  key: '/key',
} as const; 