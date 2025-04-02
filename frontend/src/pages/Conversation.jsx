import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth } from '../context/AuthProvider';
import { socket } from '../App';

const Conversation = () => {
    const { id } = useParams();
    const [conversation, setConversation] = useState();
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [hoveredBoard, setHoveredBoard] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [editingBoardId, setEditingBoardId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [board, setBoard] = useState({})
    const [hoveredTask, setHoveredTask] = useState(null); // Track hovered task ID
    const [users, setUsers] = useState([])
    const [searchUser, setSearchUser] = useState("")
    const [authUser, setAuthUser] = useAuth()

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/conversations/${id}`, { withCredentials: true });
                setConversation(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchConversation();

    }, [id]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:3000/users/all");
                const usersArray = res.data.users;

                // Filter out users who are not already in the conversation's users array
                const filteredUsers = usersArray.filter(user =>
                    user._id !== conversation.createdBy._id &&
                    !conversation.users.some(convoUser => convoUser._id === user._id)
                );

                // Update state with filtered users
                setUsers(filteredUsers);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchUsers();
    }, [conversation, conversation?.users]);




    const handleAddBoard = async (e) => {
        e.preventDefault();
        if (newBoardTitle) {
            try {
                const res = await axios.post(`http://localhost:3000/conversations/${id}/boards`, { title: newBoardTitle }, { withCredentials: true });
                setConversation((prev) => ({ ...prev, boards: [...prev.boards, res.data] }));
                setNewBoardTitle('');
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleAddTask = async (e, boardId) => {
        e.preventDefault();
        if (newTaskTitle && boardId) {
            try {
                const res = await axios.post(`http://localhost:3000/boards/${boardId}/tasks`, { title: newTaskTitle }, { withCredentials: true });
                console.log('Task creation response:', res.data);
                // setConversation((prev) => ({
                //     ...prev,
                //     boards: prev.boards.map((board) =>
                //         board._id === boardId ? { ...board, tasks: [...board.tasks, res.data] } : board
                //     ),
                // }));
                setConversation((prev) => ({
                    ...prev,
                    boards: prev.boards.map((board) =>
                        board._id === boardId ? { ...board, tasks: [...board.tasks, res.data.task || res.data] } : board
                    ),
                }));

                setNewTaskTitle('');
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceBoardId = source.droppableId;
        const destBoardId = destination.droppableId;

        const sourceBoard = conversation.boards.find(board => board._id === sourceBoardId);
        const destBoard = conversation.boards.find(board => board._id === destBoardId);

        const [movedTask] = sourceBoard.tasks.splice(source.index, 1);

        // Update board tasks locally
        if (sourceBoardId === destBoardId) {
            sourceBoard.tasks.splice(destination.index, 0, movedTask);
        } else {
            destBoard.tasks.splice(destination.index, 0, movedTask);
        }

        // Update local state
        setConversation({ ...conversation });

        try {
            // Update source and destination boards in the backend
            await axios.put(`http://localhost:3000/boards/${sourceBoardId}`, { tasks: sourceBoard.tasks }, { withCredentials: true });
            if (sourceBoardId !== destBoardId) {
                await axios.put(`http://localhost:3000/boards/${destBoardId}`, { tasks: destBoard.tasks }, { withCredentials: true });
            }

            // After updating boards, update the conversation to make sure all references are intact
            await axios.put(`http://localhost:3000/conversations/${conversation._id}`, { boards: conversation.boards }, { withCredentials: true });
        } catch (error) {
            console.error("Error updating boards and conversation:", error.message);
        }
    };

    const handleIconClick = (boardId) => {
        setDropdownOpen(dropdownOpen === boardId ? null : boardId);
    };

    const handleEditClick = (boardId, currentTitle) => {
        setEditingBoardId(boardId);
        setEditedTitle(currentTitle);
        setDropdownOpen(null); // Close the dropdown
    };

    const handleSaveEdit = async (boardId) => {
        try {
            // Update the board title in the conversation locally first
            const updatedConversation = {
                ...conversation,
                boards: conversation.boards.map((board) =>
                    board._id === boardId ? { ...board, title: editedTitle } : board
                ),
            };

            // Optimistically update the state
            setConversation(updatedConversation);
            setEditingBoardId(null);

            // Update the board title in the backend
            await axios.put(`http://localhost:3000/boards/${boardId}`, { title: editedTitle, tasks: board.tasks }, { withCredentials: true });

            // After updating the board, update the conversation in the backend
            await axios.put(`http://localhost:3000/conversations/${conversation._id}`, { boards: updatedConversation.boards }, { withCredentials: true });

        } catch (error) {
            console.error('Error updating board title:', error);
        }
    };

    const handleDeleteBoard = async (boardId) => {
        try {
            // Remove the board locally first
            const updatedConversation = {
                ...conversation,
                boards: conversation.boards.filter((board) => board._id !== boardId),
            };
            setConversation(updatedConversation);

            // Send request to the backend to delete the board
            await axios.delete(`http://localhost:3000/conversations/${conversation._id}/boards/${boardId}`, { withCredentials: true });

        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    const handleAddUser = async (user) => {
        console.log("Added user : " + user._id)
        try {
            const res = await axios.patch(`http://localhost:3000/conversations/${id}`, { user }, { withCredentials: true })
            console.log(res.data.message)
        } catch (error) {
            console.log("Error in adding user to the conversation : " + error.message)
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-white">
            <div className="w-[70%] h-auto flex-col border shadow-md rounded-lg p-5 text-black">
                <div className='flex items-center justify-between'>
                    <div className='flex-col'>
                        <h1 className="text-2xl font-bold">{conversation?.title}</h1>
                        <p className="text-gray-600">Access Code: {conversation?.access_code}</p>
                    </div>
                    <button className="px-5 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600" onClick={() => document.getElementById('my_modal_2').showModal()}>Add Members</button>
                    <dialog id="my_modal_2" className="modal">
                        <div className="modal-box bg-white shadow-2xl">
                            <h3 className="font-bold text-lg mb-4">Add Members to this Conversation:</h3>

                            <input
                                type="text"
                                className="bg-gray-100 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter the username or email"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                            />

                            <div className="w-full h-auto max-h-60 overflow-y-auto">
                                {users
                                    .filter((user) =>
                                        user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                                        user.email.toLowerCase().includes(searchUser.toLowerCase())
                                    )
                                    .map((user) => (
                                        <div key={user._id} className="flex items-center p-2 hover:bg-gray-200 transition rounded-lg">
                                            <img src={"../images/user-image.png"} alt="User" className="w-8 h-8 rounded-full mr-3" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-700">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <button
                                                className="text-blue-500 font-semibold text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-blue-100 transition"
                                                onClick={() => handleAddUser(user)}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                            <span className='text-center text-sm  text-gray-400'> Press Esc to close the modal</span>
                        </div>

                    </dialog>


                </div>

                <form className="mt-5">
                    <input
                        type="text"
                        placeholder="New board title"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        className="border p-2 rounded w-full mb-3 shadow-md bg-white"
                    />
                    <button type="submit" onClick={handleAddBoard} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Board
                    </button>
                </form>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="w-full flex overflow-x-auto gap-3 mt-7">
                        {conversation?.boards?.map((board) => (
                            <Droppable key={board._id} droppableId={board._id}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-shrink-0 border rounded-lg p-4 shadow-sm w-80 relative"
                                        onMouseEnter={() => {
                                            setHoveredBoard(board._id);
                                            setDropdownOpen(null);
                                        }}
                                        onMouseLeave={() => setHoveredBoard(null)}
                                    >
                                        <div className="flex justify-between items-center">
                                            {editingBoardId === board._id ? (
                                                <input
                                                    type="text"
                                                    value={editedTitle}
                                                    onChange={(e) => setEditedTitle(e.target.value)}
                                                    className="border p-1 rounded w-full bg-white"
                                                />
                                            ) : (
                                                <h2 className="text-xl font-semibold">{board.title}</h2>
                                            )}

                                            {hoveredBoard === board._id && (
                                                <i
                                                    className="fa-solid fa-ellipsis-vertical cursor-pointer"
                                                    onClick={() => handleIconClick(board._id)}
                                                ></i>
                                            )}
                                        </div>

                                        {dropdownOpen === board._id && (
                                            <div className="absolute right-4 top-10 bg-white border rounded shadow-lg z-10">
                                                <button
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => handleEditClick(board._id, board.title)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => handleDeleteBoard(board._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}

                                        {editingBoardId === board._id && (
                                            <button
                                                onClick={() => handleSaveEdit(board._id)}
                                                className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
                                            >
                                                Save
                                            </button>
                                        )}

                                        <form className="flex mt-3 gap-3" onSubmit={(e) => handleAddTask(e, board._id, board)}>
                                            <input
                                                type="text"
                                                placeholder="New task title"
                                                value={newTaskTitle}
                                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                                className="border p-2 rounded w-full bg-white"
                                            />
                                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 duration-200">
                                                Add
                                            </button>
                                        </form>



                                        <div className="flex flex-col gap-3 mt-3">
                                            {board.tasks.map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Link to={`/conversations/${id}/tasks/${task._id}`} state={{ conversation }}>
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="task border p-2 rounded bg-gray-100 flex justify-between items-center"
                                                                onMouseEnter={() => setHoveredTask(task._id)}
                                                                onMouseLeave={() => setHoveredTask(null)}
                                                            >
                                                                <p>{task.title}</p>

                                                            </div>
                                                        </Link>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>

                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>

    );
};

export default Conversation;
