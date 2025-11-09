"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed, ArrowLeft, Search, Calendar, IndianRupee } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-06-15",
    items: [
      { name: "Paneer Tikka", quantity: 2, price: 999 },
      { name: "Naan Bread", quantity: 4, price: 149 },
      { name: "Mango Lassi", quantity: 2, price: 299 }
    ],
    total: 2895,
    status: "Delivered"
  },
  {
    id: "ORD-002",
    date: "2023-06-10",
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 1299 },
      { name: "Gulab Jamun", quantity: 2, price: 399 }
    ],
    total: 2097,
    status: "Delivered"
  },
  {
    id: "ORD-003",
    date: "2023-06-05",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 1099 },
      { name: "Caesar Salad", quantity: 1, price: 649 },
      { name: "Iced Coffee", quantity: 2, price: 379 }
    ],
    total: 2606,
    status: "Cancelled"
  },
  {
    id: "ORD-004",
    date: "2023-05-28",
    items: [
      { name: "Butter Chicken", quantity: 1, price: 1199 },
      { name: "Dal Makhani", quantity: 1, price: 799 },
      { name: "Naan Bread", quantity: 3, price: 149 }
    ],
    total: 2445,
    status: "Delivered"
  },
  {
    id: "ORD-005",
    date: "2023-05-20",
    items: [
      { name: "Tandoori Chicken", quantity: 1, price: 1149 },
      { name: "Veg Biryani", quantity: 1, price: 899 }
    ],
    total: 2153,
    status: "Delivered"
  }
];

export default function OrdersPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading orders...</p>
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
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Dashboard</span>
              </Link>
            </div>
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Canteen</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order History</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your past orders
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders by ID or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm ? "No orders match your search criteria" : "You haven't placed any orders yet"}
                </p>
                <Link href="/menu">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Order Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order {order.id}
                        <Badge 
                          variant={order.status === "Delivered" ? "default" : "destructive"}
                          className={order.status === "Delivered" ? "bg-green-600" : ""}
                        >
                          {order.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600 flex items-center justify-end gap-1">
                        <IndianRupee className="w-5 h-5" />
                        {order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items.length} items
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === "Delivered" && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}