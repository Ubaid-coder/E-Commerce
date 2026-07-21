"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle, ShoppingBag, ArrowRight, Loader2, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/services/order.service";

interface Product {
  _id: string;
  name: string;
  brand: string;
  images: string[];
}

interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

interface OrderData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderReceipt = async () => {
      try {
        setLoading(true);
        // Using your endpoint to pull the successful order data
        const response = await getOrder(id as string);
        const data = await response.data;
       
          setOrder(data);
        
      } catch (error) {
        console.error("Error displaying order invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderReceipt();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
        <span className="text-sm font-medium text-slate-500">Generating your summary receipt...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm px-4">
        <p className="text-slate-500 font-medium">Order receipt details could not be found.</p>
        <Button onClick={() => router.push("/")} className="mt-4 bg-slate-900 text-white rounded-xl">
          Return to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans space-y-8">
      
      {/* Success Celebration Header */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm animate-bounce">
          <CheckCircle className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Order Confirmed!</h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Thanks for shopping, <span className="font-semibold text-slate-800">{order.user.name}</span>. Your delivery is processing.
          </p>
        </div>
      </div>

      {/* Meta Specs Overview Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Invoice ID</span>
            <span className="font-mono font-semibold text-slate-900">#{order._id.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Placed At</span>
            <span className="font-semibold text-slate-800">
              {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Purchased Breakdowns */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Items Summary
        </div>
        <div className="divide-y divide-slate-50">
          {order.items.map((item, index) => (
            <div key={index} className="p-4 flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-xl border border-slate-100 bg-slate-50 shrink-0 overflow-hidden">
                  {item.product.images?.[0] ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    {item.product.brand} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right font-semibold text-slate-900">
                ${(item.priceAtPurchase * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Totals Bracket Box */}
        <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-sm">
          <span className="font-bold text-slate-500">Amount Settled</span>
          <span className="text-xl font-black text-slate-900">${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirmation Alerts Details info */}
      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-start gap-3">
        <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          We sent a transaction layout summary and automated routing track to your active contact path: <span className="font-bold text-slate-700">{order.user.email}</span>.
        </p>
      </div>

      {/* Post Actions Footer Navigation Links */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="rounded-xl border-slate-200 text-slate-700 h-11 px-6 font-semibold"
        >
          Keep Browsing
        </Button>
        <Button
          onClick={() => router.push(`/orders/${id}`)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 gap-2 font-semibold"
        >
          Track in Profile
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

    </div>
  );
}