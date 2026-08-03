import Order from "../order/order.model";
import Product from "../product/product.model";
import Category from "../category/category.model";
import User from "../auth/auth.model";


export const getDashboardStats = async () => {
  const [
    revenueResult,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalUsers,
    totalProducts,
    totalCategories,
    latestOrders,
    lowStockProducts,
  ] = await Promise.all([
    // Total Revenue
    Order.aggregate([
      {
        $match: {
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),

    // Order Counts
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Order.countDocuments({ status: "processing" }),
    Order.countDocuments({ status: "shipped" }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),

    // Other Counts
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),

    // Latest Orders
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5),

    // Low Stock Products
    Product.find({
      stock: { $lte: 5 },
    })
      .select("name stock price images")
      .sort({ stock: 1 })
      .limit(5),
  ]);

  return {
    stats: {
      totalRevenue: revenueResult[0]?.totalRevenue || 0,

      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,

      totalUsers,
      totalProducts,
      totalCategories,
    },

    latestOrders,

    lowStockProducts,
  };
};