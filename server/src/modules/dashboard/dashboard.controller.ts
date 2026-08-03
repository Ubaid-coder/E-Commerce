import { Request, Response } from "express";
import { getDashboardStats } from "./dashboard.service";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const dashboard = await getDashboardStats();

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};