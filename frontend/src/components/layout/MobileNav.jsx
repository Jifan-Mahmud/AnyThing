'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Video, Compass, Person, Plus } from '@gravity-ui/icons';
import { motion } from 'motion/react';

const MobileNav = ({ onOpenCreatePost }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/app', icon: House },
    { name: 'Reels', path: '/app/reels', icon: Video },
    { name: 'Explore', path: '/app/explore', icon: Compass },
    { name: 'Profile', path: '/app/profile', icon: Person },
  ];

  const checkIsActive = (itemPath) => {
    if (itemPath === '/app') {
      return pathname === '/app';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <nav className="flex items-center justify-around h-full px-3 relative bg-bg-darker/95 backdrop-blur-2xl border-t border-white/5">
      {navItems.slice(0, 2).map((item) => {
        const isActive = checkIsActive(item.path);
        const Icon = item.icon;
        return (
          <Link key={item.name} href={item.path} className="relative py-2">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
                isActive ? 'text-primary-pink' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <motion.span
                  layoutId="activeMobileDot"
                  className="w-1 h-1 bg-primary-pink rounded-full shadow-neon-pink"
                />
              )}
            </motion.div>
          </Link>
        );
      })}

      {/* Floating Center Create Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenCreatePost}
        className="p-3.5 bg-gradient-to-tr from-primary-pink to-purple-600 text-white rounded-full shadow-lg shadow-primary-pink/35 -mt-6 border-4 border-bg-darker transition-transform cursor-pointer"
        aria-label="Create Post"
      >
        <Plus className="w-5 h-5" />
      </motion.button>

      {navItems.slice(2).map((item) => {
        const isActive = checkIsActive(item.path);
        const Icon = item.icon;
        return (
          <Link key={item.name} href={item.path} className="relative py-2">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1 ${
                isActive ? 'text-primary-pink' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <motion.span
                  layoutId="activeMobileDot"
                  className="w-1 h-1 bg-primary-pink rounded-full shadow-neon-pink"
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
