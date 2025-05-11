import { configDotenv } from "dotenv";
configDotenv();
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log("Middleware : ", token);

    if (!token) {
      return res.status(400).json({ message: "User not authenticated" }); // Ensure response sent once
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Send response and stop here
    }

    req.user = user;
    next(); // Proceed only if no response was sent
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while authorising the user",
      error: error.message,
    });
  }
};
