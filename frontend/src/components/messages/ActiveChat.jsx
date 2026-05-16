import React, { useState, useRef, useEffect } from 'react';
import { Video, Phone, MoreVertical, Plus, Smile, Send, Check, CheckCheck, Mic } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CallOverlay from './CallOverlay';

const MOCK_MESSAGES_DB = {
  1: [
    { id: 1, text: 'Hey! I just finished the storyboard for the AnyThing campaign. Want to take a look?', sender: 'them', time: '10:24 AM' },
    { id: 2, text: 'Absolutely. Did you manage to incorporate the new pink brand tokens into the glassmorphic sections?', sender: 'me', time: '10:26 AM', status: 'read' },
    { id: 3, text: 'Yeah, I used the #FF2A70 base for the background layers. It creates a really nice warmth against the stark black elements.', sender: 'them', time: '10:28 AM' },
    { id: 4, text: 'Looks incredible! I will share it with the team later today.', sender: 'me', time: '10:30 AM', status: 'delivered' },
  ],
  2: [
    { id: 1, text: 'Hi, are we still on for tomorrow?', sender: 'them', time: '9:00 AM' },
    { id: 2, text: 'Yes, let\'s meet at 2 PM.', sender: 'me', time: '9:15 AM', status: 'read' }
  ],
  3: [
    { id: 1, text: 'Sent a new design draft. Please check.', sender: 'them', time: '1:00 PM' }
  ],
  4: [
    { id: 1, text: 'Can we hop on a quick call?', sender: 'them', time: '2:00 PM' }
  ]
};

const EMOJIS = ['😂', '❤️', '🔥', '👍', '✨', '😍', '😢', '🙌', '🎉', '🥺', '💯', '😊'];

const ActiveChat = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chat) {
      setMessages(MOCK_MESSAGES_DB[chat.id] || []);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: 'me',
      time: timeString,
      status: 'delivered'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setShowEmojis(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  if (!chat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center flex-col text-gray-500 bg-bg-darker relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,105,180,0.1)]">
            <Send size={40} className="text-primary-pink opacity-80" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
          <p className="text-sm">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-bg-darker relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.05) 0%, transparent 50%)' }}></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/5 bg-bg-darker/80 backdrop-blur-md z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="relative">
            <Avatar src={chat.user.avatar} size="md" isOnline={true} />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-bg-darker rounded-full"></span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{chat.user.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-pink animate-pulse"></span>
              <p className="text-xs text-primary-pink font-medium">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveCall('video')} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"><Video size={20} /></button>
          <button onClick={() => setActiveCall('audio')} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"><Phone size={20} /></button>
          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 z-0 scroll-smooth">
        <div className="flex justify-center my-6">
          <span className="px-4 py-1 rounded-full glass-panel text-xs text-gray-400 font-medium">
            Today, 10:24 AM
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 fade-in duration-300`}>
            <div className={`flex max-w-[75%] gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
              {msg.sender === 'them' && (
                <Avatar src={chat.user.avatar} size="sm" className="mb-5 flex-shrink-0" />
              )}
              <div className="flex flex-col">
                <div
                  className={`px-4 py-3 text-sm shadow-sm ${msg.sender === 'me'
                      ? 'bg-gradient-to-br from-primary-pink to-[#ff1493] text-white rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(255,105,180,0.2)]'
                      : 'glass-panel text-gray-100 rounded-2xl rounded-tl-sm border border-white/10'
                    }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1.5 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] text-gray-500 font-medium">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <span className={msg.status === 'read' ? 'text-blue-400' : 'text-gray-500'}>
                      {msg.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-bg-darker/90 backdrop-blur-md z-10 pb-6 md:pb-4">
        <div className="flex items-end gap-2 bg-surface p-1.5 rounded-[2rem] transition-all shadow-inner relative border-none outline-none ring-0">
          
          {/* Emoji Picker Popover */}
          {showEmojis && (
            <div className="absolute bottom-full right-4 mb-2 bg-surface border border-white/10 rounded-2xl p-3 shadow-2xl glass-panel animate-in zoom-in-95 duration-200 z-50">
              <div className="grid grid-cols-6 gap-2">
                {EMOJIS.map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors flex-shrink-0">
            <Plus size={22} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              className="w-full bg-transparent text-white py-3 px-2 focus:outline-none focus:ring-0 focus:border-transparent text-sm resize-none max-h-32 min-h-[44px] border-none outline-none"
              rows={1}
            />
          </div>

          <div className="flex items-center gap-1 pr-1 pb-0.5">
            {!message.trim() && !showEmojis && (
              <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors flex-shrink-0">
                <Mic size={20} />
              </button>
            )}
            
            <button 
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${showEmojis ? 'text-primary-pink bg-primary-pink/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Smile size={20} />
            </button>
            
            <button 
              onClick={handleSend}
              className={`p-2.5 rounded-full transition-all duration-300 flex-shrink-0 flex items-center justify-center ${
                message.trim() 
                  ? 'bg-primary-pink text-white hover:bg-primary-pink-hover shadow-[0_0_15px_rgba(255,105,180,0.4)] scale-100' 
                  : 'bg-surface-light text-gray-400 scale-90 opacity-0 absolute pointer-events-none'
              }`}
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
      {/* Call Overlay */}
      {activeCall && <CallOverlay type={activeCall} onClose={() => setActiveCall(null)} user={chat.user} />}
    </div>
  );
};

export default ActiveChat;
