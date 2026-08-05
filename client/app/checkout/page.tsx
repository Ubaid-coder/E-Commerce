"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/order.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { createStripeCheckoutSession } from "@/services/sripe.service";

interface ShippingAddressForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddressForm>({
    fullName: "Dua Ghaffar",
    email: "duaghaffar@gmail.com",
    phone: "+92 03132629515",
    address: "L-562 sector-5/c3 north karachi",
    city: "karachi",
    state: "sindh",
    postalCode: "75850",
    country: "pakistan",
  });

  const [formErrors, setFormErrors] = useState<Partial<ShippingAddressForm>>({});

  const [shippingMethod, setShippingMethod] = useState<"Standard" | "Express">(
    "Standard"
  );

  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery" | "Stripe" | "PayPal" | "JazzCash" | "EasyPaisa"
  >("Cash on Delivery");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof ShippingAddressForm]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ShippingAddressForm> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!shippingAddress.fullName.trim()) errors.fullName = "Full name is required.";
    if (!shippingAddress.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(shippingAddress.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!shippingAddress.phone.trim()) errors.phone = "Phone number is required.";
    if (!shippingAddress.address.trim()) errors.address = "Street address is required.";
    if (!shippingAddress.city.trim()) errors.city = "City is required.";
    if (!shippingAddress.state.trim()) errors.state = "State/Province is required.";
    if (!shippingAddress.postalCode.trim()) errors.postalCode = "Postal code is required.";
    if (!shippingAddress.country.trim()) errors.country = "Country is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const itemsPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = shippingMethod === "Express" ? 15 : 5;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  // Order Submission Logic
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;

    if (!validateForm()) {
      toast("Please correctly fill in all required shipping fields.", { icon: "ℹ" });
      return;
    }

    try {
      setLoading(true);

      // Construct Order Payload
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          email: shippingAddress.email.trim().toLowerCase(),
          phone: shippingAddress.phone.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country.trim(),
        },
        shippingMethod,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      // 1. ALWAYS Create the Order first in DB
      const response = await createOrder(orderPayload);
      const createdOrder = response?.data || response;
      const createdOrderId = createdOrder?._id;

      if (!createdOrderId) {
        throw new Error(response?.message || "Failed to create order.");
      }

      // Clear local shopping cart after order creation
      clearCart();

      // 2. Route according to payment method
      if (paymentMethod === "Stripe") {
        // Request checkout session using the generated Order ID
        await createStripeCheckoutSession(createdOrderId);
      } else {
        // Cash on Delivery or local payments -> Redirect to success screen
        router.push(`/order-success/${createdOrderId}`);
      }
    } catch (error: any) {
      console.error("Order process error:", error);
      toast.error(error?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add items to proceed to checkout.</p>
        <Button onClick={() => router.push("/")}>Return to Shop</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleConfirmOrder} className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Confirm Your Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in your shipping details and choose payment options to complete your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Inputs */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="fullName">Full Name *</label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className={formErrors.fullName ? "border-destructive" : ""}
                />
                {formErrors.fullName && (
                  <p className="text-xs text-destructive">{formErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email">Email Address *</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-destructive" : ""}
                />
                {formErrors.email && (
                  <p className="text-xs text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone">Phone Number *</label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 234 567 890"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? "border-destructive" : ""}
                />
                {formErrors.phone && (
                  <p className="text-xs text-destructive">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="address">Street Address *</label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main Street, Apt 4B"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className={formErrors.address ? "border-destructive" : ""}
                />
                {formErrors.address && (
                  <p className="text-xs text-destructive">{formErrors.address}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city">City *</label>
                <Input
                  id="city"
                  name="city"
                  placeholder="New York"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className={formErrors.city ? "border-destructive" : ""}
                />
                {formErrors.city && (
                  <p className="text-xs text-destructive">{formErrors.city}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="state">State / Province *</label>
                <Input
                  id="state"
                  name="state"
                  placeholder="NY"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className={formErrors.state ? "border-destructive" : ""}
                />
                {formErrors.state && (
                  <p className="text-xs text-destructive">{formErrors.state}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="postalCode">Postal / ZIP Code *</label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="10001"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className={formErrors.postalCode ? "border-destructive" : ""}
                />
                {formErrors.postalCode && (
                  <p className="text-xs text-destructive">{formErrors.postalCode}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="country">Country *</label>
                <Input
                  id="country"
                  name="country"
                  placeholder="United States"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className={formErrors.country ? "border-destructive" : ""}
                />
                {formErrors.country && (
                  <p className="text-xs text-destructive">{formErrors.country}</p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Shipping Method Selector */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <Truck className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Shipping Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setShippingMethod("Standard")}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  shippingMethod === "Standard"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-border"
                }`}
              >
                <div className="flex justify-between font-semibold">
                  <span>Standard Shipping</span>
                  <span>$5.00</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">3-5 Business Days</p>
              </div>

              <div
                onClick={() => setShippingMethod("Express")}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  shippingMethod === "Express"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-border"
                }`}
              >
                <div className="flex justify-between font-semibold">
                  <span>Express Shipping</span>
                  <span>$15.00</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">1-2 Business Days</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selector */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Cash on Delivery",
                "Stripe"
              ].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method as any)}
                  className={`p-3 text-xs font-semibold border rounded-lg transition-all text-center ${
                    paymentMethod === method
                      ? "border-primary bg-primary text-primary-foreground shadow"
                      : "hover:bg-accent"
                  }`}
                >
                  {method}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Items Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted border shrink-0">
                    <Image
                      src={item.images}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Total</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping ({shippingMethod})</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Order & Redirecting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    {paymentMethod === "Stripe" ? "Proceed to Stripe" : "Place Order"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  );
}