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

export const socket = io.connect("http://localhost:3000", { withCredentials: true });
function App() {
  const [authUser, setAuthUser] = useAuth()
  const location = useLocation()
  const navigate = useNavigate("");
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
      const response = await axios.post("http://localhost:3000/users/logout", {}, { withCredentials: true })
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
        <nav className="navbar bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <Link to="/conversation-home">
            <h2 className="text-2xl font-semibold">Tasker</h2>
          </Link>
          <ul className="flex items-center space-x-6">
            <li className="text-lg">{authUser?.name}</li>
            <li>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded">
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
