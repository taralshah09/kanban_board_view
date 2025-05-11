import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ConversationHome = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("Kanban"))
    const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [enteredPassword, setEnteredPassword] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for create modal
    const [newConversation, setNewConversation] = useState({
        title: '',
        access_code: '',
        password: '',
        boards: [],
        users: [],
        createdBy: loggedInUser._id,
    });

    const navigate = useNavigate();

    // Function to open modal and set selected conversation
    const openModal = (conversation) => {
        setSelectedConversation(conversation);
        setEnteredPassword(''); // Reset entered password each time modal opens
        setIsModalOpen(true);
    };

    // Function to handle password verification
    const handlePasswordSubmit = () => {
        if (enteredPassword === selectedConversation.password) {
            setIsModalOpen(false); // Close modal
            navigate(`/conversation/${selectedConversation._id}`); // Redirect to the conversation page
        } else {
            alert("Incorrect password");
        }
    };

    // Function to fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get("http://localhost:3000/conversations", { withCredentials: true });
                setConversations(res.data.conversations);
                setFilteredConversations(res.data.conversations);
            } catch (error) {
                alert("Error fetching conversations: " + error.message);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        const filtered = conversations.filter(conversation =>
            conversation.title.toLowerCase().includes(search.toLowerCase()) ||
            conversation.access_code?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredConversations(filtered);
    }, [search, conversations]);

    // Function to open create conversation modal
    const openCreateModal = () => {
        setNewConversation({
            title: '',
            access_code: '',
            password: '',
            boards: [],
            users: [],
            createdBy: loggedInUser._id,
        });
        setIsCreateModalOpen(true);
    };

    // Function to handle create conversation submission
    const handleCreateSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:3000/conversations", newConversation, { withCredentials: true });
            setConversations([...conversations, res.data]);
            setFilteredConversations([...filteredConversations, res.data]);
            setIsCreateModalOpen(false); // Close modal after creation
            alert("Conversation created successfully");
        } catch (error) {
            alert("Error creating conversation: " + error.message);
        }
    };

    return (
        // <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#121212] px-4">
        <div className="min-h-[calc(100vh-50px)] w-full flex flex-col items-center justify-center bg-[#121212] px-4 py-10">
            <div className="w-full max-w-2xl">
                <div className="flex flex-col w-full p-6 bg-[#1E1E2F] text-white shadow-2xl rounded-2xl backdrop-blur-sm animate-fadeIn space-y-6">
                    <h1 className="text-2xl font-semibold text-blue-500">Enter Access Code or Title</h1>
                    <div className="flex flex-col sm:flex-row w-full items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <input
                            type="text"
                            placeholder="Enter the conversation access code or title"
                            className="flex-1 px-4 py-2 rounded-md bg-[#2C2C3A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                        >
                            Create New 
                        </button>
                    </div>
                </div>


                <div className="w-full mt-8 p-6 bg-[#1E1E2F] shadow-lg rounded-xl overflow-y-auto max-h-[400px] border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Similar Conversations</h2>
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation._id}
                                onClick={() => openModal(conversation)}
                                className="cursor-pointer p-4 bg-[#2A2A3B] border border-gray-600 rounded-lg mb-3 hover:bg-[#33334a] transition-all"
                            >
                                <h3 className="text-lg font-medium text-blue-400">{conversation.title}</h3>
                                <p className="text-sm text-gray-400">{conversation.access_code}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No conversations found</p>
                    )}
                </div>

            </div>

            {/* Password Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-[#1F1F1F] p-6 rounded-lg shadow-2xl w-80 text-white">
                        <h3 className="text-lg font-semibold mb-4">Enter Access Code</h3>
                        <input
                            type="password"
                            placeholder="Access code"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            className="w-full mb-4 p-2 rounded bg-[#2C2C3A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Conversation Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-[#1F1F1F] p-6 rounded-lg shadow-2xl w-80 text-white">
                        <h3 className="text-lg font-semibold mb-4">Create New Conversation</h3>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newConversation.title}
                            onChange={(e) => setNewConversation({ ...newConversation, title: e.target.value })}
                            className="w-full mb-3 p-2 rounded bg-[#2C2C3A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            placeholder="Access Code"
                            value={newConversation.access_code}
                            onChange={(e) => setNewConversation({ ...newConversation, access_code: e.target.value })}
                            className="w-full mb-3 p-2 rounded bg-[#2C2C3A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newConversation.password}
                            onChange={(e) => setNewConversation({ ...newConversation, password: e.target.value })}
                            className="w-full mb-4 p-2 rounded bg-[#2C2C3A] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSubmit}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default ConversationHome;
