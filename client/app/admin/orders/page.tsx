"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { getAllOrders } from "@/services/order.service";

interface Product {
  _id: string;
  name: string;
  price: number;
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
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const {data} = await getAllOrders(); 
        
          setOrders(data);
        console.log(data)
        
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);


  return (
    <div className="space-y-6">
      {/* Top Heading Actions */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Monitor customer transactions and checkout fulfillment.</p>
      </div>

      {/* Standalone Search Deck */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID / User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-slate-400">Loading order records...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-slate-500 font-medium">No orders found</p>
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
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {orders.map((order) => {
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-50 text-amber-700 border-amber-100",
                    processing: "bg-blue-50 text-blue-700 border-blue-100",
                    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
                    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  };
                  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{order.user._id}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{totalItemsCount} items</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wide ${statusColors[order.status.toLowerCase()] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => router.push(`/admin/orders/${order._id}`)}
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