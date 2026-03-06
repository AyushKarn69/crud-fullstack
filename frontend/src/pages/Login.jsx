// Login page with form validation and error handling

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Snowfall from "../components/Snowfall";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setServerError(result.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-navy-900 relative overflow-hidden">
      <Snowfall />
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <motion.div
          className="bg-navy-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl font-bold text-cyan-500 mb-6 text-center"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h1>

          {serverError && (
            <motion.div
              className="mb-4 p-3 bg-red-600/20 border border-red-600 rounded text-red-400"
              variants={itemVariants}
            >
              {serverError}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} variants={containerVariants}>
            <motion.div className="mb-4" variants={itemVariants}>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded text-white focus:outline-none focus:border-cyan-500"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded text-white focus:outline-none focus:border-cyan-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-cyan-500 text-navy-900 font-semibold rounded hover:bg-cyan-400 transition disabled:opacity-50"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.form>

          <motion.p className="text-center text-gray-400 mt-4" variants={itemVariants}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-cyan-400 hover:text-cyan-300 border-b border-cyan-400"
            >
              Register
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
