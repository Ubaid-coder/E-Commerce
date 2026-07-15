"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getMyOrders } from "@/services/order.service";
import Link from "next/link";
import { Item } from "@radix-ui/react-select";

// Interface mimicking typical order structure returned from your order service
interface OrderItem {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    createdAt: string;
    paymentMethod: string;
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getMyOrders();

                setOrders(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        console.log(orders)
    }, []);

    // Helper to color-code statuses in Bloom's palette
    const getStatusBadgeStyles = (status: Order["status"]) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Processing":
            case "Shipped":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-100";
            case "Cancelled":
                return "bg-rose-50 text-rose-700 border-rose-100";
            default:
                return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    // 1. Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm font-medium text-slate-500">Loading your orders...</span>
                </div>
            </div>
        );
    }

    // 2. Empty Orders State
    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-24 px-4 font-sans antialiased">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-400 mb-6">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">No orders yet</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        You haven&apos;t placed any orders with BloomShop yet.
                    </p>
                    <Button
                        className="w-full mt-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all"
                        onClick={() => router.push("/")}
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        );
    }

    // 3. Orders List View
    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">My Orders</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Keep track of your current orders and view your purchase history.
                    </p>
                </header>

                <div className="space-y-8">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                        >
                            {/* Order Card Header */}
                            <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                                <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-y-2 text-xs">
                                    <div>
                                        <span className="block text-slate-400 font-medium uppercase tracking-wider">Order Number</span>
                                        <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{order._id}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 font-medium uppercase tracking-wider">Date Placed</span>
                                        <span className="font-medium text-slate-700 text-sm mt-0.5 block">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="block text-slate-400 font-medium uppercase tracking-wider">Total Amount</span>
                                        <span className="font-semibold text-emerald-600 text-sm mt-0.5 block">${order.totalPrice}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                    <span className="sm:hidden font-semibold text-emerald-600 text-sm">${order.totalPrice}</span>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyles(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Products List */}
                            <ul className="divide-y divide-slate-100 px-6">
                                {order.items.map((item, idx) => (
                                    <li key={`${order._id}-item-${idx}`} className="py-5 flex gap-4">
                                        <div className="relative w-16 h-16 shrink-0">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover rounded-lg bg-slate-100 border border-slate-100"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-xs text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-slate-500">
                                                    Unit Price: ${item.product.price.toFixed(2)}
                                                </span>
                                                <span className="text-sm font-semibold text-slate-800">
                                                    ${(item.product.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Footer Panel */}
                            <div className="px-6 py-4 bg-slate-50/20 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <p className="text-xs text-slate-500">
                                    Payment Method: <span className="font-semibold text-slate-700">{order.paymentMethod}</span>
                                </p>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        className="flex-1 sm:flex-initial text-xs border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 h-9"
                                        onClick={() => router.push("/")}
                                    >
                                        Buy Again
                                    </Button>
                                    <Link href={`/orders/${order._id}`}>
                                        <Button
                                            className="flex-1 sm:flex-initial text-xs bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 h-9"
                                        
                                        >
                                            Track Package
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}