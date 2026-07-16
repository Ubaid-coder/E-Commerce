"use client";


import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import BloomLoader from "../Loader";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login");
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <BloomLoader />;
  }

  if (!isAuthenticated) {
    <BloomLoader />

  }

  return <>{children}</>;
}