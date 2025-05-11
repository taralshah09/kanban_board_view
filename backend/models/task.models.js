import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: [String],
    default: "",
  },
  markAsDone: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "",
  },
});

export const Task = mongoose.model("Task", taskSchema);
