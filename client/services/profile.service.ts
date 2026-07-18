import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (data: {
  name: string;
  email: string;
}) => {
  const response = await api.put("/users/profile", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/profile/change-password", data);
  return response.data;
};