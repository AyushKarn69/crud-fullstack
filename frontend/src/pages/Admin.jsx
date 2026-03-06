// Admin panel with user and task management tables

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "../api/client";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Skeleton from "../components/Skeleton";
import Snowfall from "../components/Snowfall";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [usersPage, setUsersPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [tasksTotalPages, setTasksTotalPages] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null, type: null });
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, [usersPage, tasksPage]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await apiClient.get("/admin/users", {
        params: { page: usersPage, limit: 10 },
      });
      const { data, meta } = response.data;
      setUsers(data);
      setUsersTotalPages(Math.ceil(meta.total / meta.limit));
    } catch (error) {
      setToast({
        visible: true,
        message: "Failed to fetch users",
        type: "error",
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchTasks = async () => {
    setTasksLoading(true);
    try {
      const response = await apiClient.get("/admin/tasks", {
        params: { page: tasksPage, limit: 10 },
      });
      const { data, meta } = response.data;
      setTasks(data);
      setTasksTotalPages(Math.ceil(meta.total / meta.limit));
    } catch (error) {
      setToast({
        visible: true,
        message: "Failed to fetch tasks",
        type: "error",
      });
    } finally {
      setTasksLoading(false);
    }
  };

  const openDeleteModal = (userId) => {
    setDeleteModal({ open: true, userId, type: "user" });
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/admin/users/${deleteModal.userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteModal.userId));
      setDeleteModal({ open: false, userId: null, type: null });
      setToast({
        visible: true,
        message: "User deleted successfully",
        type: "success",
      });
    } catch (error) {
      setToast({
        visible: true,
        message: "Failed to delete user",
        type: "error",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-navy-900 relative overflow-hidden">
      <Snowfall />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-cyan-500 mb-8">Admin Panel</h1>

          <motion.div
            className="bg-navy-800 rounded-lg p-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Users</h2>
            {usersLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-300">
                    <thead className="bg-navy-700 text-cyan-400">
                      <tr>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Created At</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-navy-700 hover:bg-navy-700/50 transition"
                        >
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                user.role === "ADMIN"
                                  ? "bg-red-600/20 text-red-400"
                                  : "bg-blue-600/20 text-blue-400"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => openDeleteModal(user.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {usersTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setUsersPage((prev) => Math.max(1, prev - 1))}
                      disabled={usersPage === 1}
                      className="px-4 py-2 bg-navy-700 text-white rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-300">
                      Page {usersPage} of {usersTotalPages}
                    </span>
                    <button
                      onClick={() =>
                        setUsersPage((prev) => Math.min(usersTotalPages, prev + 1))
                      }
                      disabled={usersPage === usersTotalPages}
                      className="px-4 py-2 bg-navy-700 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>

          <motion.div
            className="bg-navy-800 rounded-lg p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">All Tasks</h2>
            {tasksLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-300">
                    <thead className="bg-navy-700 text-cyan-400">
                      <tr>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Owner</th>
                        <th className="px-4 py-2">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr
                          key={task.id}
                          className="border-b border-navy-700 hover:bg-navy-700/50 transition"
                        >
                          <td className="px-4 py-2">{task.title}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                task.status === "DONE"
                                  ? "bg-green-600/20 text-green-400"
                                  : task.status === "IN_PROGRESS"
                                  ? "bg-yellow-600/20 text-yellow-400"
                                  : "bg-gray-600/20 text-gray-400"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{task.user.email}</td>
                          <td className="px-4 py-2">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {tasksTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={() => setTasksPage((prev) => Math.max(1, prev - 1))}
                      disabled={tasksPage === 1}
                      className="px-4 py-2 bg-navy-700 text-white rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-gray-300">
                      Page {tasksPage} of {tasksTotalPages}
                    </span>
                    <button
                      onClick={() =>
                        setTasksPage((prev) => Math.min(tasksTotalPages, prev + 1))
                      }
                      disabled={tasksPage === tasksTotalPages}
                      className="px-4 py-2 bg-navy-700 text-white rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Modal
        isOpen={deleteModal.open}
        title="Delete User"
        message="Are you sure you want to delete this user and all their tasks? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, userId: null, type: null })}
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

export default Admin;
