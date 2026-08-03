import api from "./api";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface LatestOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  price: number;
}

export interface DashboardData {
  stats: DashboardStats;
  latestOrders: LatestOrder[];
  lowStockProducts: LowStockProduct[];
}

export interface AdminDashboardResponse {
  success: boolean;
  dashboard: DashboardData;
}

export const getAdminDashboardData = async (): Promise<AdminDashboardResponse> => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch dashboard data"
    );
  }
};