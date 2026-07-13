import Category from "./category.model";

interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}

export const createCategory = async (data: CreateCategoryData) => {
  const existingCategory = await Category.findOne({
    $or: [
      { name: data.name },
      { slug: data.slug }
    ]
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create(data);

  return category;
};

export const getAllCategories = async () => {
  return await Category.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });
};

export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category || !category.isActive) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryData
) => {
  const category = await Category.findById(id);

  if (!category || !category.isActive) {
    throw new Error("Category not found");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);

  if (!category || !category.isActive) {
    throw new Error("Category not found");
  }

  category.isActive = false;

  await category.save();

  return category;
};