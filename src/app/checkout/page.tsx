"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { auth } from "@/lib/firebase";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: "veg" | "non-veg";
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

type PaymentMethod = "card" | "upi" | "wallet" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Card payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI payment state
  const [upiId, setUpiId] = useState("");

  // Wallet payment state
  const [walletType, setWalletType] = useState("paytm");
  const [walletPhone, setWalletPhone] = useState("");

  // Delivery details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("digitalCanteenCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      toast.error("Your cart is empty");
      router.push("/menu");
    }
  }, [router]);

  const totalAmount = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  const gst = totalAmount * 0.05;
  const finalTotal = totalAmount + gst;

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateUPI = (upi: string) => {
    return /^[\w.-]+@[\w.-]+$/.test(upi);
  };

  const validatePhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const handlePlaceOrder = async () => {
    // Validate delivery details
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim() || !validatePhone(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    // Validate payment details based on method
    if (paymentMethod === "card") {
      if (!validateCardNumber(cardNumber)) {
        toast.error("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardName.trim()) {
        toast.error("Please enter cardholder name");
        return;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        toast.error("Please enter valid expiry date (MM/YY)");
        return;
      }
      if (!cvv || cvv.length !== 3) {
        toast.error("Please enter valid CVV");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!validateUPI(upiId)) {
        toast.error("Please enter a valid UPI ID");
        return;
      }
    } else if (paymentMethod === "wallet") {
      if (!validatePhone(walletPhone)) {
        toast.error("Please enter a valid phone number linked to your wallet");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      localStorage.removeItem("digitalCanteenCart");
      toast.success("Order placed successfully! 🎉");
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This case is handled by the redirect effect
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-6">
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Order Confirmed!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Your order has been placed successfully.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-8">
              <p className="text-2xl font-bold text-orange-600 mb-1">₹{finalTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {paymentMethod === "cod" ? "Cash on Delivery" : "Paid"}
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/menu" className="block">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/menu" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Menu</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter your complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Credit / Debit Card</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Smartphone className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">UPI (Google Pay, PhonePe, Paytm)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Wallet className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Digital Wallet</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Cash on Delivery</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Forms */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Card Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "upi" && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">UPI Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID *</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm / yourname@ybl"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Enter your UPI ID (Google Pay, PhonePe, Paytm, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "wallet" && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Digital Wallet</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="walletType">Select Wallet *</Label>
                    <RadioGroup value={walletType} onValueChange={setWalletType}>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paytm" id="paytm" />
                          <Label htmlFor="paytm" className="cursor-pointer">Paytm Wallet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phonepe" id="phonepe" />
                          <Label htmlFor="phonepe" className="cursor-pointer">PhonePe Wallet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="amazonpay" id="amazonpay" />
                          <Label htmlFor="amazonpay" className="cursor-pointer">Amazon Pay</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobikwik" id="mobikwik" />
                          <Label htmlFor="mobikwik" className="cursor-pointer">Mobikwik</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="walletPhone">Registered Phone Number *</Label>
                    <Input
                      id="walletPhone"
                      placeholder="10-digit phone number"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "cod" && (
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Pay with cash when your order is delivered. Please keep exact change ready if possible.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader className="bg-orange-600 text-white">
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4 mb-4">
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
                        <p className="text-orange-600 font-bold text-sm">₹{cartItem.item.price.toFixed(2)} × {cartItem.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">GST (5%)</span>
                    <span className="font-semibold">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-orange-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 mt-6"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}