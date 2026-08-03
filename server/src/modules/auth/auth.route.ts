import { Router, RequestHandler } from "express";
import { login, register, getMe, forgotPasswordController, resetPasswordController } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();



router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/me", protect as RequestHandler, getMe);

export default router;