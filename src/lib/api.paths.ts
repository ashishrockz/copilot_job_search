import { email } from "zod";

export const apiUrlPaths = {
  onboarding: {
    profile: (email: string) => `/onboarding/profile/${email}`,
    list:(email: string) => `/onboarding/profile/${email}/resumes`,
  },
  scraping: {
    tasks: {
      active: (): string => `/scraping/tasks/active`,
    },
  },
};
