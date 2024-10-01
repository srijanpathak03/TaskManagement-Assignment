
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskForm from './components/Tasks/TaskForm';
import { ToastContainer } from 'react-toastify'; 

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-r from-slate-300 to-slate-500">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tasks" element={<PrivateRoute><TaskList /></PrivateRoute>} />
              <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/tasks/:id" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
