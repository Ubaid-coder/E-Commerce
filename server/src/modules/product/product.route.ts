import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  featuredProducts
} from "./product.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

/* ---------- Public ---------- */

router.get("/", getAll);
router.get("/featured", featuredProducts);

router.get("/:id", getOne);

/* ---------- Admin ---------- */

router.post("/", protect, authorize("admin"), create);

router.patch("/:id", protect, authorize("admin"), update);

router.delete("/:id", protect, authorize("admin"), remove);

export default router;