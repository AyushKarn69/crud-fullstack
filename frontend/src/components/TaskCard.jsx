// Task card component for displaying individual tasks

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ task, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "DONE":
        return "bg-green-600";
      case "IN_PROGRESS":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <motion.div
      className="bg-navy-800 p-4 rounded-lg border border-navy-700 hover:border-cyan-500 transition"
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-cyan-400">{task.title}</h3>
        <span className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      {task.description && (
        <p className="text-gray-300 text-sm mb-4">{task.description}</p>
      )}
      <div className="text-gray-500 text-xs mb-4">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/dashboard/tasks/${task.id}/edit`)}
          className="flex-1 px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
