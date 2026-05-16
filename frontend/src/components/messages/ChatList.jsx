import React from 'react';
import { Search } from 'lucide-react';
import Avatar from '../ui/Avatar';

export const MOCK_CHATS = [
  { id: 1, user: { name: 'jason_creativ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason' }, lastMessage: 'The new campaign looks incredi...', time: '2m', unreadCount: 2, isTyping: false },
  { id: 2, user: { name: 'sarah_studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }, lastMessage: 'Typing...', time: '15m', unreadCount: 0, isTyping: true },
  { id: 3, user: { name: 'mike_layers', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' }, lastMessage: 'Sent a new design draft.', time: '1h', unreadCount: 0, isTyping: false },
  { id: 4, user: { name: 'emma_designs', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' }, lastMessage: 'Can we hop on a quick call?', time: '2h', unreadCount: 1, isTyping: false },
];

const ChatList = ({ activeChatId, onSelectChat }) => {
  return (
    <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96 bg-bg-darker z-10 relative">
      <div className="p-4 border-b border-white/5 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Messages</h2>
          <span className="bg-primary-pink/20 text-primary-pink text-xs px-2 py-1 rounded-full font-medium border border-primary-pink/30">
            3 New
          </span>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-pink transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-surface text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 border border-white/5 focus:border-primary-pink/50 transition-all text-sm shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {MOCK_CHATS.map(chat => {
          const isActive = activeChatId === chat.id;
          return (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group ${
                isActive 
                  ? 'glass-panel border-primary-pink/30 shadow-[0_0_15px_rgba(255,105,180,0.1)]' 
                  : 'hover:bg-surface border border-transparent hover:border-white/5 hover:translate-x-1'
              }`}
            >
              <div className="relative">
                <Avatar src={chat.user.avatar} size="md" isOnline={chat.unreadCount > 0 || chat.isTyping} />
                {isActive && (
                  <div className="absolute -inset-1 rounded-full border-2 border-primary-pink opacity-50 animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-sm truncate transition-colors ${chat.unreadCount > 0 ? 'font-bold text-white' : 'font-semibold text-gray-300 group-hover:text-white'}`}>
                    {chat.user.name}
                  </h4>
                  <span className={`text-xs whitespace-nowrap ${chat.unreadCount > 0 ? 'text-primary-pink font-medium' : 'text-gray-500'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate ${chat.isTyping ? 'text-primary-pink italic' : chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-primary-pink to-primary-pink-hover text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-primary-pink/20">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
