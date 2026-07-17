import { Router } from "express";
import {
  create,
  getAllorders,
  getCustomerOrder,
  getOneOrder,
  myOrders,
  updateorderStatus,
} from "./order.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

router.use(protect);

router.post("/", protect, create);

router.get("/my-orders", protect, myOrders);

router.get("/:id", protect, getOneOrder);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllorders
);

router.get(
  "/number/:id",
  authorize("admin"),
  getCustomerOrder
)

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateorderStatus
);

export default router;