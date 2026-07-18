import express from "express";


import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserProfile,
    updateUserProfile,
} from "./user.controller";
import { authorize } from "../../middlewares/authorize.middleware";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

/*
User Routes
*/

// Get User profile
router.get("/profile/", protect, getUserProfile)
router.put("/profile/", protect, updateUserProfile)

/**
 * Admin Routes
 */

// Get all users
router.get("/", protect, authorize("admin"), getUsers);

// Get single user
router.get("/:id", protect, authorize("admin"), getUserById);

// Update user
router.put("/:id", protect, authorize("admin"), updateUser);

// Delete user
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;