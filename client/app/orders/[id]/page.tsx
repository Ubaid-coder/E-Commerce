"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMyOrders } from "@/services/order.service";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  brand: string;
  category: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
  updatedAt: string;
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
  // Optional parameters if available on other endpoints in the future
  paymentMethod?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();
        
        // Find the matching order using the dynamic dynamic [id] parameter
        const matchingOrder = response.data.find(
          (o: Order) => o._id === id
        );
        
        setOrder(matchingOrder || null);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrders();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-slate-500">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-24 px-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Order Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">The order ID requested does not exist or you do not have permission to view it.</p>
          <Button className="w-full mt-6 bg-slate-900 text-white" onClick={() => router.push("/orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Progress mapping based on API status formats ("pending", "processing", etc.)
  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf(order.status.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto">

        {/* Navigation Action */}
        <button
          onClick={() => router.push("/orders")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-wider mb-6 group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        {/* Header Metadata */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200/60 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 tracking-tight flex items-center gap-3">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <span className="px-3.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 capitalize">
            {order.status}
          </span>
        </header>

        {/* 1. Visual Progress/Tracking Stepper */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <h3 className="text-sm font-semibold text-slate-800 tracking-wide uppercase mb-6">Delivery Progress</h3>

          <div className="relative flex justify-between items-center w-full max-w-2xl mx-auto">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 rounded" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 -z-10 rounded transition-all duration-500"
              style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-slate-200 text-slate-400"
                    } ${isActive ? "ring-4 ring-emerald-500/20 scale-110" : ""}`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-3.5 font-medium capitalize transition-colors ${isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Main Order Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left Column - Product Items */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <h3 className="text-sm font-semibold text-slate-800 tracking-wide uppercase px-6 py-4 border-b border-slate-100">
              Items Ordered
            </h3>
            <ul className="divide-y divide-slate-100 px-6">
              {order.items.map((item) => (
                <li key={item.product._id} className="py-5 flex gap-4">
                  <div className="relative w-16 h-16 shrink-0">
                    {item.product.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg bg-slate-100 border border-slate-100"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                      <span>${item.priceAtPurchase.toFixed(2)} each</span>
                      <span className="font-semibold text-slate-800">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Shipping & Invoice Summaries */}
          <div className="md:col-span-4 space-y-6">

            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-2">
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No shipping details provided.</p>
              )}
            </div>

            {/* Payment Summary Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-2">
                Payment Info
              </h3>
              <div className="text-xs text-slate-500 space-y-1.5">
                <p>Method: <span className="font-semibold text-slate-700">{order.paymentMethod || "Standard Checkout"}</span></p>
              </div>
              <hr className="border-slate-100" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-slate-800">Free</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-950 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-emerald-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}