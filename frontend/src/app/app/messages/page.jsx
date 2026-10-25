'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ChatList from '../../../components/messages/ChatList';
import ActiveChat from '../../../components/messages/ActiveChat';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { apiClient } from '../../../utils/apiClient';
import { useSocket } from '../../../context/SocketContext';
import { useAuth } from '../../../context/AuthContext';

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [following, setFollowing] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchFollowing = async () => {
      try {
        const response = await apiClient.get('/users/me/following');
        if (isMounted) {
          setFollowing(response.data.data?.users || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchFollowing();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (!activeConversationId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    let isMounted = true;
    setLoadingChat(true);

    const loadChatData = async () => {
      try {
        const [convRes, msgRes] = await Promise.all([
          apiClient.get(`/conversations/${activeConversationId}`),
          apiClient.get(`/messages/${activeConversationId}`),
        ]);

        if (isMounted) {
          setActiveConversation(convRes.data.data);
          setMessages(msgRes.data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoadingChat(false);
        }
      }
    };

    loadChatData();

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  useEffect(() => {
    if (socket) {
      const handleNewMsg = (message) => {
        if (message.conversationId === activeConversationId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };
      socket.on('newMessage', handleNewMsg);
      return () => socket.off('newMessage', handleNewMsg);
    }
  }, [socket, activeConversationId]);

  const handleSelectUser = useCallback(async (selectedUser) => {
    try {
      setLoadingChat(true);
      const response = await apiClient.post('/conversations', {
        participants: [user._id, selectedUser._id],
      });
      setActiveConversationId(response.data.data._id);
    } catch (err) {
      setError(err.message);
      setLoadingChat(false);
    }
  }, [user]);

  const handleBack = useCallback(() => {
    setActiveConversationId(null);
    setActiveConversation(null);
  }, []);

  return (
    <div className="flex h-full w-full">
      {/* Chat List - Hidden on mobile if a chat is active */}
      <div
        className={`h-full ${
          activeConversationId ? 'hidden md:block' : 'w-full'
        } md:w-80 lg:w-96 shrink-0`}
      >
        <ChatList
          users={following}
          loading={loading}
          error={error}
          onSelectUser={handleSelectUser}
        />
      </div>

      {/* Active Chat Pane */}
      <div className={`flex-1 h-full ${!activeConversationId ? 'hidden md:flex' : 'w-full flex'}`}>
        {loadingChat ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-bg-darker text-white p-6">
            <LoadingSpinner
              size="lg"
              text="Opening conversation..."
              subtext="Loading message history"
            />
          </div>
        ) : activeConversation ? (
          <ActiveChat
            conversation={activeConversation}
            messages={messages}
            onBack={handleBack}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-bg-darker text-gray-400">
            <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center mb-4 glass-panel shadow-[0_0_20px_rgba(255,105,180,0.15)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-12 h-12 text-primary-pink"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
            <p className="text-sm">Send private messages and make calls with friends.</p>
          </div>
        )}
      </div>
    </div>
  );
}
