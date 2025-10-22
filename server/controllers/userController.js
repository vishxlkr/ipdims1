import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/email.js";

// Function to generate a 6-digit OTP
const generateOTP = () => {
   return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to generate JWT
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
   });
};

// @desc    Register a new user (sends OTP)
// @route   POST /api/users/signup
// @access  Public
export const signup = async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const existingVerifiedUser = await userModel.findOne({
         email,
         isVerified: true,
      });
      if (existingVerifiedUser) {
         return res
            .status(400)
            .json({
               success: false,
               message: "User with this email already exists.",
            });
      }

      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      let user = await userModel.findOne({ email });
      if (user) {
         user.name = name;
         user.password = await bcrypt.hash(password, 10);
         user.otp = otp;
         user.otpExpires = otpExpires;
         user.isVerified = false;
      } else {
         const hashedPassword = await bcrypt.hash(password, 10);
         user = new userModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
         });
      }

      await user.save();

      const message = `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`;
      await sendEmail({
         email: user.email,
         subject: "OTP Verification",
         message,
      });

      res.status(200).json({
         success: true,
         message: "OTP sent to your email.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during signup.",
      });
   }
};

// @desc    Verify OTP and activate user
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
   const { email, otp } = req.body;

   try {
      const user = await userModel.findOne({
         email,
         otp,
         otpExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP or OTP has expired.",
         });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
         success: true,
         message: "OTP verified successfully.",
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
         },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during OTP verification.",
      });
   }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await userModel.findOne({ email });

      if (!user)
         return res
            .status(401)
            .json({ success: false, message: "Invalid email or password." });

      if (!user.isVerified)
         return res
            .status(400)
            .json({ success: false, message: "User not verified." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
         return res
            .status(401)
            .json({ success: false, message: "Invalid email or password." });

      const token = generateToken(user._id);

      res.status(200).json({
         success: true,
         message: "Login successful",
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
         },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during login.",
      });
   }
};

// @desc    Forgot password (send OTP)
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await userModel.findOne({ email, isVerified: true });
      if (!user) {
         return res
            .status(404)
            .json({
               success: false,
               message: "No verified user found with this email.",
            });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      const message = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;
      await sendEmail({
         email: user.email,
         subject: "Password Reset OTP",
         message,
      });

      res.status(200).json({
         success: true,
         message: "OTP for password reset sent to your email.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during forgot password process.",
      });
   }
};

// @desc    Reset password using OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
   const { email, otp, newPassword } = req.body;

   try {
      const user = await userModel.findOne({
         email,
         otp,
         otpExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res
            .status(400)
            .json({
               success: false,
               message: "Invalid OTP or OTP has expired.",
            });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.status(200).json({
         success: true,
         message: "Password has been reset successfully. Please login.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during password reset.",
      });
   }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
   try {
      const user = await userModel.findById(req.user.id).select("-password");
      if (!user)
         return res
            .status(404)
            .json({ success: false, message: "User not found" });

      res.status(200).json({ success: true, user });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error while fetching profile",
      });
   }
};
