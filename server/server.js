import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// app config
const app = express();

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// api endpoint
// app.use("/api/admin", adminRouter);
// localhost:4000/api/admin/add-doctor

// app.use("/api/doctor", doctorRouter);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
   res.send("api working");
});

app.listen(port, () => {
   console.log("server started on port " + port);
});
