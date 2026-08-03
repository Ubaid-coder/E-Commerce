"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added import

import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      login(response.data.user, response.data.token);

      toast.success("Login Successful");

      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
          {/* Forgot Password Link */}
          <div className="text-right mt-2">
            <Link 
              href="/forgot-password" 
              className="text-xs text-gray-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-3 hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
}