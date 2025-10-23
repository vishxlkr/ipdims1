import express from "express";
import multer from "multer";
import {
   signup,
   verifyOtp,
   login,
   forgotPassword,
   resetPassword,
   getProfile,
   updateProfile,
} from "../controllers/userController.js"; // Move submissionController functions here
import authUser from "../middlewares/authUser.js";
import {
   getUserSubmissions,
   newSubmission,
} from "../controllers/submissionController.js";

const userRouter = express.Router();

// 🔓 Public routes
userRouter.post("/signup", signup);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/login", login);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// 🔐 Protected routes
userRouter.get("/profile", authUser, getProfile);

// Multer setup for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// 📝 Submission routes
userRouter.post(
   "/add-submission",
   authUser,
   upload.single("attachment"),
   newSubmission
);
userRouter.get("/my-submissions", authUser, getUserSubmissions);

// Get user profile
userRouter.get("/profile", authUser, getProfile);

// Update user profile
userRouter.post(
   "/update-profile",
   authUser,
   upload.single("image"),
   updateProfile
);

export default userRouter;
