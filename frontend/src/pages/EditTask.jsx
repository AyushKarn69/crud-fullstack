// Edit task page with form and API integration

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import apiClient from "../api/client";
import Navbar from "../components/Navbar";
import Skeleton from "../components/Skeleton";
import Toast from "../components/Toast";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      const task = response.data.data;
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
      });
    } catch (error) {
      setToast({
        visible: true,
        message: "Failed to fetch task",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await apiClient.patch(`/tasks/${id}`, formData);
      setToast({
        visible: true,
        message: "Task updated successfully",
        type: "success",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setToast({
        visible: true,
        message: error.response?.data?.message || "Failed to update task",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="max-w-md w-full mx-4">
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <motion.div
          className="bg-navy-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl font-bold text-cyan-500 mb-6"
            variants={itemVariants}
          >
            Edit Task
          </motion.h1>

          <motion.form onSubmit={handleSubmit} variants={containerVariants}>
            <motion.div className="mb-4" variants={itemVariants}>
              <label className="block text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded text-white focus:outline-none focus:border-cyan-500"
                placeholder="Task title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded text-white focus:outline-none focus:border-cyan-500 h-24"
                placeholder="Task description"
              />
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </motion.div>

            <motion.div className="flex gap-2" variants={itemVariants}>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 bg-cyan-500 text-navy-900 font-semibold rounded hover:bg-cyan-400 transition disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Task"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default EditTask;
