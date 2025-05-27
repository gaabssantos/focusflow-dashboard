import express from "express";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import { taskRoutes } from "./routes/task.route";
import cors from "cors";
import profileRoutes from "./routes/profile.route";

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes);

export default app;
