import Order from "./order.model";
import Product from "../product/product.model";

interface OrderItemInput {
  product: string;
  quantity: number;
}

interface CreateOrderData {
  user: string;
  items: {
    product: string;
    quantity: number;
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

  shippingMethod: "Standard" | "Express";

  paymentMethod:
    | "Cash on Delivery"
    | "Stripe"
  
}

export const createOrder = async (data: CreateOrderData) => {
  let itemsPrice = 0;
console.log(data)
  const orderItems = [];

  for (const item of data.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error("Product not found");
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      quantity: item.quantity,
      price: product.discountPrice || product.price,
    });

    itemsPrice += (product.discountPrice || product.price) * item.quantity;
  }

  const shippingPrice =
    data.shippingMethod === "Express" ? 300 : 150;

  const taxPrice = 0;

  const totalPrice =
    itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: data.user,

    items: orderItems,

    shippingAddress: data.shippingAddress,

    shippingMethod: data.shippingMethod,

    paymentMethod: data.paymentMethod,

    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  return order;
};

export const getMyOrders = async (userId: string) => {
  return await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });
};

export const getOrderById = async (
  orderId: string,
  userId: string
) => {
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .populate("items.product");

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  return order;
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 });
};

export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "processing" | "delivered" | "cancelled"
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;

  await order.save();

  return await Order.findById(orderId)
    .populate("user", "name email")
    .populate("items.product");
};

export const customerOrder = async (orderId: string) => {
  const order = await Order.findById(orderId).populate("user", "name email")
    .populate("items.product");;
  return order;
}