import API from "./api";



export const loginAPI = async (data: any) => {
  const response = await API.post(
    "/auth/login",
    data
  );

  return response.data;
};


export const registerAPI = async (
  data: any
) => {
  const response = await API.post(
    "/auth/register",
    data
  );

  return response.data;
};