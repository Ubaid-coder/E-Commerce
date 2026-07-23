import api from './api'

export const getProducts = async (
  page: number = 1,
  limit: number = 1,
  category?: string,
  search?: string
) => {
  try {

    let url = `/products?page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await api.get(url);

    return response.data;

  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};


export const getFeaturedProductsByCategory = async () => {
  try {
    const response = await api.get(`/products/featured`);
    return response.data;

  } catch (err) {
    console.log(err)
  }
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  try {
    const response = api.get("/categories");
    return response;
  } catch (error) {
    console.log(error);
  }
}

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