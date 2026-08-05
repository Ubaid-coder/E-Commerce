import { Request, Response } from "express";
import { createCheckoutSession, handleStripeWebhook } from "./payment.service";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const createCheckoutSessionController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const session = await createCheckoutSession(
      orderId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      url: session.url,
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

export const stripeWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).send("Missing Stripe Signature");
    }

    await handleStripeWebhook(
      req.body,
      signature as string
    );

    res.status(200).json({
      received: true,
    });

  } catch (error) {
    console.log(error);

    res.status(400).send(
      error instanceof Error
        ? error.message
        : "Webhook Error"
    );
  }
};