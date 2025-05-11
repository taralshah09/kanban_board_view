import './App.css'
import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/AuthProvider'
import Home from './pages/Home'
import ConversationHome from './pages/ConversationHome'
import Conversation from './pages/Conversation'
import TaskPage from './pages/TaskPage'
import axios from 'axios'
import io from "socket.io-client"
import { useEffect } from 'react'
// const socket = io.connect("http://localhost:3000", { credentials: true })

export const socket = io.connect("https://kanban-board-view-backend.onrender.com/", { withCredentials: true });
function App() {
  const [authUser, setAuthUser] = useAuth()
  const location = useLocation()
  const navigate = useNavigate("");
  // let url = "http://localhost:3000/";
  let url = import.meta.env.url || "https://kanban-board-view-backend.onrender.com/";
  // Check if current path is ConversationHome or Conversation
  const showNavbar = location.pathname === '/conversation-home' || location.pathname.startsWith('/conversation')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      console.log('Socket ID:', socket.id);  // This will log the socket ID
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(url + "users/logout", {}, { withCredentials: true })
      localStorage.removeItem("Kanban")
      console.log(response.data.message)
      alert(response.data.message)
      navigate("/login")
    } catch (error) {
      console.log("Error in logging out : ", error.message)
    }
  }
  return (
    <>
      {showNavbar && (
        <nav className="bg-[#1E1E2F] text-white px-8 py-2 flex items-center justify-between shadow-md border-b border-gray-700">
          <Link to="/conversation-home" className="hover:text-blue-400 transition-colors duration-200">
            <p className="text-3xl text-center font-bold">
              Kanban<span className="text-blue-400">App</span>
            </p>
          </Link>
          <ul className="flex items-center space-x-6">
            <li className="text-lg font-medium text-gray-300">{authUser?.name}</li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>



      )}

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/conversation-home' index element={authUser ? <ConversationHome /> : <Navigate to="/login" />} />
        {/* <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} /> */}
        <Route path="/conversation/:id" element={authUser ? <Conversation /> : <Navigate to="/login" />} />
        <Route path="/conversations/:conversationId/tasks/:taskId" element={authUser ? <TaskPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Fallback route */}
      </Routes>
    </>
  )
}

export default App
