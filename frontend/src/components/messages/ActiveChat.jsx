'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Video, Phone, MoreVertical, Plus, Smile, Send, Check, CheckCheck, Mic } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { motion, AnimatePresence } from 'motion/react';

const EMOJIS = ['😂', '❤️', '🔥', '👍', '✨', '😍', '😢', '🙌', '🎉', '🥺', '💯', '😊'];

const ActiveChat = ({ conversation, messages = [], onBack }) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const { user } = useAuth();
  const { startCall } = useCall();
  const myAvatar = user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=me';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !socket || !user) return;

    const newMessage = {
      conversationId: conversation._id,
      senderId: user._id,
      text: message.trim(),
    };

    socket.emit('sendMessage', newMessage);
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
    setMessage((prev) => prev + emoji);
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center flex-col text-zinc-500 bg-bg-darker relative overflow-hidden select-none">
        <div className="aurora-bg w-96 h-96 bg-primary-pink/10 top-1/3 left-1/3" />
        <div className="relative z-10 flex flex-col items-center text-center p-6">
          <div className="w-20 h-20 rounded-3xl glass-panel flex items-center justify-center mb-5 border border-white/10 shadow-2xl">
            <Send size={32} className="text-primary-pink text-glow" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">Direct Messages</h3>
          <p className="text-sm text-zinc-400 max-w-xs">
            Select a conversation on the left to start sending real-time messages and media.
          </p>
        </div>
      </div>
    );
  }

  const otherParticipant =
    conversation.participants?.find((p) => p.username !== user?.username) ||
    conversation.participants?.[0] ||
    {};

  return (
    <div className="flex flex-col h-full flex-1 bg-bg-darker relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="aurora-bg w-80 h-80 bg-primary-pink/10 -top-20 -right-20 pointer-events-none"
        style={{ animationDuration: '18s' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/5 bg-bg-darker/80 backdrop-blur-xl z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 -ml-1 text-zinc-400 hover:text-white rounded-full transition-colors"
            aria-label="Back to contacts"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="relative">
            <Avatar src={otherParticipant.avatarUrl} size="md" isOnline={true} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight leading-tight">
              {otherParticipant.username}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] text-zinc-400 font-medium">Online now</p>
            </div>
          </div>
        </div>

        {/* Call & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() =>
              startCall(
                otherParticipant._id,
                'video',
                otherParticipant.username,
                otherParticipant.avatarUrl
              )
            }
            className="p-2 sm:p-2.5 text-zinc-400 hover:text-primary-pink hover:bg-white/5 rounded-full transition-all cursor-pointer"
            aria-label="Start video call"
          >
            <Video size={19} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() =>
              startCall(
                otherParticipant._id,
                'audio',
                otherParticipant.username,
                otherParticipant.avatarUrl
              )
            }
            className="p-2 sm:p-2.5 text-zinc-400 hover:text-primary-pink hover:bg-white/5 rounded-full transition-all cursor-pointer"
            aria-label="Start audio call"
          >
            <Phone size={19} />
          </motion.button>
          <button
            className="p-2 sm:p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            aria-label="More options"
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 z-0 scroll-smooth">
        {messages.map((msg) => {
          const isMe = (msg.senderId?._id || msg.senderId) === user?._id;
          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`flex max-w-[80%] sm:max-w-[70%] gap-2.5 ${
                  isMe ? 'flex-row-reverse' : 'flex-row'
                } items-end`}
              >
                <Avatar
                  src={isMe ? myAvatar : otherParticipant?.avatarUrl}
                  size="sm"
                  className="mb-3 shrink-0"
                />
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2.5 text-xs sm:text-sm font-medium shadow-md leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? 'bg-gradient-to-tr from-primary-pink to-[#ff1c7a] text-white rounded-2xl rounded-br-xs shadow-primary-pink/20'
                        : 'glass-panel text-zinc-200 rounded-2xl rounded-bl-xs border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 text-[10px] text-zinc-500 font-medium ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isMe && (
                      <span className={msg.seen ? 'text-primary-pink' : 'text-zinc-500'}>
                        {msg.seen ? <CheckCheck size={13} /> : <Check size={13} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <div className="p-3 sm:p-4 border-t border-white/5 bg-bg-darker/90 backdrop-blur-xl z-10">
        <div className="flex items-end gap-2 bg-surface/80 p-1.5 rounded-full relative border border-white/10 focus-within:border-primary-pink/40 shadow-inner">
          {/* Emoji Popover */}
          <AnimatePresence>
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-full right-4 mb-3 bg-surface border border-white/10 rounded-2xl p-3 shadow-2xl glass-panel z-50"
              >
                <div className="grid grid-cols-6 gap-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="p-2.5 text-zinc-400 hover:text-white rounded-full transition-colors shrink-0">
            <Plus size={20} />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              className="w-full bg-transparent text-white py-2.5 px-2 focus:outline-none text-xs sm:text-sm resize-none max-h-32 min-h-[40px] border-none font-medium placeholder-zinc-500"
              rows={1}
            />
          </div>

          <div className="flex items-center gap-1 pr-1 pb-0.5">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-2 rounded-full transition-colors shrink-0 cursor-pointer ${
                showEmojis
                  ? 'text-primary-pink bg-primary-pink/15'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smile size={19} />
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!message.trim()}
              className={`p-2.5 rounded-full transition-all duration-200 shrink-0 flex items-center justify-center cursor-pointer ${
                message.trim()
                  ? 'bg-primary-pink text-white hover:bg-primary-pink-hover shadow-lg shadow-primary-pink/30 scale-100 opacity-100'
                  : 'bg-white/5 text-zinc-500 scale-90 opacity-40 pointer-events-none'
              }`}
            >
              <Send size={16} className="ml-0.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveChat;
