// Animated snowfall background effect

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Generate snowflakes with random properties
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 10 + Math.random() * 20,
      opacity: 0.3 + Math.random() * 0.7,
      size: 2 + Math.random() * 6,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            filter: "blur(0.5px)",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: typeof window !== "undefined" ? window.innerHeight + 20 : 1000,
            opacity: [0, flake.opacity, flake.opacity, 0],
            x: Math.sin(flake.id) * 100,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
