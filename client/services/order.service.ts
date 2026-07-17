import api from './api'

// ===================== Customer =====================

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

// ===================== Admin =====================

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getCustomerOrder = async(id:string) => {
  const response = await api.get(`/orders/number/${id}`);
  return response.data
}

export const updateOrderStatus = async (
  id: string,
  status: string
) => {
  const response = await api.patch(`/orders/${id}/status`, {
    status,
  });

  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};