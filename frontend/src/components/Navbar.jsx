import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTasks, FaPlus, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-black to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-semibold tracking-wide hover:text-gray-300 transition-colors duration-300">
              Task Manager
            </Link>
          </div>

          <div className="hidden md:flex space-x-4">
            {user ? (
              <>
                <Link
                  to="/tasks"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300"
                >
                  <FaTasks className="mr-2" />
                  Tasks
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/tasks/new"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300"
                  >
                    <FaPlus className="mr-2" />
                    New Task
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-300"
                >
                  <FaUserPlus className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
