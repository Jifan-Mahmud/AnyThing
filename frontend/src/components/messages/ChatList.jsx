'use client';

import React from 'react';
import { Search } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { motion } from 'motion/react';

const ChatList = ({ users, loading, error, onSelectUser }) => {
  if (loading) {
    return (
      <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker p-4 text-gray-400">
        Loading chats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker p-4 text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker z-10 relative">
      <div className="p-4 border-b border-white/5 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Messages
          </h2>
          <span className="bg-primary-pink/20 text-primary-pink text-xs px-2.5 py-1 rounded-full font-medium border border-primary-pink/30">
            {users ? users.length : 0}
          </span>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-pink transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-surface text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 border border-white/5 focus:border-primary-pink/50 transition-all text-sm shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {users &&
          users.filter(Boolean).map((u) => {
            return (
              <motion.div
                key={u._id}
                whileHover={{ scale: 1.01, x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectUser(u)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-200 group hover:bg-surface border border-transparent hover:border-white/5"
              >
                <div className="relative">
                  <Avatar src={u.avatarUrl} size="md" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm truncate font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {u.username}
                    </h4>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default ChatList;
