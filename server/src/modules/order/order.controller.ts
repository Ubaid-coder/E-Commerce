import { Request, Response } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  customerOrder
} from "./order.service";

interface UserPayload {
  id: string;
  email: string;
  name?: string;
}

// Extend the native Express Request interface
interface AuthenticatedRequest extends Request {
  user?: UserPayload; 
}

export const create = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const order = await createOrder({
      user: req?.user?.id as string,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const myOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await getMyOrders(req?.user?.id as string);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getOneOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = await getOrderById(
      req.params.id as string,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getAllorders = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const updateorderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await updateOrderStatus(
      req.params.id as string,
      status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getCustomerOrder = async (req: Request, res: Response) => {
  try {
    const order = await customerOrder(req?.params?.id as string);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};