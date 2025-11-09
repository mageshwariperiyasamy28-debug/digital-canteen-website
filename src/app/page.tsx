"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UtensilsCrossed, Clock, Award, ShoppingCart, User, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

const featuredItems = [
  {
    id: 1,
    name: "Classic Burger",
    price: 749,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    price: 1099,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Paneer Tikka",
    price: 999,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop"
  }
];

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      toast.success("You have been logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Digital Canteen</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/menu">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-orange-600">
                  Menu
                </Button>
              </Link>
              {loading ? (
                <Button variant="ghost" disabled>Loading...</Button>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-orange-600">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-orange-600">
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <UtensilsCrossed className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to Digital Canteen
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Fresh, delicious meals delivered right to your table. Order now and enjoy quality food at great prices!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 w-full sm:w-auto">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  View Menu
                </Button>
              </Link>
              {!user && (
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-50 dark:from-gray-900"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-4">
                    <UtensilsCrossed className="w-12 h-12 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fresh Ingredients</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We use only the freshest, locally-sourced ingredients to prepare every dish with care.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-4">
                    <Clock className="w-12 h-12 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Service</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Fast and efficient service ensures your meal is ready when you need it.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-4">
                    <Award className="w-12 h-12 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Award Winning</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Recognized for excellence in taste, quality, and customer satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Items
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Check out our most popular dishes, loved by customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">₹{item.price.toFixed(2)}</span>
                    <Link href="/menu">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/menu">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                Digital Canteen
              </h4>
              <p className="text-gray-400">
                Serving delicious meals with a smile since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/menu" className="hover:text-orange-600 transition-colors">Menu</Link></li>
                {user ? (
                  <>
                    <li><Link href="/dashboard" className="hover:text-orange-600 transition-colors">Dashboard</Link></li>
                    <li><Link href="/profile" className="hover:text-orange-600 transition-colors">Profile</Link></li>
                    <li><button onClick={handleLogout} className="text-left hover:text-orange-600 transition-colors">Logout</button></li>
                  </>
                ) : (
                  <li><Link href="/login" className="hover:text-orange-600 transition-colors">Login</Link></li>
                )}
                <li><Link href="#" className="hover:text-orange-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 8am - 8pm</li>
                <li>Saturday - Sunday: 9am - 6pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Digital Canteen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}