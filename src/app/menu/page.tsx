"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, ArrowLeft, Leaf } from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: "veg" | "non-veg";
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and cheese",
    price: 749,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil",
    price: 1099,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, and Caesar dressing",
    price: 649,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    category: "Salad",
    type: "veg"
  },
  {
    id: 4,
    name: "Chicken Wrap",
    description: "Grilled chicken, vegetables, and special sauce",
    price: 849,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 5,
    name: "French Fries",
    description: "Crispy golden fries with sea salt",
    price: 329,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    category: "Side",
    type: "veg"
  },
  {
    id: 6,
    name: "Paneer Tikka",
    description: "Spiced cottage cheese with vegetables",
    price: 999,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 7,
    name: "Chocolate Cake",
    description: "Rich chocolate layer cake with frosting",
    price: 499,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    category: "Dessert",
    type: "veg"
  },
  {
    id: 8,
    name: "Iced Coffee",
    description: "Cold brew coffee with ice and milk",
    price: 379,
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    category: "Beverage",
    type: "veg"
  },
  {
    id: 9,
    name: "Butter Chicken",
    description: "Tender chicken in creamy tomato sauce",
    price: 1199,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 10,
    name: "Dal Makhani",
    description: "Creamy black lentils with spices",
    price: 799,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 11,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken",
    price: 1299,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 12,
    name: "Veg Biryani",
    description: "Fragrant rice with mixed vegetables and spices",
    price: 899,
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 13,
    name: "Masala Dosa",
    description: "Crispy rice crepe with potato filling",
    price: 599,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 14,
    name: "Tandoori Chicken",
    description: "Chargrilled chicken with aromatic spices",
    price: 1149,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 15,
    name: "Chole Bhature",
    description: "Spicy chickpeas with fluffy fried bread",
    price: 749,
    image: "https://images.unsplash.com/photo-1626132647523-66f85bf49a82?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 16,
    name: "Fish Curry",
    description: "Fresh fish in tangy coconut curry",
    price: 1399,
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 17,
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes",
    price: 249,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    category: "Snack",
    type: "veg"
  },
  {
    id: 18,
    name: "Mango Lassi",
    description: "Creamy yogurt drink with fresh mango",
    price: 299,
    image: "https://images.unsplash.com/photo-1589291279675-62ac00d480db?w=400&h=300&fit=crop",
    category: "Beverage",
    type: "veg"
  },
  {
    id: 19,
    name: "Chicken Tikka Masala",
    description: "Grilled chicken in rich tomato cream sauce",
    price: 1249,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 20,
    name: "Palak Paneer",
    description: "Cottage cheese in creamy spinach curry",
    price: 949,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  },
  {
    id: 21,
    name: "Naan Bread",
    description: "Soft tandoor-baked flatbread",
    price: 149,
    image: "https://images.unsplash.com/photo-1601050690405-a0930f7ab5d3?w=400&h=300&fit=crop",
    category: "Side",
    type: "veg"
  },
  {
    id: 22,
    name: "Gulab Jamun",
    description: "Sweet milk dumplings in sugar syrup",
    price: 399,
    image: "https://images.unsplash.com/photo-1589301773859-cb1e9ab7ad29?w=400&h=300&fit=crop",
    category: "Dessert",
    type: "veg"
  },
  {
    id: 23,
    name: "Mutton Rogan Josh",
    description: "Tender lamb in aromatic Kashmiri gravy",
    price: 1499,
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "non-veg"
  },
  {
    id: 24,
    name: "Aloo Gobi",
    description: "Potato and cauliflower dry curry",
    price: 699,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    category: "Main Course",
    type: "veg"
  }
];

export default function MenuPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [filterType, setFilterType] = useState<"all" | "veg" | "non-veg">("all");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("digitalCanteenCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("digitalCanteenCart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("digitalCanteenCart");
    }
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    const existingItemIndex = cart.findIndex(cartItem => cartItem.item.id === item.id);
    
    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
      toast.success(`Added ${quantity} more ${item.name} to cart`);
    } else {
      setCart([...cart, { item, quantity }]);
      toast.success(`${item.name} added to cart`);
    }
    
    setQuantities({ ...quantities, [item.id]: 1 });
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: number, delta: number) => {
    const newCart = cart.map(cartItem => {
      if (cartItem.item.id === itemId) {
        const newQuantity = Math.max(0, cartItem.quantity + delta);
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    }).filter(cartItem => cartItem.quantity > 0);
    
    setCart(newCart);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    // Navigate to checkout page
    router.push("/checkout");
  };

  const filteredItems = filterType === "all" 
    ? menuItems 
    : menuItems.filter(item => item.type === filterType);

  const totalAmount = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  const totalItems = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Our Menu</h1>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
              {totalItems > 0 && (
                <Badge className="bg-orange-600 text-white">{totalItems}</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className={filterType === "all" ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            All Items
          </Button>
          <Button
            variant={filterType === "veg" ? "default" : "outline"}
            onClick={() => setFilterType("veg")}
            className={filterType === "veg" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Leaf className="w-4 h-4 mr-2" />
            Veg
          </Button>
          <Button
            variant={filterType === "non-veg" ? "default" : "outline"}
            onClick={() => setFilterType("non-veg")}
            className={filterType === "non-veg" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Non-Veg
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-orange-600 text-white">
                        {item.category}
                      </Badge>
                      <div className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center ${
                        item.type === "veg" 
                          ? "border-green-600 bg-white" 
                          : "border-red-600 bg-white"
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          item.type === "veg" ? "bg-green-600" : "bg-red-600"
                        }`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{item.description}</p>
                    <p className="text-2xl font-bold text-orange-600">₹{item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantities[item.id] || 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader className="bg-orange-600 text-white">
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </CardHeader>
              <CardContent className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex items-center gap-3 pb-4 border-b dark:border-gray-700">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                          <div className={`absolute -top-1 -left-1 w-4 h-4 rounded border flex items-center justify-center ${
                            cartItem.item.type === "veg" 
                              ? "border-green-600 bg-white" 
                              : "border-red-600 bg-white"
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              cartItem.item.type === "veg" ? "bg-green-600" : "bg-red-600"
                            }`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{cartItem.item.name}</h4>
                          <p className="text-orange-600 font-bold">₹{cartItem.item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartQuantity(cartItem.item.id, -1)}
                            className="h-7 w-7"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">{cartItem.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateCartQuantity(cartItem.item.id, 1)}
                            className="h-7 w-7"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="flex flex-col gap-4 p-4 pt-0">
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">GST (5%)</span>
                      <span className="font-semibold">₹{(totalAmount * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-orange-600">₹{(totalAmount * 1.05).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                  >
                    Place Order
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}