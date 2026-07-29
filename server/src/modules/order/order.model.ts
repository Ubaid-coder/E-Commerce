import { Schema, model, Document, Types } from "mongoose";

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
export interface IOrderItem {
  product: Types.ObjectId;

  name: string;
  image: string;

  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  shippingMethod: "Standard" | "Express";

  paymentMethod: string;

  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;

  paymentStatus: "pending" | "paid" | "failed";

  status:
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

  paidAt?: Date;
  deliveredAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    shippingMethod: {
      type: String,
      enum: ["Standard", "Express"],
      default: "Standard",
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Cash on Delivery",
        "Stripe",
        "PayPal",
        "JazzCash",
        "EasyPaisa",
      ],
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paidAt: Date,

    deliveredAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;