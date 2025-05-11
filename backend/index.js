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
import http from "http";
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";

// ENV
const backend_url = process.env.BACKEND_URL;
const frontend_url = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000;

// Socket.io server with CORS for both local and deployed frontend
const io = new Server(server, {
  cors: {
    origin: [frontend_url, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

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

// // Optional: Add Access-Control-Allow-Credentials manually
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

// Socket.io listeners
io.on("connect", (socket) => {
  console.log("User connected : " + socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected : " + socket.id);
  });

  socket.on("newTask", (data, callback) => {
    try {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data received");
      }

      io.emit("taskAdded", data);
      console.log("New task received:", data);

      callback({ success: true, message: "Task added successfully" });
    } catch (error) {
      console.error("Error processing new task:", error.message);
      callback({ success: false, message: error.message });
    }
  });
});

// Routes
app.use("/users", userRouter);
app.use("/tasks", tasksRouter);
app.use("/boards", boardsRouter);
app.use("/conversations", conversationRouter);

// Server start
server.listen(PORT, () => console.log("Server running on PORT : " + PORT));
