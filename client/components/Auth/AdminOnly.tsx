"use client";


import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import BloomLoader from "../Loader";
import { useEffect } from "react";

export default function AdminOnly({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loading, user } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) router.replace("/login");
        if (user?.role !== "admin") router.replace("/");
    }, [loading, isAuthenticated, router])

    if (loading) {
        return <BloomLoader />;
    }

    if (!isAuthenticated) {
        <BloomLoader />

    }

    return <>{children}</>;
}