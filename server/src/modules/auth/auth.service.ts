import User from "./auth.model";
import crypto from "crypto";
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

export const forgotPassword = async (email: string) => {
  // 1. Find user
  const user = await User.findOne({ email }).select(
    "+passwordResetToken +passwordResetExpires"
  );

  if (!user) {
    throw new Error("No user found with this email.");
  }

  // 2. Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3. Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 4. Save hash & expiry
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await user.save({ validateBeforeSave: false });

  // 5. Reset URL (frontend URL)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // 6. Email message
  const message = `
You requested a password reset.

Click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.
`;

  return {
    email: user.email,
    subject: "Password Reset Request",
    message,
  };
};