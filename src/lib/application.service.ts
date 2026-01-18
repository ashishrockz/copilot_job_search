import { success } from "zod";
import {
  applicationAdapter,
  applicationDetailAdapter,
  candidateApplicationsAdapter,
  candidateStatsAdapter,
} from "../models/applciation.adapter";
import { axiosInstances } from "./networkInstance";

export const getApplications = async (limit = 100) => {
  try {
    const response = await axiosInstances.get("/applications", {
      params: { limit },
    });

    const data = response.data?.data.map(applicationAdapter);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
};

export const getApplicationById = async (applicationId: number) => {
  try {
    const response = await axiosInstances.get(`/applications/${applicationId}`);

    const data = applicationDetailAdapter(response?.data?.data);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching application details:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
};


export const getApplicationsByCandidateEmail = async (
  email: string,
  limit = 100
) => {
  try {
    const response = await axiosInstances.get(
      '/candidates/applications',
      {
        params: { email, limit },
      }
    );

    const data =  candidateApplicationsAdapter(response?.data?.data);
    return {success:true,data}
  } catch (error: any) {
    console.error('Error fetching candidate applications:', error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
};


export const getCandidateStats = async (
  email: string
) => {
  try {
    const response =  await axiosInstances.get(
      '/candidates/stats',
      {
        params: { email },
      }
    );

    const data =  candidateStatsAdapter(response.data?.data);
    return {success:true, data}
  } catch (error: any) {
    console.error('Error fetching candidate stats:', error);

     return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
}