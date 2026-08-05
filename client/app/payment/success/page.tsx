"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-md mx-auto my-20 p-6 text-center border rounded-xl shadow-sm bg-card">
      <div className="flex justify-center mb-4">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Thank you for your purchase. We have received your payment and are processing your order.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/orders"
          className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          View Orders
        </Link>
        <Link
          href="/"
          className="w-full border text-foreground font-medium py-2.5 rounded-lg hover:bg-muted transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}