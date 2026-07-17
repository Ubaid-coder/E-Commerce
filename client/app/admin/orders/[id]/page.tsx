"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Package, User, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerOrder, getOrder, updateOrderStatus } from "@/services/order.service";
import Image from "next/image";
import { toast } from "react-hot-toast";

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
  user: {
    _id: string;
    name: string;
    email: string;
  } | string; // Adjust depending on if your backend populates user details
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await getCustomerOrder(id as string);

        setOrder(data);

      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const response = await updateOrderStatus(id as string, newStatus)

      // if (response.success) {
        setOrder({ ...order, status: newStatus });
      // }
      toast.success(`Order Status changed to: ${newStatus}`,);



    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong")
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
        <span className="text-sm font-medium text-slate-500">Retrieving invoice specifics...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-500 font-medium">Order records missing or unavailable.</p>
        <Button onClick={() => router.push("/admin/orders")} className="mt-4 bg-slate-900 text-white rounded-xl">
          Return to Orders
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    processing: "bg-blue-50 text-blue-700 border-blue-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Context navigation bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/orders")}
            type="button"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Full parameters audit and shipment controls.</p>
          </div>
        </div>

        {/* Live Status Modification Dropdown selector */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">State:</span>
          <select
            disabled={updating}
            value={order.status.toLowerCase()}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 cursor-pointer disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Columns - Line Items details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Itemized Breakdown</h3>
            </div>

            <div className="divide-y divide-slate-50">
              {order.items.map((item, index) => (
                <div key={index} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className=" rounded-lg bg-slate-50 border border-slate-100 shrink-0 overflow-hidden">
                      <Image

                        src={item.product.images[0] || ""}
                        alt="product-image"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {typeof item.product === "object" ? item.product.name : "Product Item"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 text-sm">
                      ${((item.priceAtPurchase || item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Balance Sheet summary box */}
            <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-500">Gross Subtotal Amount:</span>
              <span className="text-xl font-bold text-slate-900">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Client meta summary */}
        <div className="space-y-6">
          {/* Metadata info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Placed On</span>
                <span className="text-sm font-semibold text-slate-800">
                  {new Date(order.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Buyer Identification</span>
                <span className="text-sm font-mono text-slate-600">
                  {typeof order.user === "object" ? order.user.email : `User #${order.user.slice(-8)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address container box */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logistics Destination</h4>
              <div className="text-sm text-slate-700 leading-relaxed font-medium">
                <p className="text-slate-900 font-semibold">{typeof order.user === "object" ? order.user.name : "Customer"}</p>
                <p className="mt-1 text-slate-500">{order.shippingAddress.street}</p>
                <p className="text-slate-500">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide mt-1">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}