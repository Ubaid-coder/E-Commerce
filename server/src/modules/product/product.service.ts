import Product from "./product.model";
import Category from "../category/category.model";
import mongoose from "mongoose";

interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  category: string;
  images: string[];
  stock: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  brand?: string;
  category?: string;
  images?: string[];
  stock?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export const createProduct = async (data: CreateProductData) => {
  const existingProduct = await Product.findOne({
    $or: [{ name: data.name }, { slug: data.slug }],
  });

  if (existingProduct) {
    throw new Error("Product already exists");
  }

  const category = await Category.findById(data.category);

  if (!category || !category.isActive) {
    throw new Error("Category not found");
  }

  const product = await Product.create(data);

  return await product.populate("category", "name slug");
};

export const getAllProducts = async (
  page: number = 1,
  limit: number = 12,
  category?: string,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const filter: any = {
    isPublished: true,

  };

  if (category && mongoose.Types.ObjectId.isValid(category)) {
    filter.category = new mongoose.Types.ObjectId(category);
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i"
    }
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page < Math.ceil(totalProducts / limit),
      hasPreviousPage: page > 1,
    },
  };
};

export const getFeaturedProducts = async () => {
  const categories = await Category.find();
  const products = await Product.find({
    isFeatured: true,
    isPublished: true,
  }).populate("category");
  for (const category of categories) {
    const products = await Product.find({
      category: category._id,
      isFeatured: true,
      isPublished: true,
    }).limit(4);
  }


  return products;
};
export const getProductById = async (id: string) => {
  const product = await Product.findById(id).populate(
    "category",
    "name slug"
  );

  if (!product || !product.isPublished) {
    throw new Error("Product not found");
  }

  return product;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductData
) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.category) {
    const category = await Category.findById(data.category);

    if (!category || !category.isActive) {
      throw new Error("Category not found");
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  product.isPublished = false;

  await product.save();

  return product;
};