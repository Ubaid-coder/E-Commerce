"use client";


import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BloomLoader from "../Loader";

export default function AuthRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();


  if (loading) return <BloomLoader />;

  if (isAuthenticated) {
    router.replace("/");
    return null;
  }

  return <>{children}</>;
}