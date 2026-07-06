import React, { useState, useEffect } from 'react';
import ChatList from '../components/messages/ChatList';
import ActiveChat from '../components/messages/ActiveChat';
import { apiClient } from '../utils/apiClient';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [following, setFollowing] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await apiClient.get('/users/me/following');
        console.log(response.data.data.users);
        setFollowing(response.data.data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      const fetchConversation = async () => {
        try {
          const response = await apiClient.get(
            `/conversations/${activeConversationId}`
          );
          setActiveConversation(response.data.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchConversation();

      const fetchMessages = async () => {
        try {
          const response = await apiClient.get(
            `/messages/${activeConversationId}`
          );
          setMessages(response.data.data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchMessages();
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (message.conversationId === activeConversationId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [socket, activeConversationId]);

  const handleSelectUser = async (selectedUser) => {
    try {
      const response = await apiClient.post('/conversations', {
        participants: [user._id, selectedUser._id],
      });
      setActiveConversationId(response.data.data._id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Chat List - Hidden on mobile if a chat is active */}
      <div className={`h-full ${activeConversationId ? 'hidden md:block' : 'w-full'} md:w-80 lg:w-96 shrink-0`}>
        <ChatList 
          users={following}
          loading={loading}
          error={error}
          onSelectUser={handleSelectUser} 
        />
      </div>

      {/* Active Chat - Hidden on mobile if NO chat is active */}
      <div className={`flex-1 h-full ${!activeConversationId ? 'hidden md:flex' : 'w-full flex'}`}>
        {activeConversation ? (
          <ActiveChat 
            conversation={activeConversation}
            messages={messages} 
            onBack={() => setActiveConversationId(null)} 
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center w-full h-full bg-bg-darker text-gray-400">
            <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
            <p>Send private photos and messages to a friend or group.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
