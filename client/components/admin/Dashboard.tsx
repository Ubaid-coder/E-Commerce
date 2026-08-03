"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  FolderTree, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  RefreshCw,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BloomLoader } from "@/components/Loader";
import { getAdminDashboardData, DashboardData } from "@/services/admin.service";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardData();
      if (res.success && res.dashboard) {
        setData(res.dashboard);
      }
    } catch (err: any) {
      toast.error(err.message || "Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <BloomLoader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-muted-foreground mb-4">Failed to load dashboard statistics.</p>
        <Button onClick={fetchDashboard}>Retry</Button>
      </div>
    );
  }

  const { stats, latestOrders, lowStockProducts } = data;

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of store performance, orders, and inventory.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboard} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active catalog items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Product groupings</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-amber-500/10 border-amber-500/20">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Pending</p>
              <span className="text-2xl font-bold">{stats.pendingOrders}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-blue-500/10 border-blue-500/20">
            <RefreshCw className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Processing</p>
              <span className="text-2xl font-bold">{stats.processingOrders}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-purple-500/10 border-purple-500/20">
            <Truck className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-xs font-medium text-purple-700 dark:text-purple-400">Shipped</p>
              <span className="text-2xl font-bold">{stats.shippedOrders}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Delivered</p>
              <span className="text-2xl font-bold">{stats.deliveredOrders}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-rose-500/10 border-rose-500/20">
            <XCircle className="h-8 w-8 text-rose-600" />
            <div>
              <p className="text-xs font-medium text-rose-700 dark:text-rose-400">Cancelled</p>
              <span className="text-2xl font-bold">{stats.cancelledOrders}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Grids for Latest Orders & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer transactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="flex items-center gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {latestOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No recent orders found.
              </p>
            ) : (
              <div className="space-y-4">
                {latestOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 border rounded-lg space-y-3 bg-muted/20"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-semibold text-sm">{order.user.name}</p>
                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">${order.totalPrice.toFixed(2)}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <div className="relative h-8 w-8 rounded overflow-hidden flex-shrink-0 border">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 truncate">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-muted-foreground">
                              {item.quantity} x ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Alerts
              </CardTitle>
              <CardDescription>Products requiring inventory restocking</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products" className="flex items-center gap-1">
                Manage Stock <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                All products have sufficient stock!
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{prod.name}</p>
                      <p className="text-xs text-muted-foreground">${prod.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        {prod.stock} units left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}