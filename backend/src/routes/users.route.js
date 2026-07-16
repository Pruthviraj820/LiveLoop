import { Router } from "express";
import { addToHistory, getUserHistory, login, register } from "../controllers/user.controller.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";

const router = Router()

router.route("/login").post(loginLimiter, login)
router.route("/register").post(registerLimiter, register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)

export default router;