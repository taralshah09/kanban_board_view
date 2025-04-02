import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider';


const Login = () => {
    const navigate = useNavigate();

    // State hooks for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authUser, setAuthUser] = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault();

        const userData = { email, password };  // Prepare data as a JSON object
        try {
            const response = await axios.post(
                "http://localhost:3000/users/login",
                userData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setAuthUser(response.data.user);
            localStorage.setItem("Kanban", JSON.stringify(response.data.user));

            // console.log(response.data); // Log the response data if needed
            setEmail("");
            setPassword("");
            navigate("/conversation-home");

        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };
    return (
        <div>
            <div className='min-h-screen w-[100%] flex items-center justify-center bg-gray-100'>
                <div className='w-full max-w-md shadow-md bg-white p-5 rounded-md'>
                    <form action="" onSubmit={handleLogin}>
                        <h2 className="text-3xl text-center font-bold">Kanban<span className="text-blue-500">App</span></h2>
                        <h1 className="text-xl font-semibold mb-6">Login</h1>


                        <div className='my-2'>
                            <input type="email" className="w-full p-2 mb-4 border rounded-md" value={email} placeholder='Your email' onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className='my-2'>
                            <input type="password" className="w-full p-2 mb-4 border rounded-md" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                        </div>


                        <p className="text-center mb-4">
                            Don't have an account?{" "}
                            <Link to={"/register"} className="text-blue-600">
                                Create One
                            </Link>
                        </p>
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
