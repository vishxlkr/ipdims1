import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import submissionModel from "../models/submissionModel.js";
import reviewerModel from "../models/reviewerModel.js";
import validator from "validator";

const addDoctor = async (req, res) => {
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

      const imageFile = req.file;

      // checking for all data to add doctor
      if (
         !name ||
         !email ||
         !password ||
         !speciality ||
         !degree ||
         !experience ||
         !about ||
         !fees ||
         !address
      ) {
         return res.json({ success: false, message: "Missing Details" });
      }

      // validating email format
      if (!validator.isEmail(email)) {
         return res.json({
            success: false,
            message: "Please enter a valid email",
         });
      }

      // validating strong password
      if (password.length < 8) {
         return res.json({
            success: false,
            message: "Please must be atleast 8 characters long",
         });
      }

      // hashing doctor password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
         resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      const reviewerData = {
         name,
         email,
         image: imageUrl,
         password: hashedPassword,
         //add all data here
      };

      const newReviewer = new reviewerModel(reviewerData);
      await newReviewer.save();

      res.json({ success: true, message: "Reviewer Added" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
};
