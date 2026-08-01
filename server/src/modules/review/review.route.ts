import express from "express";
import { canReview, create, getByProduct } from "./review.controller";
import { protect } from "../../middlewares/auth.middleware"

const router = express.Router();

router.post("/", protect, create);
router.get("/product/:productId", getByProduct);
router.get("/can-review/:productId",protect,canReview);

export default router;