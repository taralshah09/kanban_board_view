import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';


const Register = () => {
    const navigate = useNavigate();

    // State hooks for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authUser, setAuthUser] = useAuth()

    let url = import.meta.env.VITE_BACKEND_URL || "https://kanban-board-view-backend.onrender.com/";

    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = { name, email, password };  // Prepare data as a JSON object

        try {
            const response = await axios.post(
                url + "users/register",  // Make sure the URL is correct
                userData,  // Send data as JSON
                {
                    headers: {
                        "Content-Type": "application/json",  // Set proper header for JSON
                    },
                }
            );
            setAuthUser(response.data.user);
            localStorage.setItem("Kanban", JSON.stringify(response.data.user));

            console.log(response.data); // Log the response data if needed
            alert("User registered successfully!");

            // Reset form inputs
            setName("");
            setEmail("");
            setPassword("");

            navigate("/conversation-home");  // Redirect to login after successful registration
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <div className="w-full max-w-md bg-[#1E1E2F] text-white shadow-2xl rounded-2xl p-8 backdrop-blur-sm animate-fadeIn">
                <form onSubmit={handleRegister}>
                    <h2 className="text-3xl text-center font-extrabold mb-2">
                        Kanban<span className="text-blue-400">App</span>
                    </h2>
                    <h3 className="text-lg text-gray-300 mb-6 text-center">Register yourself</h3>

                    {/* Name Input */}
                    <div className="my-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 mb-4 rounded-md bg-[#2C2C3A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="my-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-4 rounded-md bg-[#2C2C3A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="my-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-4 rounded-md bg-[#2C2C3A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Password"
                        />
                    </div>

                    {/* Login Redirect */}
                    <p className="text-center mb-4">
                        Already registered?{'   '}
                        <Link to="/login" className="text-blue-400 hover:underline">
                            Login Now
                        </Link>
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-md text-white font-semibold"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
