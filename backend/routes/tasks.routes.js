import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/tasks.controllers.js";
import { authUser } from "../middlewares/users.middlewares.js";
const router = express.Router();

router.get("/all", getAllTasks);
// router.get("/all", authUser, getAllTasks);
router.get("/:id", getTask);
// router.get("/:id", authUser, getTask);
router.post("/create", createTask);
// router.post("/create", authUser, createTask);
router.delete("/:id", deleteTask);
// router.delete("/:id", authUser, deleteTask);
router.put("/:id", updateTask);
// router.put("/:taskId/move", moveTask);

export { router };
