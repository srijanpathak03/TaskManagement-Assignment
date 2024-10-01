
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
    if (user.isAdmin) {
      fetchUsers();
    }
  }, [id, user.isAdmin]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/tasks/${id}`, task);
      } else {
        await api.post('/tasks', task);
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {id ? 'Edit Task' : 'Create Task'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-semibold text-lg mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 text-gray-700"
              id="title"
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-semibold text-lg mb-2" htmlFor="status">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 text-gray-700"
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
  
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-semibold text-lg mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 text-gray-700"
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-semibold text-lg mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 text-gray-700"
              id="dueDate"
              type="date"
              name="dueDate"
              value={task.dueDate.split('T')[0]}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-lg mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 text-gray-700"
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </div>

        {user.isAdmin && (
          <div>
            <label className="block text-gray-700 font-semibold text-lg mb-2" htmlFor="assignedTo">
              Assigned To
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500 text-gray-700"
              id="assignedTo"
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u.username}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
        )}


        <div className="flex justify-end">
          <button
            className="bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition-all duration-300"
            type="submit"
          >
            {id ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
