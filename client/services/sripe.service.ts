import { loadStripe } from "@stripe/stripe-js";
import api from "./api";

// Initialize Stripe outside of render to avoid recreating the object on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface CheckoutPayload {
  cartItems: {
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const createStripeCheckoutSession = async (orderId: string) => {
  try {
    // Call the endpoint with the created order's ID
    const response = await api.post("/payment/create-checkout-session", { orderId });

    const { url } = response.data;

    if (url) {
      // Redirect directly to Stripe Checkout
      window.location.href = url;
    } else {
      throw new Error("Failed to retrieve Stripe checkout URL.");
    }
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to initiate payment"
    );
  }
};