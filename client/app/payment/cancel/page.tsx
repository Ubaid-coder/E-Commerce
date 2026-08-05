"use client";

import Link from "next/link";
import { XCircle, ShoppingCart } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto my-20 p-6 text-center border rounded-xl shadow-sm bg-card">
      <div className="flex justify-center mb-4">
        <XCircle className="h-16 w-16 text-rose-500" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Your order was not completed. Items are still saved in your cart if you would like to try again.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/cart"
          className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Return to Cart
        </Link>
      </div>
    </div>
  );
}