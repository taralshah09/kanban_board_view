import { createAndSaveToken } from "../jwt/auth.jwt.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = await createAndSaveToken(newUser._id, res);
    console.log("Generated Token:", token);

    return res.status(200).json({
      message: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("Error in createUser:", error.message);
    return res.status(500).json({
      message: "Something went wrong, unable to register the new user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = await createAndSaveToken(user._id, res);
      return res
        .status(200)
        .json({ message: "User logged-in successfully", user: user });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to log the user in",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to log the user out",
      error: error.message,
    });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(400).json({ message: "All users not found!" });
    }

    return res
      .status(200)
      .json({ message: "All users are fetched successfully", users: users });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to fetch all the users",
      error: error.message,
    });
  }
};
