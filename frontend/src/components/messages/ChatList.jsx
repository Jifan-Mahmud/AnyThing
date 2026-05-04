import React from 'react';
import { Search } from 'lucide-react';
import Avatar from '../ui/Avatar';

const MOCK_CHATS = [
  { id: 1, user: { name: 'jason_creativ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason' }, lastMessage: 'The new campaign looks incredi...', time: '2m', unread: true },
  { id: 2, user: { name: 'sarah_studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }, lastMessage: 'Can we reschedule for tomorro...', time: '15m', unread: false },
  { id: 3, user: { name: 'mike_layers', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' }, lastMessage: 'Sent a new design draft.', time: '1h', unread: false },
];

const ChatList = ({ activeChatId, onSelectChat }) => {
  return (
    <div className="flex flex-col h-full border-r border-white/5 w-full md:w-80 lg:w-96">
      <div className="p-4 border-b border-white/5">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full bg-surface-light text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {MOCK_CHATS.map(chat => (
          <div 
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-white/5 ${
              activeChatId === chat.id ? 'bg-surface' : 'hover:bg-surface/50'
            }`}
          >
            <Avatar src={chat.user.avatar} size="md" isOnline={chat.unread} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm truncate ${chat.unread ? 'font-bold text-white' : 'font-semibold text-gray-300'}`}>
                  {chat.user.name}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unread ? 'text-white font-medium' : 'text-gray-500'}`}>
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
