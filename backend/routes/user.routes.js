import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  fetchAllUsers,
} from "../controllers/users.controllers.js";
import { authUser } from "../middlewares/users.middlewares.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "USer route!" });
});

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout",  logoutUser);
router.get("/all", fetchAllUsers);

export { router };
