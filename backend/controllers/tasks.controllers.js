import { Task } from "../models/task.models.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found!" });
    }
    return res
      .status(200)
      .json({ message: "All tasks fetched successfully!", tasks: tasks });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to fetch all the tasks!",
    });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id });
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }
    return res
      .status(200)
      .json({ message: "Task fetched successfully", task: task });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to fetch the task!",
    });
  }
};

export const createTask = async (req, res) => {
  const { title, description, assignedTo, markAsDone, createdBy } = req.body;
  try {
    const task = new Task({
      title,
      description,
      assignedTo,
      markAsDone,
      createdBy,
    });
    if (!task) {
      return res.status(400).json({ message: "Failed to create a new task!" });
    }
    await task.save();
    return res
      .status(200)
      .json({ message: "Task created successfully", task: task });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to create the task!",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }
    return res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong,unable to delete the task",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, assignedTo, markAsDone } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        assignedTo,
        markAsDone,
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

