import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import allRoute from "./routes/allRoute.js";
import userRoute from "./routes/userRoute.js";
import healthRoute from "./routes/health.js"
import versionRoute from "./routes/versionRoutes.js"
import dotenv from 'dotenv';
dotenv.config();





const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: "booksDB",
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB error:", err);
});

// Routes
app.use("/api", allRoute);
app.use("/user", userRoute);
app.use("/", healthRoute);
app.use('/', versionRoute)



// In your Express backend


// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});

