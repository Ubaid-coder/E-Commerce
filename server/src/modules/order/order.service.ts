import Order from "./order.model";
import Product from "../product/product.model";

interface OrderItemInput {
  product: string;
  quantity: number;
}

export const createOrder = async (
  userId: string,
  items: OrderItemInput[]
) => {
  if (!items || items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} has only ${product.stock} items left in stock`);
    }

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    });

    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice,
  });

  return await Order.findById(order._id)
    .populate("user", "name email")
    .populate("items.product");
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
  status: "pending" | "processing" | "completed" | "cancelled"
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