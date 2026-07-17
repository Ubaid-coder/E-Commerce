import { Request, Response } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  customerOrder
} from "./order.service";

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { items } = req.body;

    const order = await createOrder(userId, items);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
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

export const myOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getMyOrders(req.user!.id);

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

export const getOneOrder = async (req: Request, res: Response) => {
  try {
    const order = await getOrderById(
      req.params.id,
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
      req.params.id,
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
    const order = await customerOrder(req?.params?.id);

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