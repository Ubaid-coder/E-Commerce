import User from "./auth.model";
import generateToken from "../../utils/generateToken";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatched = await existingUser.comparePassword(password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(existingUser._id.toString());

  return {
    user: {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    },
    token,
  };
};