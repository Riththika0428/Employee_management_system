import API from "./api";



export const getAdminDashboard =
  async () => {
    const response = await API.get(
      "/dashboard/admin"
    );

    return response.data;
  };



export const getHRDashboard =
  async () => {
    const response = await API.get(
      "/dashboard/hr"
    );

    return response.data;
  };



export const getEmployeeDashboard =
  async () => {
    const response = await API.get(
      "/dashboard/employee"
    );

    return response.data;
  };