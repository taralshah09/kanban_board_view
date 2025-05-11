import { Board } from "../models/board.models.js";
import { Conversation } from "../models/conversation.models.js";
import { Task } from "../models/task.models.js";

export const createConversation = async (req, res) => {
  try {
    const { access_code, password, boards, users, createdBy, title } = req.body;
    const conversation = new Conversation({
      access_code,
      password,
      boards,
      users,
      createdBy,
      title,
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate({
        path: "boards",
        populate: {
          path: "tasks",
          model: "Task",
        },
      })
      .populate("users")
      .populate("createdBy");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const updateConversation = async (req, res) => {
//   try {
//     const { access_code, password, boards, users, title } = req.body;
//     const conversation = await Conversation.findByIdAndUpdate(
//       req.params.id,
//       { access_code, password, boards, users, title },
//       { new: true }
//     );
//     if (!conversation) {
//       return res.status(404).json({ message: "Conversation not found" });
//     }
//     res.json(conversation);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateConversation = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      id,
      updatedData
    );
    console.log(updatedConversation);
    res.status(200).json(updatedConversation);
  } catch (error) {
    res.status(500).json({ message: "Error updating conversation", error });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllConversation = async (req, res) => {
  try {
    const conversations = await Conversation.find();

    if (!conversations) {
      return res
        .status(400)
        .json({ message: "Unable to fetch the conversations" });
    }

    return res.status(200).json({
      message: "All the conversations are fetched successfully!",
      conversations: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong, unable to fetch all the converations",
      error: error.message,
    });
  }
};

export const addBoardInconversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Create a new board
    const newBoard = new Board({ title });
    await newBoard.save();

    // Add the board to the conversation
    const conversation = await Conversation.findById(id);
    conversation.boards.push(newBoard._id);
    await conversation.save();

    res.status(201).json(newBoard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add board", error: error.message });
  }
};

export const updateBoardInConversation = async (req, res) => {
  try {
    const { conversationId, boardId } = req.params;
    const { title } = req.body;

    // Find and update the board
    const board = await Board.findByIdAndUpdate(
      boardId,
      { title },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: "Failed to update board", error });
  }
};

export const deleteBoardFromConversation = async (req, res) => {
  const { id, boardId } = req.params;

  try {
    // Find the conversation and remove the board from its boards array
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Remove the board from the conversation's boards array
    conversation.boards = conversation.boards.filter(
      (board) => board.toString() !== boardId
    );

    // Save the updated conversation
    await conversation.save();

    res
      .status(200)
      .json({ message: "Board deleted successfully", conversation });
  } catch (error) {
    console.error("Error deleting board from conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete a task
export const deleteTask = async (req, res) => {
  // const { conversationId, boardId, taskId } = req.params;
  // try {
  //     // Step 1: Find the board by ID and remove the task from the tasks array
  //     const board = await Board.findById({boardId});
  //     if (!board) {
  //         return res.status(404).json({ error: 'Board not found' });
  //     }
  //     // Remove the task from the board's tasks array
  //     board.tasks = board.tasks.filter((task) => task.toString() !== taskId);
  //     await board.save();
  //     // Step 2: Find the conversation and update the boards array
  //     const conversation = await Conversation.findById(conversationId).populate('boards');
  //     if (!conversation) {
  //         return res.status(404).json({ error: 'Conversation not found' });
  //     }
  //     // Update the conversation's boards array to ensure it reflects the updated board
  //     conversation.boards = conversation.boards.map((b) => (b._id.toString() === boardId ? board : b));
  //     await conversation.save();
  //     // Send success response
  //     res.status(200).json({ message: 'Task deleted successfully', conversation });
  // } catch (error) {
  //     console.error('Error deleting task:', error);
  //     res.status(500).json({ error: 'Failed to delete task' });
  // }
};

export const addUserInConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ message: "No such conversation found!" });
    }

    conversation.users.push(user._id);
    await conversation.save();

    return res
      .status(200)
      .json({ message: "User added successfully to the conversation" });
  } catch (error) {
    console.error("Error adding user in the conversation :", error.message);
    res.status(500).json({ error: "Failed to add user in the conversation" });
  }
};
