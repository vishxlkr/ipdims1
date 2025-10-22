import express from "express";
import {
   signup,
   verifyOtp,
   login,
   forgotPassword,
   resetPassword,
   getProfile,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js"; // ✅ old-style middleware name

const router = express.Router();

// 🔓 Public routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🔐 Protected routes
router.get("/profile", authUser, getProfile);

export default router;
