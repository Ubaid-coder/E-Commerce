import { Router } from "express";
import {
  create,
  getAllorders,
  getOneOrder,
  myOrders,
  updateorderStatus,
} from "./order.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

router.use(protect);

router.post("/", create);

router.get("/my-orders", myOrders);

router.get("/:id", getOneOrder);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllorders
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateorderStatus
);

export default router;