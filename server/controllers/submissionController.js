import submissionModel from "../models/submissionModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import sendEmail from "../config/email.js";

// 🟢 Create a new submission
export const newSubmission = async (req, res) => {
   try {
      const { title, description, keywords, eventName } = req.body;
      const file = req.file; // uploaded file
      const userId = req.user.id; // comes from auth middleware

      // ✅ Validate required fields
      if (!title || !description || !keywords) {
         return res.json({
            success: false,
            message: "Missing required fields",
         });
      }

      // ✅ Find user from DB
      const user = await userModel.findById(userId);
      if (!user) {
         return res.json({ success: false, message: "User not found" });
      }

      // ✅ Upload file to Cloudinary (v2)
      let fileUrl = "";
      if (file) {
         const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "submissions",
         });
         fileUrl = uploadResult.secure_url;
      }

      // ✅ Create submission data
      const submissionData = {
         title,
         description,
         keywords: keywords.split(",").map((k) => k.trim()),
         author: userId,
         authorName: user.name,
         authorEmail: user.email,
         authorAffiliation: user.organization || "",
         attachment: fileUrl,
         eventName: eventName || `IPDIMS ${new Date().getFullYear()}`,
      };

      // ✅ Save to MongoDB
      const newSubmissionDoc = new submissionModel(submissionData);
      await newSubmissionDoc.save();

      // ✅ Send email notification to admin
      const adminEmail = process.env.ADMIN_EMAIL; // from .env
      const emailSubject = `New Submission by ${user.name}`;
      const emailMessage = `
Hello Admin,

A new submission has been added by a user. Here are the details:

- Name: ${user.name}
- Email: ${user.email}
- Affiliation: ${user.organization || "N/A"}
- Submission Title: ${title}
- Description: ${description}
- Keywords: ${keywords}
- Event: ${submissionData.eventName}
- Attachment: ${fileUrl ? fileUrl : "No attachment"}

Please review the submission in the admin panel.

Thanks,
Your Application
      `;

      await sendEmail({
         email: adminEmail,
         subject: emailSubject,
         message: emailMessage,
      });

      res.json({
         success: true,
         message: "Submission added successfully and admin notified",
         submission: newSubmissionDoc,
      });
   } catch (error) {
      console.error("Error in addSubmission:", error);
      res.json({ success: false, message: error.message });
   }
};

// 🟡 Get all submissions of logged-in user
export const getUserSubmissions = async (req, res) => {
   try {
      const userId = req.user.id;

      if (!userId) {
         return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
      }

      const submissions = await submissionModel
         .find({ author: userId })
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         submissions,
      });
   } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ success: false, message: "Server error" });
   }
};
