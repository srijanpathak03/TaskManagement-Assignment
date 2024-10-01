
import React from 'react';

const SummaryModal = ({ isOpen, onClose, summary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4">Task Summary</h2>
        {summary.length === 0 ? (
          <p>No tasks found for the selected filters.</p>
        ) : (
          summary.map((item, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Status: {item._id.status}</h3>
              <h4 className="font-medium">Count: {item.count}</h4>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Title</th>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Due Date</th>
                    <th className="border border-gray-300 p-2">Priority</th>
                    <th className="border border-gray-300 p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {item.tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">{task.title}</td>
                      <td className="border border-gray-300 p-2">{task.description}</td>
                      <td className="border border-gray-300 p-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="border border-gray-300 p-2">{task.priority}</td>
                      <td className="border border-gray-300 p-2">{new Date(task.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
        <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
