import { Document, model, Schema, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// A user can review a product only once
reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

const Review = model<IReview>("Review", reviewSchema);

export default Review;