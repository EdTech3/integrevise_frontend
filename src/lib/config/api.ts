export const API_ROUTES = {
  documents: {
    list: '/documents',
    process: '/document/process',
    upload: '/document/upload',
    edit: '/document/edit',
    instance: '/document/instance',
  },
  subjects: {
    list: '/subjects',
    create: '/subjects',
  },
  assessment: '/assessment',
  questions: '/question',
  key: '/key',
} as const; 