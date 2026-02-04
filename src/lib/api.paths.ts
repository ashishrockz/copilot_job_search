export const apiUrlPaths = {
  onboarding: {
    profile: (email: string) => `/onboarding/profile/${email}`,
    list: (email: string) => `/onboarding/profile/${email}/resumes`,
  },
  scraping: {
    tasks: {
      active: (): string => `/scraping/tasks/active`,
    },
  },
  copilot: {
    list: (): string => `/copilots`,
    getById: (copilotId: number): string => `/copilot/${copilotId}`,
    update: (copilotId: number): string => `/copilot/${copilotId}`,
    delete: (copilotId: number): string => `/copilot/${copilotId}`,
    trigger: (copilotId: number): string => `/copilot/${copilotId}/trigger`,
    status: (copilotId: number): string => `/copilot/${copilotId}/status`,
    matchedJobs: (copilotId: number): string => `/copilot/${copilotId}/matched-jobs`,
    applications: (copilotId: number): string => `/copilot/${copilotId}/applications`,
    cancel: (copilotId: number): string => `/copilot/${copilotId}/cancel`,
  },
};
