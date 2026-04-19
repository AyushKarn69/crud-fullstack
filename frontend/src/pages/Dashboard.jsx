import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import apiClient from "../api/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [status, page]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status !== "all") params.status = status;
      const response = await apiClient.get("/tasks", { params });
      setTasks(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / 10));
    } catch (error) {
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/tasks/${deleteId}`);
      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
      showToast("Task deleted", "success");
    } catch {
      showToast("Failed to delete task", "error");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await apiClient.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      showToast("Task updated", "success");
    } catch {
      showToast("Failed to update task", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "bg-green-500/20 text-green-400 border-green-500/30";
    return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  return (
    <div className="min-h-screen bg-dark-charcoal">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md glass-card-dark">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined"></span>
            </div>
            <h1 className="text-2xl font-bold">Tasks</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            {user?.role === "ADMIN" && (
              <button
                onClick={() => navigate("/admin")}
                className="text-sm text-primary hover:text-blue-400 transition"
              >
                Admin
              </button>
            )}
            <button
              onClick={logout}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Add Task */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
            <span className="material-symbols-outlined text-slate-500"></span>
          </div>
          <input
            type="text"
            placeholder="Add a task..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-24 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 backdrop-blur-md transition-all text-lg animate-glow"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                navigate("/dashboard/tasks/new", { state: { title: e.target.value } });
              }
            }}
          />
          <button
            onClick={() => navigate("/dashboard/tasks/new")}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                status === s
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No tasks yet. Create one to get started!</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="glass-card-dark rounded-lg p-5 flex items-center justify-between hover:bg-white/10 transition">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 mb-1">{task.title}</h3>
                  {task.description && <p className="text-sm text-slate-400">{task.description}</p>}
                  <div className="flex gap-2 mt-3 items-center">
                    <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => navigate(`/dashboard/tasks/${task.id}`, { state: { task } })}
                    className="text-primary hover:text-blue-400 text-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(task.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card-dark rounded-xl p-8 max-w-sm">
            <h2 className="text-xl font-bold mb-4">Delete Task?</h2>
            <p className="text-slate-300 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg text-sm font-medium z-50 ${
          toast.type === "success"
            ? "bg-green-500/20 text-green-200 border border-green-500/30"
            : "bg-red-500/20 text-red-200 border border-red-500/30"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
