import React, { useState } from 'react';
import { Video, Phone, MoreVertical, Plus, Smile, Send } from 'lucide-react';
import Avatar from '../ui/Avatar';

const MOCK_MESSAGES = [
  { id: 1, text: 'Hey! I just finished the storyboard for the AnyThing campaign. Want to take a look?', sender: 'them', time: '10:24 AM' },
  { id: 2, text: 'Absolutely. Did you manage to incorporate the new pink brand tokens into the glassmorphic sections?', sender: 'me', time: '10:26 AM' },
  { id: 3, text: 'Yeah, I used the #FF2A70 base for the background layers. It creates a really nice warmth against the stark black elements.', sender: 'them', time: '10:28 AM' },
];

const ActiveChat = ({ chat }) => {
  const [message, setMessage] = useState('');

  if (!chat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center flex-col text-gray-500">
        <Send size={48} className="mb-4 opacity-20" />
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason" size="md" isOnline={true} />
          <div>
            <h3 className="font-semibold text-white">jason_creativ</h3>
            <p className="text-xs text-primary-pink">Active Now</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-white transition-colors"><Video size={20} /></button>
          <button className="hover:text-white transition-colors"><Phone size={20} /></button>
          <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="text-center text-xs text-gray-500 my-4">TODAY</div>
        
        {MOCK_MESSAGES.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[75%] gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'them' && (
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason" size="sm" className="mt-auto flex-shrink-0" />
              )}
              <div className="flex flex-col">
                <div 
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'me' 
                      ? 'bg-surface-light text-white rounded-br-sm' 
                      : 'bg-primary-pink/10 border border-primary-pink/20 text-white rounded-bl-sm glass-bubble'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <span className={`text-[10px] text-gray-500 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-bg-darker">
        <div className="flex items-center gap-2">
          <button className="p-2 text-white bg-surface-light hover:bg-surface rounded-full transition-colors flex-shrink-0">
            <Plus size={20} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..." 
              className="w-full bg-surface-light text-white rounded-full py-3 pl-4 pr-12 focus:outline-none border border-transparent focus:border-white/10 text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <Smile size={20} />
            </button>
          </div>
          {message.trim() ? (
            <button className="p-3 bg-primary-pink text-white rounded-full hover:bg-primary-pink-hover transition-colors shadow-lg shadow-primary-pink/20 flex-shrink-0">
              <Send size={18} className="ml-1" />
            </button>
          ) : (
            <button className="p-3 bg-surface-light text-white rounded-full hover:bg-surface transition-colors flex-shrink-0">
              <Send size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveChat;
