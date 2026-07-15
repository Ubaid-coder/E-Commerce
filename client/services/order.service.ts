import api from './api'

export const createOrder = async (items: any[]) => {
  const response = await api.post("/orders", {
    items,
  });

  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");

  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};