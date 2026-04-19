// Navigation bar component

import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-navy-800 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-cyan-500">Task Manager</h1>
        <div className="flex gap-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 hover:text-cyan-400 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-cyan-500 text-navy-900 rounded hover:bg-cyan-400 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-300">{user?.email}</span>
              {user?.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 hover:text-cyan-400 transition"
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
