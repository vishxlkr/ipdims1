import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import sendEmail from "../config/email.js";

// Generate 6-digit OTP
const generateOTP = () =>
   Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT token
const generateToken = (id) =>
   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ======================= SIGNUP =======================
export const signup = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({
            success: false,
            message: "Name, email, and password are required.",
         });
      }

      let user = await userModel.findOne({ email });

      if (user && user.isVerified) {
         return res.status(400).json({
            success: false,
            message: "User with this email already exists.",
         });
      }

      const otp = generateOTP();
      const otpExpires = Date.now() + 10 * 60 * 1000;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user) {
         user.name = name;
         user.password = hashedPassword;
         user.otp = otp;
         user.otpExpires = otpExpires;
         user.isVerified = false;
         await user.save();
      } else {
         user = new userModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
         });
         await user.save();
      }

      // Send OTP email
      const message = `Your OTP for registration is: ${otp}. It expires in 10 minutes.`;
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

// ======================= VERIFY OTP =======================
export const verifyOtp = async (req, res) => {
   try {
      const { email, otp } = req.body;

      if (!email || !otp) {
         return res.status(400).json({
            success: false,
            message: "Email and OTP are required.",
         });
      }

      const user = await userModel.findOne({
         email,
         otp: otp.toString(),
         otpExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP or OTP expired.",
         });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = generateToken(user._id);

      res.status(200).json({
         success: true,
         message: "OTP verified successfully.",
         user: { _id: user._id, name: user.name, email: user.email, token },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during OTP verification.",
      });
   }
};

// ======================= LOGIN =======================
export const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
            success: false,
            message: "Email and password are required.",
         });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
         return res.status(401).json({
            success: false,
            message: "Invalid email or password.",
         });
      }

      if (!user.isVerified) {
         return res.status(400).json({
            success: false,
            message: "User not verified.",
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({
            success: false,
            message: "Invalid email or password.",
         });
      }

      const token = generateToken(user._id);

      res.status(200).json({
         success: true,
         message: "Login successful",
         user: { _id: user._id, name: user.name, email: user.email, token },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during login.",
      });
   }
};

// ======================= FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required.",
         });
      }

      const user = await userModel.findOne({ email, isVerified: true });
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "No verified user found with this email.",
         });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      const message = `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`;
      await sendEmail({
         email: user.email,
         subject: "Password Reset OTP",
         message,
      });

      res.status(200).json({
         success: true,
         message: "OTP sent for password reset.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during forgot password.",
      });
   }
};

// ======================= RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
   try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
         return res.status(400).json({
            success: false,
            message: "Email, OTP, and new password are required.",
         });
      }

      const user = await userModel.findOne({
         email,
         otp,
         otpExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP or OTP expired.",
         });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.status(200).json({
         success: true,
         message: "Password reset successfully.",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error during password reset.",
      });
   }
};

// ======================= GET PROFILE =======================
export const getProfile = async (req, res) => {
   try {
      // req.user must be set by auth middleware
      const user = await userModel.findById(req.user.id).select("-password");
      if (!user) {
         return res
            .status(404)
            .json({ success: false, message: "User not found." });
      }
      res.status(200).json({ success: true, user });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching profile.",
      });
   }
};


git quick
git quickgit quickgit quickgit quickgit quickgit quickgit quickgit quick
git quickgit quickgit quickgit quickgit quick