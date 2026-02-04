import {
  CopilotAdapter,
  CopilotStatusAdapter,
  MatchedJobAdapter,
  CopilotApplicationAdapter,
  TriggerCopilotResultAdapter,
  CancelCopilotResultAdapter,
} from "@/models/copilot.adapter";
import {
  CopilotsResponse,
  CopilotResponse,
  CopilotStatusResponse,
  MatchedJobsResponse,
  CopilotApplicationsResponse,
  TriggerCopilotResponse,
  CancelCopilotResponse,
  DeleteCopilotResponse,
  UpdateCopilotRequest,
} from "@/types/copilot";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkInstance";

/**
 * Adapter instances (reuse – best practice)
 */
const copilotAdapter = new CopilotAdapter();
const copilotStatusAdapter = new CopilotStatusAdapter();
const matchedJobAdapter = new MatchedJobAdapter();
const copilotApplicationAdapter = new CopilotApplicationAdapter();
const triggerCopilotResultAdapter = new TriggerCopilotResultAdapter();
const cancelCopilotResultAdapter = new CancelCopilotResultAdapter();

/**
 * Get all copilots for the authenticated user
 */
export const getCopilots = async (): Promise<CopilotsResponse> => {
  try {
    const url = apiUrlPaths.copilot.list();
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data)
      ? response.data.map((item: any) => copilotAdapter.adapt(item))
      : Array.isArray(response?.data?.copilots)
        ? response.data.copilots.map((item: any) => copilotAdapter.adapt(item))
        : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilots:", error);

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

/**
 * Get a specific copilot by ID
 */
export const getCopilotById = async (
  copilotId: number
): Promise<CopilotResponse> => {
  try {
    const url = apiUrlPaths.copilot.getById(copilotId);
    const response = await axiosInstances.get(url);

    const data = copilotAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilot:", error);

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

/**
 * Update a specific copilot (partial updates supported)
 */
export const updateCopilot = async (
  copilotId: number,
  data: UpdateCopilotRequest
): Promise<CopilotResponse> => {
  try {
    const url = apiUrlPaths.copilot.update(copilotId);
    const response = await axiosInstances.put(url, data);

    const adaptedData = copilotAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data: adaptedData };
  } catch (error: any) {
    console.error("Error updating copilot:", error);

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

/**
 * Delete a copilot
 */
export const deleteCopilot = async (
  copilotId: number
): Promise<DeleteCopilotResponse> => {
  try {
    const url = apiUrlPaths.copilot.delete(copilotId);
    await axiosInstances.delete(url);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting copilot:", error);

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

/**
 * Manually trigger a copilot to run immediately
 */
export const triggerCopilot = async (
  copilotId: number
): Promise<TriggerCopilotResponse> => {
  try {
    const url = apiUrlPaths.copilot.trigger(copilotId);
    const response = await axiosInstances.post(url);

    const data = triggerCopilotResultAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error triggering copilot:", error);

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

/**
 * Get copilot status, statistics, and run details
 */
export const getCopilotStatus = async (
  copilotId: number
): Promise<CopilotStatusResponse> => {
  try {
    const url = apiUrlPaths.copilot.status(copilotId);
    const response = await axiosInstances.get(url);

    const data = copilotStatusAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilot status:", error);

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

/**
 * Get jobs matched by the copilot for manual review
 */
export const getCopilotMatchedJobs = async (
  copilotId: number
): Promise<MatchedJobsResponse> => {
  try {
    const url = apiUrlPaths.copilot.matchedJobs(copilotId);
    const response = await axiosInstances.get(url);

    const rawData = response?.data?.jobs || response?.data?.data || response?.data;
    const data = Array.isArray(rawData)
      ? rawData.map((item: any) => matchedJobAdapter.adapt(item))
      : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching matched jobs:", error);

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

/**
 * Get all applications submitted by a specific copilot
 */
export const getCopilotApplications = async (
  copilotId: number
): Promise<CopilotApplicationsResponse> => {
  try {
    const url = apiUrlPaths.copilot.applications(copilotId);
    const response = await axiosInstances.get(url);

    const rawData =
      response?.data?.applications || response?.data?.data || response?.data;
    const data = Array.isArray(rawData)
      ? rawData.map((item: any) => copilotApplicationAdapter.adapt(item))
      : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilot applications:", error);

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

/**
 * Cancel a running copilot task
 */
export const cancelCopilot = async (
  copilotId: number
): Promise<CancelCopilotResponse> => {
  try {
    const url = apiUrlPaths.copilot.cancel(copilotId);
    const response = await axiosInstances.delete(url);

    const data = cancelCopilotResultAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error cancelling copilot:", error);

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
