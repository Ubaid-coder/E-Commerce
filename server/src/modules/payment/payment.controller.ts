import { Request, Response } from "express";
import { createCheckoutSession, handleStripeWebhook } from "./payment.service";


export const createCheckoutSessionController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.body;

    const userId = (req as Request & {
      user: { id: string };
    }).user.id;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
      return;
    }

    const session = await createCheckoutSession(
      orderId,
      userId
    );

    res.status(200).json({
      success: true,
      url: session.url,
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

export const stripeWebhookController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      res.status(400).send("Missing Stripe Signature");
      return;
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