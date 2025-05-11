import { Board } from "../models/board.models.js";
import { Task } from "../models/task.models.js";

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const board = new Board({ title });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate("tasks");
    res.status(200).json(board);
  } catch (error) {
    res.status(404).json({ message: "Board not found" });
  }
};

export const updateTaskOrder = async (req, res) => {
  try {
    const { taskIds } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    board.tasks = taskIds.filter((id) => id);
    await board.save();
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTaskToBoard = async (req, res) => {
  try {
    const { id } = req.params; // Board ID
    const { title } = req.body; // Task title
    const createdBy = req.user._id;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const newTask = new Task({ title, createdBy });
    await newTask.save();

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    board.tasks.push(newTask._id);
    await board.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error.message || error);
    
    res.status(500).json({
      message: "Failed to add task",
      error: error.message || error,
    });
  }
};

// // Update board tasks controller
// export const updateBoard = async (req, res) => {
//   const boardId  = req.params.id; // Get board ID from URL params
//   const { tasks } = req.body; // Get updated tasks array from request body

//   try {
//     // Find the board by ID and update the tasks array
//     const updatedBoard = await Board.findByIdAndUpdate(
//       boardId,
//       { tasks }, // Update the tasks field
//       { new: true } // Return the updated document
//     );

//     // Check if board exists
//     if (!updatedBoard) {
//       return res.status(404).json({ message: "Board not found" });
//     }

//     // Send back the updated board
//     res.status(200).json(updatedBoard);
//   } catch (error) {
//     console.error("Error updating board:", error);
//     res.status(500).json({ message: "Failed to update board tasks", error });
//   }
// };

export const updateBoard = async (req, res) => {
  const boardId = req.params.id;
  const { title, tasks } = req.body;

  try {
    // Find the board and update it
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { title, tasks },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(updatedBoard); // Send back the updated board
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
