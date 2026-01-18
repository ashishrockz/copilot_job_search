import {
  ApplicationApiResponse,
  Application,
  ApplicationDetailApiResponse,
  ApplicationDetail,
  CandidateApplicationsApiResponse,
  CandidateApplications,
  CandidateStatsApiResponse,
  CandidateStats,
} from "@/types/application";

export const applicationAdapter = (
  data: ApplicationApiResponse,
): Application => ({
  id: data.id,
  jobId: data.job_id,
  jobTitle: data.job_title,
  company: data.company,
  jobUrl: data.job_url,
  platform: data.platform,
  applicantEmail: data.applicant_email,
  applicantName: data.applicant_name,
  status: data.status,
  appliedAt: new Date(data.applied_at),
  resumePath: data.resume_path,
  screenshotPath: data.screenshot_path,
  errorMessage: data.error_message,
});

export const applicationDetailAdapter = (
  data: ApplicationDetailApiResponse,
): ApplicationDetail => ({
  id: data.id,
  jobId: data.job_id,
  job: {
    id: data.job.id,
    title: data.job.title,
    company: data.job.company,
    url: data.job.url,
    platform: data.job.platform,
    location: data.job.location,
  },
  applicantEmail: data.applicant_email,
  applicantName: data.applicant_name,
  status: data.status,
  appliedAt: new Date(data.applied_at),
  resumePath: data.resume_path,
  screenshotPath: data.screenshot_path,
  errorMessage: data.error_message,
  formData: data.form_data,
});

export const candidateApplicationsAdapter = (
  data: CandidateApplicationsApiResponse,
): CandidateApplications => ({
  applicantEmail: data.applicant_email,
  applications: data.applications.map((app: any) => applicationAdapter(app)),
  total: data.total,
});

export const candidateStatsAdapter = (
  data: CandidateStatsApiResponse,
): CandidateStats => ({
  applicantEmail: data.applicant_email,
  totalApplications: data.total_applications,
  appliedApplications: data.applied_applications,
  failedApplications: data.failed_applications,
  platforms: data.platforms ?? [],
  lastAppliedAt: data.last_applied_at ? new Date(data.last_applied_at) : null,
});
