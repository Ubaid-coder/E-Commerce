import Stripe from "stripe";
import Order from "../order/order.model";


export const createCheckoutSession = async (
  orderId: string,
  userId: string
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  
  // Find Order
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  // Verify Owner
  if (order.user.toString() !== userId) {
    throw new Error("Unauthorized.");
  }

  // Prevent Double Payment
  if (order.paymentStatus === "paid") {
    throw new Error("Order already paid.");
  }

  // Stripe Line Items
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      quantity: item.quantity,

      price_data: {
        currency: "usd",

        unit_amount: Math.round(item.price * 100),

        product_data: {
          name: item.name,

          images: item.image ? [item.image] : [],
        },
      },
    }));

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items,

    metadata: {
      orderId: order._id.toString(),
      userId,
    },

    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
  });

  return {
    url: session.url,
  };
};

export const handleStripeWebhook = async (
  body: Buffer,
  signature: string
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        throw new Error("Order ID missing from Stripe metadata.");
      }

      const order = await Order.findById(orderId);
      console.log(order);

      if (!order) {
        throw new Error("Order not found.");
      }

      order.paymentStatus = "Paid";
      order.paymentMethod = "Stripe";
      order.paidAt = new Date();
      await order.save();
      
      console.log("✅ Payment completed:", order._id);

      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return event;
};