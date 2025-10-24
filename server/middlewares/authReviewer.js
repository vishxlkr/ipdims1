// import jwt from "jsonwebtoken";
// import reviewerModel from "../models/reviewerModel.js";

// export const authReviewer = async (req, res, next) => {
//    try {
//       const authHeader = req.headers.authorization;

//       if (!authHeader || !authHeader.startsWith("Bearer ")) {
//          return res
//             .status(401)
//             .json({ success: false, message: "No token provided" });
//       }

//       const token = authHeader.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       if (!decoded || decoded.role !== "reviewer") {
//          return res
//             .status(403)
//             .json({ success: false, message: "Unauthorized access" });
//       }

//       const reviewer = await reviewerModel
//          .findById(decoded.id)
//          .select("-password");

//       if (!reviewer) {
//          return res
//             .status(404)
//             .json({ success: false, message: "Reviewer not found" });
//       }

//       req.user = { id: reviewer._id, role: "reviewer" };

//       next();
//    } catch (error) {
//       return res.status(401).json({
//          success: false,
//          message: "Invalid token",
//          error,
//       });
//    }
// };
import jwt from "jsonwebtoken";
import reviewerModel from "../models/reviewerModel.js";

export const authReviewer = async (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer token
      if (!token)
         return res
            .status(401)
            .json({ success: false, message: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const reviewer = await reviewerModel.findById(decoded.id);
      if (!reviewer)
         return res
            .status(401)
            .json({ success: false, message: "Reviewer not found" });

      req.user = { id: reviewer._id, role: "reviewer" };
      next();
   } catch (error) {
      res.status(401).json({
         success: false,
         message: "Unauthorized",
         error: error.message,
      });
   }
};
