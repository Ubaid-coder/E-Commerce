import api from './api'

export const getProducts = async (page: number = 1, limit: number = 1) => {
  try {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: object) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (id: string, data: object) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};