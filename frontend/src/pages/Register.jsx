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


    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = { name, email, password };  // Prepare data as a JSON object

        try {
            const response = await axios.post(
                "http://localhost:3000/users/register",  // Make sure the URL is correct
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
        <div className="min-h-screen w-[100%] flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md shadow-md bg-white p-5 rounded-md">
                <form onSubmit={handleRegister}>
                    <h2 className="text-3xl text-center font-bold">Kanban<span className="text-blue-500">App</span></h2>

                    <h1 className="text-xl font-semibold mb-6">Register</h1>

                    {/* Name Input */}
                    <div className="my-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mb-4 border rounded-md"
                            placeholder="Your name"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="my-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mb-4 border rounded-md"
                            placeholder="Your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="my-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mb-4 border rounded-md"
                            placeholder="Password"
                        />
                    </div>

                    {/* Login Redirect */}
                    <p className="text-center mb-4">
                        Already registered?{' '}
                        <Link to="/login" className="text-blue-600">
                            Login Now
                        </Link>
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
