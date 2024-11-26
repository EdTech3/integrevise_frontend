export const API_ROUTES = {
  documents: {
    list: '/documents',
    process: '/document/process',
    upload: '/document/upload',
    edit: '/document/edit',
    instance: '/document/instance',
    delete: '/document/delete',
  },
  subjects: {
    list: '/subjects',
    create: '/subjects',
  },
  onboarding:{
    checkDomain: '/universities/check-domain',
    createUniversity: '/universities',
    availableUiniversities: '/universities/available',
    ssoIntegration: '/auth/sso/config',
    appRoles: '/roles/app',
    lmsRoles: '/roles/lms',
    lmsPlatforms: '/lms-platforms',
    testLmsConnection: '/lms-config/test',
    saveLmsConfig: '/lms-config',
  },
  assessment: '/assessment',
  questions: '/question',
  key: '/key',
} as const; 