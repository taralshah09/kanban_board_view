import express from "express";
import {
  createConversation,
  getConversation,
  updateConversation,
  deleteConversation,
  getAllConversation,
  addBoardInconversation,
  updateBoardInConversation,
  deleteBoardFromConversation,
  deleteTask,
  addUserInConversation,
} from "../controllers/conversation.controllers.js";
import { authUser } from "../middlewares/users.middlewares.js";

const router = express.Router();

router.post("/", authUser, createConversation);

router.get("/", getAllConversation);

router.get("/:id", authUser, getConversation);

router.put("/:id", authUser, updateConversation);

router.delete("/:id", authUser, deleteConversation);

router.post("/:id/boards", addBoardInconversation);

router.patch("/:conversationId/boards/:boardId", updateBoardInConversation);

router.delete("/:id/boards/:boardId", deleteBoardFromConversation);

// router.delete("/:conversationId/boards/:boardId/tasks/:taskId", deleteTask);

router.patch("/:id", addUserInConversation);

export { router };
