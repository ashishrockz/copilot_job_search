import { axiosInstances } from "./networkInstance";

export const login = async (body: any) => {
  try {
    const response = await axiosInstances.post("/auth/login", body);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
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

export const signUpUser = async(body:any) =>{
   try {
    const response = await axiosInstances.post("/auth/register", body);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
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