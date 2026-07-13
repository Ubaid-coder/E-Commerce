import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from "./category.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize.middleware";

const router = Router();

// Public Routes
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryController);

// Admin Routes
router.post("/", protect, authorize("admin"), createCategoryController);
router.patch("/:id", protect, authorize("admin"), updateCategoryController);
router.delete("/:id", protect, authorize("admin"), deleteCategoryController);

export default router;