"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/auth.service";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
        console.log(error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-gray-600">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center space-y-3">
          <p className="font-medium">Check your inbox!</p>
          <p className="text-sm">
            We sent a password reset link to <span className="font-semibold">{email}</span>. The link is valid for 15 minutes.
          </p>
          <div className="pt-2">
            <Link href="/login" className="text-sm underline font-medium">
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-3 hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}