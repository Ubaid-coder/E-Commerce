import express from "express";
import { getDashboard } from "./dashboard.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { protect } from "../../middlewares/auth.middleware";
const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"), // use your existing admin middleware
  getDashboard
);

export default router;