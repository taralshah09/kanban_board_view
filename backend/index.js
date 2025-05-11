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
const io = new Server(server, {
  cors: {
    origin: "https://kanban-board-view-backend.onrender.com/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log("Error : ", err.message));
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


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

server.listen(PORT, () => console.log("Server running on PORT : " + PORT));
