"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createStripeCheckoutSession } from "@/services/sripe.service";

interface StripeCheckoutButtonProps {
  checkoutData: string;
  disabled?: boolean;
}

export default function StripeCheckoutButton({
  checkoutData,
  disabled = false,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      await createStripeCheckoutSession(checkoutData);
    } catch (error: any) {
      toast.error(error?.message || "Failed to start checkout session");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Redirecting to Stripe...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5" />
          Pay with Card (Stripe)
        </>
      )}
    </button>
  );
}