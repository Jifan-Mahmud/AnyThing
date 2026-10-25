'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function BrandLogo({ size = 'md', className = '', onClick }) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl md:text-5xl',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5 mb-1.5',
    md: 'w-2 h-2 mb-2 sm:mb-2.5',
    lg: 'w-2.5 h-2.5 mb-3',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`inline-flex items-center font-black italic tracking-tighter select-none cursor-pointer group ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className="text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)] group-hover:text-zinc-100 transition-colors">
        Any
      </span>
      <span className="bg-gradient-to-r from-[#ff2e83] via-[#ff4b98] to-[#ffa07a] bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(255,46,131,0.45)]">
        Thing
      </span>
      <span
        className={`rounded-full bg-gradient-to-tr from-[#ff2e83] to-[#ffa07a] shadow-[0_0_10px_#ffa07a] ml-1 animate-pulse ${dotSizes[size] || dotSizes.md}`}
      />
    </motion.div>
  );
}
