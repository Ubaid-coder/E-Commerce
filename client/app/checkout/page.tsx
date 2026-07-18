"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/order.service";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Layout selection states
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cod'>('cod');

  // Dynamic cost calculations based on actual cart context
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 15.00 : 0.00; // Matching user's "Free" default standard shipping
  const tax = subtotal * 0.08; // 8% estimated tax
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await createOrder(items);
      clearCart();
      router.push("/order-success");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // 1. Empty Cart State (Matching Bloom Aesthetic)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-24 px-4 font-sans antialiased">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-400 mb-6">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Your cart is empty</h1>
          <p className="text-sm text-slate-500 mt-2">
            Add some beautiful items before proceeding to checkout.
          </p>
          <Button
            className="w-full mt-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all focus:ring-2 focus:ring-emerald-500/20"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // 2. Full Checkout Form
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        {/* Simple Breadcrumb / Header */}
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-slate-500 mt-2">
            Please fill in your details to complete your BloomShop purchase.
          </p>
        </header>

        {/* Two-Column Grid split for forms and summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Checkout Details Form (Spans 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Information */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">2</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="Doe"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    placeholder="New York"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="state" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">State</label>
                    <input
                      type="text"
                      id="state"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ZIP Code</label>
                    <input
                      type="text"
                      id="zip"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">3</span>
                Shipping Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex justify-between items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-slate-800">Standard Delivery</span>
                      <span className="block text-xs text-slate-500 mt-0.5">3-5 Business Days</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Free</span>
                </label>
                
                <label className={`flex justify-between items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-slate-800">Express Delivery</span>
                      <span className="block text-xs text-slate-500 mt-0.5">Next Business Day</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">$15.00</span>
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">4</span>
                Payment Method
              </h2>
              
              <div className="flex border border-slate-100 rounded-lg p-1 bg-slate-50 mb-6 max-w-sm">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 text-xs py-2 px-3 rounded-md font-medium transition-colors ${paymentMethod === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 text-xs py-2 px-3 rounded-md font-medium transition-colors ${paymentMethod === 'paypal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex-1 text-xs py-2 px-3 rounded-md font-medium transition-colors ${paymentMethod === 'cod' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  COD
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
                  <div className="sm:col-span-3">
                    <label htmlFor="cardNumber" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                      placeholder="•••• •••• •••• ••••"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="expiry" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Expiration Date</label>
                    <input
                      type="text"
                      id="expiry"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600">You will be redirected securely to PayPal after confirming your purchase.</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl flex gap-3 items-start">
                  <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Pay on Delivery</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pay our delivery partner in cash upon physical receipt of your package at your doorstep.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Dynamic Order Summary (Spans 5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-medium text-slate-900 pb-4 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Cart Items List */}
              <ul className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <li key={item._id} className="py-4 flex gap-4">
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg bg-slate-100 border border-slate-100"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <div className="flex justify-end text-xs font-semibold text-slate-800">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cost Breakdown */}
              <div className="pt-4 space-y-2 text-sm border-t border-slate-100 mt-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-slate-800">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Tax</span>
                  <span className="text-slate-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Due</span>
                  <span className="text-emerald-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button with Loading State */}
              <Button
                type="button"
                disabled={loading}
                onClick={handlePlaceOrder}
                className="w-full mt-6 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  paymentMethod === 'cod' ? 'Confirm Order (COD)' : 'Confirm & Pay'
                )}
              </Button>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}