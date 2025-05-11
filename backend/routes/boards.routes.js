import express from "express";
import {
  createBoard,
  getBoard,
  updateTaskOrder,
  deleteBoard,
  addTaskToBoard,
  updateBoard,
} from "../controllers/boards.controllers.js";
import { authUser } from "../middlewares/users.middlewares.js";

const router = express.Router();

router.post("/", authUser, createBoard);

router.get("/:id", authUser, getBoard);

router.put("/:id", authUser, updateBoard);

router.delete(":id", authUser, deleteBoard);

router.post("/:id/tasks", authUser, addTaskToBoard);

export { router };
