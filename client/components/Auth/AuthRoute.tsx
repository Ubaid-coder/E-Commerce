"use client";


import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BloomLoader from "../Loader";
import { useEffect } from "react";

export default function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/");
  }, [isAuthenticated, loading, router])



  if (loading) return <BloomLoader />;

  if (isAuthenticated) {
    <BloomLoader />

  }

  return <>{children}</>;
}