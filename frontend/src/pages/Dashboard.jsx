// Dashboard page with task list, filters, and management

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import apiClient from "../api/client";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Skeleton from "../components/Skeleton";
import Snowfall from "../components/Snowfall";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    fetchTasks();
  }, [status, page]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status !== "all") {
        params.status = status;
      }
      const response = await apiClient.get("/tasks", {
        params,
      });
      const { data, meta } = response.data;
      setTasks(data);
      setTotalPages(Math.ceil(meta.total / meta.limit));
    } catch (error) {
      setToast({
        visible: true,
        message: "Failed to fetch tasks",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (taskId) => {
    setSelectedTaskId(taskId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/tasks/${selectedTaskId}`);
      setTasks((prev) =>
        prev.filter((task) => task.id !== selectedTaskId)
      );
      setDeleteModalOpen(false);
      setToast({
        visible: true,
        message: "Task deleted successfully",
        type: "success",
      });
    } catch (error) {
      setToast({
        visible: true,
        message: "Failed to delete task",
        type: "error",
      });
    }
  };

  const statusFilters = [
    { value: "all", label: "All Tasks" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-navy-900 relative overflow-hidden">
      <Snowfall />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cyan-500 mb-2">
              Welcome, {user?.email}
            </h1>
            <p className="text-gray-400">Manage your tasks efficiently</p>
          </div>

          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((filter) => (
                <motion.button
                  key={filter.value}
                  onClick={() => {
                    setStatus(filter.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded transition ${
                    status === filter.value
                      ? "bg-cyan-500 text-navy-900"
                      : "bg-navy-800 text-gray-300 hover:bg-navy-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={() => navigate("/dashboard/tasks/new")}
              className="px-6 py-2 bg-cyan-500 text-navy-900 font-semibold rounded hover:bg-cyan-400 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + New Task
            </motion.button>
          </div>

          {loading ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </motion.div>
          ) : tasks.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">No tasks found</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <motion.div
              className="flex justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-navy-800 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-navy-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default Dashboard;
