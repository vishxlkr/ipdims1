import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";
import reviewerModel from "../models/reviewerModel.js";
import validator from "validator";

export const addReviewer = async (req, res) => {
   try {
      const {
         name,
         email,
         phone,
         password,
         designation,
         organization,
         specialization,
         bio,
         address,
         gender,
         isActive,
      } = req.body;

      const imageFile = req.file; // optional

      // Mandatory fields
      if (!name || !email || !password) {
         return res.json({
            success: false,
            message: "Missing required fields",
         });
      }

      // Validate email
      if (!validator.isEmail(email)) {
         return res.json({
            success: false,
            message: "Please enter a valid email",
         });
      }

      // Validate password length
      if (password.length < 8) {
         return res.json({
            success: false,
            message: "Password must be at least 8 characters long",
         });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Upload image if provided
      let imageUrl = "";
      if (imageFile) {
         const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
         });
         imageUrl = uploadResult.secure_url;
      }

      // Handle specialization list
      const specializationList = specialization
         ? specialization.split(",").map((item) => item.trim())
         : [];

      // Create reviewer data
      const reviewerData = {
         name,
         email,
         phone,
         password: hashedPassword,
         designation,
         organization,
         specialization: specializationList,
         bio,
         address,
         gender,
         isActive,
         image: imageUrl,
      };

      const newReviewer = new reviewerModel(reviewerData);
      await newReviewer.save();

      res.json({ success: true, message: "Reviewer added successfully" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
};

// api for the admin login

export const loginAdmin = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (
         email === process.env.ADMIN_EMAIL &&
         password === process.env.ADMIN_PASSWORD
      ) {
         const token = jwt.sign(email + password, process.env.JWT_SECRET);
         res.json({ success: true, token });
      } else {
         res.json({ success: false, message: "Invalid credentials" });
      }

      console.log("admin loggedin");
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
};

// api to get all reviewer

export const allReviewers = async (req, res) => {
   try {
      const reviewers = await reviewerModel
         .find()
         .select("-password")
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         reviewers,
      });
   } catch (error) {
      console.error("Error fetching reviewers:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching reviewers",
      });
   }
};

// api to get all submission
export const getAllSubmissions = async (req, res) => {
   try {
      const submissions = await submissionModel
         .find()
         .sort({ createdAt: -1 }) // newest first
         .populate("author", "name email affiliation"); // optional, if author is referenced

      res.status(200).json({
         success: true,
         submissions,
      });
   } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({
         success: false,
         message: "Server error while fetching submissions",
      });
   }
};

// Admin: Update reviewer status (isActive)
export const updateReviewerStatus = async (req, res) => {
   try {
      const { reviewerId } = req.params; // reviewer ID from URL
      const { isActive } = req.body; // new status from request body

      if (typeof isActive !== "boolean") {
         return res.status(400).json({
            success: false,
            message: "isActive must be a boolean value",
         });
      }

      const reviewer = await reviewerModel.findById(reviewerId);
      if (!reviewer) {
         return res.status(404).json({
            success: false,
            message: "Reviewer not found",
         });
      }

      reviewer.isActive = isActive;
      await reviewer.save();

      res.status(200).json({
         success: true,
         message: `Reviewer ${
            isActive ? "activated" : "deactivated"
         } successfully`,
         reviewer,
      });
   } catch (error) {
      console.error("Error updating reviewer status:", error);
      res.status(500).json({
         success: false,
         message: "Server error while updating reviewer status",
      });
   }
};
