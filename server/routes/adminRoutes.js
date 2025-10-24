import express from "express";

import upload from "../middlewares/multer.js";

import {
   addReviewer,
   getAllReviewers,
   getAllSubmissions,
   loginAdmin,
   updateReviewerStatus,
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post(
   "/add-reviewer",
   authAdmin,
   upload.single("image"),
   addReviewer
);

adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-reviewer", authAdmin, getAllReviewers);
adminRouter.post("/change-availability", authAdmin, updateReviewerStatus);
adminRouter.get("/submissions", authAdmin, getAllSubmissions);
// adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
// adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
