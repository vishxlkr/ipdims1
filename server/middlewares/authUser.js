import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
   try {
      const { token } = req.headers;

      if (!token) {
         return res.status(401).json({
            success: false,
            message: "Not authorized. Please login again.",
         });
      }

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
         return res.status(401).json({
            success: false,
            message: "Invalid token. Please login again.",
         });
      }

      // ✅ old style: attach directly to request
      req.userId = decoded.id;

      next();
   } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({
         success: false,
         message: "Authentication failed. " + error.message,
      });
   }
};

export default authUser;
