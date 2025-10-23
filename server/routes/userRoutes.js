import express from "express";
import multer from "multer";
import {
   signup,
   verifyOtp,
   login,
   forgotPassword,
   resetPassword,
   getProfile,
} from "../controllers/userController.js"; // Move submissionController functions here
import authUser from "../middlewares/authUser.js";
import {
   getUserSubmissions,
   newSubmission,
} from "../controllers/submissionController.js";

const router = express.Router();

// 🔓 Public routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🔐 Protected routes
router.get("/profile", authUser, getProfile);

// Multer setup for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// 📝 Submission routes
router.post(
   "/add-submission",
   authUser,
   upload.single("attachment"),
   newSubmission
);
router.get("/my-submissions", authUser, getUserSubmissions);

export default router;
