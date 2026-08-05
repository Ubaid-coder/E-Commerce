import express from "express";
import {
  createCheckoutSessionController,
  stripeWebhookController,
} from "./payment.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

// Checkout Session
router.post(
  "/create-checkout-session",
  protect,
  createCheckoutSessionController
);

router.post("/webhook", stripeWebhookController);



export default router;