import User from "../auth/auth.model";


/**
 * Get all users
 */
export const getUsersService = async () => {
  const users = await User.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return users;
};

/**
 * Get single user by ID
 */
export const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * Update user
 */
export const updateUserService = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: "customer" | "admin";
  }
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;
  if (data.role !== undefined) user.role = data.role;

  await user.save();

  return user;
};

/**
 * Delete user
 */
export const deleteUserService = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await user.deleteOne();

  return {
    message: "User deleted successfully",
  };
};