import api from "./api";
import { Product } from "@/types/product";

interface ProductsResponse {
  success: boolean;
  results: number;
  data: Product[];
}

interface ProductResponse {
  success: boolean;
  data: Product;
}

export const getProducts = async () => {
  try {
    const response = await api.get<ProductsResponse>("/products");

    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const getProduct = async (id: string) => {
  const response = await api.get<ProductResponse>(`/products/${id}`);

  return response.data;
};