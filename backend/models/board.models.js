import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

export const Board = mongoose.model("Board", boardSchema);
