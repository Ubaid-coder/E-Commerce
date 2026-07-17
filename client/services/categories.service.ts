import api from './api'

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getCategory = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: {
  name: string;
  description: string;
}) => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
  }
) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};