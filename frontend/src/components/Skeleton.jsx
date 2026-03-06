// Skeleton loader component for loading states

import React from "react";
import { motion } from "framer-motion";

const Skeleton = () => {
  return (
    <motion.div
      className="bg-navy-800 p-4 rounded-lg"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="h-6 bg-navy-700 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-navy-700 rounded mb-2 w-full"></div>
      <div className="h-4 bg-navy-700 rounded w-1/2"></div>
    </motion.div>
  );
};

export default Skeleton;
