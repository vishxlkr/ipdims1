import reviewerModel from "../models/reviewerModel.js";
import submissionModel from "../models/submissionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// api to login reviewer
export const loginReviewer = async (req, res) => {
   try {
      const { email, password } = req.body;
      const reviewer = await reviewerModel.findOne({ email });
      if (!reviewer)
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });

      const isMatch = await bcrypt.compare(password, reviewer.password);
      if (!isMatch)
         return res
            .status(400)
            .json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign(
         { id: reviewer._id, role: "reviewer" },
         process.env.JWT_SECRET,
         { expiresIn: "7d" }
      );
      res.json({ success: true, token, reviewer });
   } catch (error) {
      res.status(500).json({ success: false, message: "Login failed", error });
   }
};

// api to get reviewer profile
export const getReviewerProfile = async (req, res) => {
   try {
      const reviewer = await reviewerModel
         .findById(req.user.id)
         .select("-password");
      if (!reviewer) {
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });
      }

      res.json({ success: true, reviewer });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Failed to fetch profile",
         error,
      });
   }
};

// api to update reviewer profile
export const updateReviewerProfile = async (req, res) => {
   try {
      const reviewerId = req.user.id;
      const { name, affiliation, phone } = req.body;

      const updatedReviewer = await reviewerModel
         .findByIdAndUpdate(
            reviewerId,
            {
               $set: {
                  ...(name && { name }),
                  ...(affiliation && { affiliation }),
                  ...(phone && { phone }),
               },
            },
            { new: true, runValidators: true }
         )
         .select("-password");

      if (!updatedReviewer) {
         return res
            .status(404)
            .json({ success: false, message: "Reviewer not found" });
      }

      res.json({
         success: true,
         message: "Profile updated successfully",
         reviewer: updatedReviewer,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Failed to update profile",
         error,
      });
   }
};
