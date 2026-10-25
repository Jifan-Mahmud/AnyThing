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
import { Zap } from 'lucide-react';
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
    <div className="flex flex-col h-full py-6 px-4 sm:px-5 border-r border-white/5 bg-bg-darker/95 backdrop-blur-2xl select-none">
      {/* Brand Logo Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 px-3 cursor-pointer flex items-center gap-2.5 group"
        onClick={() => router.push('/app')}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-pink to-purple-600 flex items-center justify-center shadow-lg shadow-primary-pink/25 group-hover:scale-105 transition-transform">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="text-2xl font-black tracking-tight italic text-white">
          Any<span className="text-primary-pink text-glow">Thing</span>
        </div>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = checkIsActive(item.path);
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.path} className="block">
              <motion.div
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-primary-pink/15 border border-primary-pink/30 shadow-md shadow-primary-pink/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Active Indicator Glow Pip */}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 w-1.5 h-6 bg-primary-pink rounded-r-full shadow-neon-pink"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-pink' : 'text-zinc-400'}`} />
                <span className="tracking-tight">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* Create Post Action Button */}
        <div className="pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCreatePost}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary-pink to-purple-600 text-white font-bold text-sm shadow-lg shadow-primary-pink/25 hover:shadow-primary-pink/40 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="tracking-tight">Create Post</span>
          </motion.button>
        </div>
      </nav>

      {/* Bottom User Profile Section */}
      <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
        {user ? (
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push('/app/profile')}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 cursor-pointer transition-colors"
            >
              <Avatar
                src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'}
                alt={user.name || user.username}
                size="md"
              />
              <div className="flex-1 overflow-hidden min-w-0">
                <h3 className="text-xs font-bold truncate text-white">
                  {user.name || user.username}
                </h3>
                <p className="text-[11px] text-zinc-400 truncate">@{user.username}</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <ArrowRightFromSquare className="w-4 h-4 text-zinc-500 hover:text-rose-400" />
              <span>Log Out</span>
            </motion.button>
          </>
        ) : (
          <div className="text-xs text-zinc-500 text-center py-2">Not logged in</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
