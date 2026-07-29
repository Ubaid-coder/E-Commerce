import { Router, RequestHandler } from "express";
import { login, register, getMe } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();



router.post("/register", register);
router.post("/login", login);
router.get("/me", protect as RequestHandler, getMe);

export default router;