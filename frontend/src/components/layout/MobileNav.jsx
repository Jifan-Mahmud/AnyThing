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
    <nav className="flex items-center justify-around h-full px-2 relative">
      {navItems.slice(0, 2).map((item) => {
        const isActive = checkIsActive(item.path);
        const Icon = item.icon;
        return (
          <Link key={item.name} href={item.path}>
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary-pink' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          </Link>
        );
      })}

      {/* Center Create Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenCreatePost}
        className="p-3 bg-primary-pink text-white rounded-full hover:bg-primary-pink-hover transition-transform shadow-lg shadow-primary-pink/30 -mt-6 border-4 border-bg-darker"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {navItems.slice(2).map((item) => {
        const isActive = checkIsActive(item.path);
        const Icon = item.icon;
        return (
          <Link key={item.name} href={item.path}>
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary-pink' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
