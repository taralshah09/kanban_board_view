import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import mongoose from "mongoose";
import { router as userRouter } from "./routes/user.routes.js";
import { router as tasksRouter } from "./routes/tasks.routes.js";
import { router as boardsRouter } from "./routes/boards.routes.js";
import { router as conversationRouter } from "./routes/conversation.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ENV
const backend_url = process.env.BACKEND_URL;
const frontend_url = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("Error : ", err.message));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [frontend_url, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/users", userRouter);
app.use("/tasks", tasksRouter);
app.use("/boards", boardsRouter);
app.use("/conversations", conversationRouter);

// Server start
app.listen(PORT, () => console.log("Server running on PORT : " + PORT));
