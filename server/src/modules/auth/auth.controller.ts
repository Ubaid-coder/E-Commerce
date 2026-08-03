import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { forgotPassword } from "./auth.service";
import { sendEmail } from "../../utils/sendEmail";

// Define what your user object looks like
interface UserPayload {
  id: string;
  email: string;
  name?: string;
}

// Extend the native Express Request interface
interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

export const forgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailData = await forgotPassword(email);
 
    await sendEmail(
      emailData.email,
      emailData.subject,
      emailData.message
    );

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });

  } catch (error) {
   

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};