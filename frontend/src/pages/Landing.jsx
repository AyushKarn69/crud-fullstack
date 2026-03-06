// Landing page with animated hero section

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <motion.div
          className="text-center text-white max-w-2xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-cyan-500">
            PrimeTrade.ai
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Manage your tasks efficiently with our secure task management system
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-cyan-500 text-navy-900 font-semibold rounded-lg hover:bg-cyan-400 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              className="px-8 py-3 border-2 border-cyan-500 text-cyan-500 font-semibold rounded-lg hover:bg-cyan-500 hover:text-navy-900 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
