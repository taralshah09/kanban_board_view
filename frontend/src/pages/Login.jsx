import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();
  let url = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        url + 'users/login',
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setAuthUser(response.data.user);
      localStorage.setItem('Kanban', JSON.stringify(response.data.user));
      setEmail('');
      setPassword('');
      navigate('/conversation-home');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="w-full max-w-md bg-[#1E1E2F] text-white shadow-2xl rounded-2xl p-8 backdrop-blur-sm animate-fadeIn">
        <form onSubmit={handleLogin}>
          <h2 className="text-3xl text-center font-extrabold mb-2">
            Kanban<span className="text-blue-400">App</span>
          </h2>
          <h3 className="text-lg text-gray-300 mb-6 text-center">Login to your dashboard</h3>

          <input
            type="email"
            className="w-full px-4 py-2 mb-4 rounded-md bg-[#2C2C3A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-4 py-2 mb-4 rounded-md bg-[#2C2C3A] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-sm text-center text-gray-400 mb-4">
            Don't have an account?{' '}
            <Link to="/register"
              className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-md text-white font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
