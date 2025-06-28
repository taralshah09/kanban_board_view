import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const TaskPage = () => {
    const { taskId, conversationId } = useParams();
    const [task, setTask] = useState({
        title: '',
        description: '',
        assignedTo: [],
        markAsDone: false,
    });
    const [newAssignedTo, setNewAssignedTo] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { conversation } = location.state;
    let url = import.meta.env.VITE_BACKEND_URL || "https://kanban-board-view-backend.onrender.com/";

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(url + `tasks/${taskId}`, { withCredentials: true });
                setTask({
                    ...res.data.task,
                    assignedTo: Array.isArray(res.data.task.assignedTo) ? res.data.task.assignedTo.flat() : [],
                });
            } catch (error) {
                console.log("Error: " + error.message);
            }
        };
        fetchTask();
    }, [taskId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({
            ...prev,
            [name]: name === 'markAsDone' ? e.target.checked : value,
        }));
    };


    const handleAddAssignee = () => {
        if (newAssignedTo.trim()) {
            setTask((prev) => ({
                ...prev,
                assignedTo: [...prev.assignedTo, newAssignedTo.trim()], // Ensure no nesting and trim the value
            }));
            setNewAssignedTo("");
        }
    };

    const handleUpdateTask = async () => {
        try {
            console.log("Updating task:", task);  // Log to verify task state
            await axios.put(url + `tasks/${taskId}`, task, { withCredentials: true });
            alert("Task updated successfully!");
            navigate(`/conversation/${conversationId}`);
        } catch (error) {
            console.log("Error updating task: " + error.message);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(url + `tasks/${taskId}`, { withCredentials: true });
            alert("Task deleted successfully!");
            navigate(`/conversation/${conversationId}`);
        } catch (error) {
            console.log("Error deleting task: " + error.message);
        }
    };

    const handleDescriptionChange = (value) => {
        setTask((prev) => ({
            ...prev,
            description: value,
        }));
    };

    return (
        <div className='w-full min-h-[90vh] flex items-center justify-center bg-[#0d1117] text-white'>
            <div className="relative w-[70%] min-h-[400px] mx-auto p-6 bg-[#161b22] shadow-2xl rounded-lg mt-8">
                <div className='absolute right-6'>
                    <Link className='text-[#58a6ff] hover:underline' to={`/conversation/${conversationId}`}>
                        Back to conversation
                    </Link>
                </div>

                <label className="block mb-4">
                    <span className="text-gray-300">Title:</span>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleInputChange}
                        className="bg-[#0d1117] text-white mt-1 block w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-300">Description:</span>
                    <ReactQuill
                        value={task.description}
                        onChange={handleDescriptionChange}
                        className="bg-white text-black mt-1 block w-full rounded-md"
                        theme="snow"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-300">Assigned To:</span>
                    <ul className="mt-1 mb-2 list-disc pl-5">
                        {task.assignedTo.map((person, index) => (
                            <li key={index} className="text-gray-300">{person}</li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newAssignedTo}
                            onChange={(e) => setNewAssignedTo(e.target.value)}
                            placeholder="Add assignee"
                            className="bg-[#0d1117] text-white flex-1 px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddAssignee}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </label>

                <label className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        name="markAsDone"
                        checked={task.markAsDone}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-500 bg-[#0d1117] border-gray-700 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Mark as Done</span>
                </label>

                <div className="flex gap-4">
                    <button
                        onClick={handleUpdateTask}
                        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Update Task
                    </button>
                    <button
                        onClick={handleDeleteTask}
                        className="w-[20%] py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                    >
                        Delete Task
                    </button>
                </div>
            </div>
        </div>

    );
};

export default TaskPage;
