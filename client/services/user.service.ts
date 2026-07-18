import api from "./api";

/**
 * Get all users
 */
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

/**
 * Get single user
 */
export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  role: "admin" | "customer"
  
) => {
  const response = await api.put(`/users/${id}`, {role});
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};