import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "", status: "pending" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      const task = response.data.data;
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
        status: task.status || "pending"
      });
      setLoading(false);
    } catch {
      setErrors({ fetch: "Failed to load task" });
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        status: formData.status
      };
      
      // Only add description if it's not empty
      if (formData.description && formData.description.trim()) {
        payload.description = formData.description;
      }
      
      // Convert datetime-local to ISO 8601 if dueDate is provided
      if (formData.dueDate && formData.dueDate.trim()) {
        payload.dueDate = new Date(formData.dueDate).toISOString();
      }
      
      await apiClient.patch(`/tasks/${id}`, payload);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to update task" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-charcoal flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[500px] px-6">
        <div className="glass-card-dark rounded-xl p-10 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Task</h1>
          <p className="text-slate-400 text-sm mb-8">Update task details</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.fetch && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-sm">
                {errors.fetch}
              </div>
            )}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full"
              />
              {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Due Date</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 h-12 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
