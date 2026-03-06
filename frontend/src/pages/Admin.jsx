import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        apiClient.get("/admin/users"),
        apiClient.get("/admin/tasks"),
      ]);
      setUsers(usersRes.data.data);
      setTasks(tasksRes.data.data);
    } catch {
      showToast("Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Delete user? This will also delete all their tasks.")) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User deleted", "success");
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-dark-charcoal">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-md glass-card-dark">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-bold">Admin</h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Tabs */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-4 mb-8 border-b border-white/5">
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 font-medium transition ${
              tab === "users"
                ? "text-primary border-b-2 border-primary"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab("tasks")}
            className={`px-4 py-2 font-medium transition ${
              tab === "tasks"
                ? "text-primary border-b-2 border-primary"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
        </div>

        {/* Users Table */}
        {tab === "users" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Created</th>
                      <th className="text-right py-3 px-4 text-slate-300 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition">
                        <td className="py-4 px-4 text-slate-100">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 text-sm transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tasks Table */}
        {tab === "tasks" && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Owner</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-white/5 transition">
                        <td className="py-4 px-4 text-slate-100 font-medium">{task.title}</td>
                        <td className="py-4 px-4 text-slate-400 text-sm">{task.userEmail}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
                            {task.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-sm">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

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

export default Admin;
