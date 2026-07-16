"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Package
} from "lucide-react";
import { getMyOrders } from "@/services/order.service";

// Interface reflecting your standard backend order structure
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        // Replace with your admin specific service endpoint if you have a separate getAllOrders()
        const response = await getMyOrders(); 
        if (response?.data) {
          setOrders(response.data);
          setFilteredOrders(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Filter based on both Search input (Order ID or User ID) and Status Tabs
  useEffect(() => {
    let result = orders;

    if (statusFilter !== "all") {
      result = result.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter(
        order =>
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  // Quick stats math
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status.toLowerCase() === "pending").length;
  const fulfilledCount = orders.filter(o => o.status.toLowerCase() === "delivered").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Track payments, shipping statuses, and order histories.</p>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Sales</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">${totalSales.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Orders</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingCount} orders</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Deliveries</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{fulfilledCount} orders</p>
          </div>
        </div>
      </div>

      {/* Control Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID / User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all shrink-0 ${
                statusFilter === status
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-slate-400">Loading incoming orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-slate-500 font-medium">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">Adjust search parameters or check dynamic tab states.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date Placed</th>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4">Total Revenue</th>
                  <th className="px-6 py-4">State Status</th>
                  <th className="px-6 py-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-50 text-amber-700 border-amber-100",
                    processing: "bg-blue-50 text-blue-700 border-blue-100",
                    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
                    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  };

                  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Order Id */}
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {order.user.slice(-8)}
                      </td>

                      {/* Items quantity count */}
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                      </td>

                      {/* Total Price */}
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ${order.totalPrice.toFixed(2)}
                      </td>

                      {/* Status pill badge */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wide ${
                          statusColors[order.status.toLowerCase()] || "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Action Links */}
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => router.push(`/orders/${order._id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}