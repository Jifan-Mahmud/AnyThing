'use client';

import React, { memo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import Avatar from '../ui/Avatar';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion } from 'motion/react';

const ChatList = ({ users, loading, error, onSelectUser }) => {
  if (loading) {
    return (
      <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker z-10 relative">
        <div className="p-4 border-b border-white/5 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white tracking-tight">Messages</h2>
            <span className="w-8 h-5 rounded-full bg-white/5 animate-pulse" />
          </div>
          <div className="relative">
            <div className="w-full bg-white/5 h-10 rounded-2xl border border-white/5 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <LoadingSpinner
            size="md"
            text="Loading chats..."
            subtext="Connecting to your contacts"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker p-6 text-rose-400 items-center justify-center text-center">
        <p className="text-sm font-bold mb-1">Failed to load chats</p>
        <p className="text-xs text-zinc-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker z-10 relative select-none">
      <div className="p-4 border-b border-white/5 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
            <span>Messages</span>
            <Sparkles className="w-4 h-4 text-primary-pink" />
          </h2>
          <span className="bg-primary-pink/15 text-primary-pink text-xs px-2.5 py-0.5 rounded-full font-bold border border-primary-pink/30">
            {users ? users.length : 0}
          </span>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary-pink transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-white/5 text-white rounded-2xl py-2 pl-9 pr-4 focus:outline-none focus:border-primary-pink/50 border border-white/10 transition-all text-xs sm:text-sm font-medium placeholder-zinc-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {users && users.length > 0 ? (
          users.filter(Boolean).map((u) => {
            return (
              <motion.div
                key={u._id}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectUser(u)}
                className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-colors duration-200 group hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                <div className="relative">
                  <Avatar src={u.avatarUrl} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                    {u.name || u.username}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                    @{u.username}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <p className="text-xs font-bold text-zinc-400">No contacts yet</p>
            <p className="text-[11px] text-zinc-600 mt-1">Follow creators to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ChatList);
