"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, ShoppingCart, History, User, LogOut, Calendar } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-06-15",
    items: 3,
    total: 1249,
    status: "Delivered"
  },
  {
    id: "ORD-002",
    date: "2023-06-10",
    items: 2,
    total: 899,
    status: "Delivered"
  },
  {
    id: "ORD-003",
    date: "2023-06-05",
    items: 5,
    total: 2199,
    status: "Cancelled"
  }
];

export default function DashboardPage() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState(mockOrders);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have been logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This case is handled by the redirect effect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Canteen</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">
                Welcome, {userProfile?.name || user.displayName || user.email?.split("@")[0] || "User"}
              </span>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Manage your orders and account settings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <UtensilsCrossed className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12,450</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+₹1,200 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favorite Item</CardTitle>
              <User className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Paneer Tikka</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ordered 5 times</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your most recent orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div>
                        <div className="font-semibold">{order.id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{order.total.toFixed(2)}</div>
                        <div className="text-sm">
                          {order.items} items
                        </div>
                      </div>
                      <div>
                        <Badge 
                          variant={order.status === "Delivered" ? "default" : "destructive"}
                          className={order.status === "Delivered" ? "bg-green-600" : ""}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/orders">
                    <Button variant="outline">View All Orders</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account
                </CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700">
                    <UtensilsCrossed className="w-4 h-4 mr-2" />
                    Order Food
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your ordering habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Veg Orders</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Non-Veg Orders</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}