'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Avatar from '../ui/Avatar';
import {
  House,
  Video,
  Compass,
  Envelope,
  Bell,
  Person,
  Plus,
  ArrowRightFromSquare,
} from '@gravity-ui/icons';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onOpenCreatePost }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/app', icon: House },
    { name: 'Reels', path: '/app/reels', icon: Video },
    { name: 'Explore', path: '/app/explore', icon: Compass },
    { name: 'Messages', path: '/app/messages', icon: Envelope },
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
    { name: 'Profile', path: '/app/profile', icon: Person },
  ];

  const checkIsActive = (itemPath) => {
    if (itemPath === '/app') {
      return pathname === '/app';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <div className="flex flex-col h-full py-8 px-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 px-4 cursor-pointer"
        onClick={() => router.push('/app')}
      >
        <div className="text-3xl font-black tracking-tighter italic text-white flex items-center gap-1">
          Any<span className="text-primary-pink drop-shadow-[0_0_12px_rgba(255,105,180,0.5)]">Thing</span>
        </div>
      </motion.div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = checkIsActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-light text-primary-pink font-semibold shadow-lg shadow-primary-pink/10 border border-primary-pink/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-lg">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Create Post Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenCreatePost}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5 mt-4"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg">Create</span>
        </motion.button>
      </nav>

      {/* Current User Profile Snippet */}
      <div className="mt-auto space-y-3">
        {user ? (
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push('/app/profile')}
              className="flex items-center gap-3 p-3 rounded-2xl bg-surface/50 hover:bg-surface cursor-pointer transition-colors border border-white/5"
            >
              <Avatar
                src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'}
                alt={user.name || user.username}
                size="md"
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-semibold truncate text-white">
                  {user.name || user.username}
                </h3>
                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <ArrowRightFromSquare className="w-6 h-6" />
              <span className="text-lg">Logout</span>
            </motion.button>
          </>
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">Not logged in</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
