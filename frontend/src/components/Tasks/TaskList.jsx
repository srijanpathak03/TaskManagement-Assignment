import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SummaryModal from './SummaryModal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
  });
  const [summary, setSummary] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [filter, currentPage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tasks', { params: { ...filter, page: currentPage, limit: tasksPerPage } });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleDownloadSummary = async (format) => {
    try {
      const response = await api.get('/tasks/summary', {
        params: {
          ...filter,
          format: format,
        },
        responseType: format === 'csv' ? 'blob' : 'json',
      });

      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'task_summary_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setSummary(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error downloading summary report:', error);
      setError('Failed to download summary report. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSummary([]);
  };

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center mt-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4 flex space-x-4">
          <select
            name="status"
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            name="priority"
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="mb-4">
          <button
            onClick={() => handleDownloadSummary('csv')}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Download Summary as CSV
          </button>
          <button
            onClick={() => handleDownloadSummary('json')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            View Summary as JSON
          </button>
        </div>

        <SummaryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          summary={summary}
        />
        
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-700 border-b border-gray-300">Title</th>
                <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-700 border-b border-gray-300">Status</th>
                <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-700 border-b border-gray-300">Priority</th>
                <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-700 border-b border-gray-300">Due Date</th>
                <th className="py-4 px-6 bg-gray-200 font-bold uppercase text-sm text-gray-700 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-100">
                  <td className="py-4 px-6 border-b border-gray-300">{task.title}</td>
                  <td className="py-4 px-6 border-b border-gray-300">{task.status}</td>
                  <td className="py-4 px-6 border-b border-gray-300">{task.priority}</td>
                  <td className="py-4 px-6 border-b border-gray-300">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6 border-b border-gray-300">
                    <Link to={`/tasks/${task._id}`} className="text-blue-600 hover:text-blue-800 mr-2">Edit</Link>
                    <button onClick={() => handleDeleteTask(task._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mb-4">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
