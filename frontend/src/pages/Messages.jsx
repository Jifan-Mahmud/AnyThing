import React, { useState } from 'react';
import ChatList, { MOCK_CHATS } from '../components/messages/ChatList';
import ActiveChat from '../components/messages/ActiveChat';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(null); // Default to null for mobile list view

  const activeChat = MOCK_CHATS.find(chat => chat.id === activeChatId);

  return (
    <div className="flex h-full w-full">
      {/* Chat List - Hidden on mobile if a chat is active */}
      <div className={`h-full ${activeChatId ? 'hidden md:block' : 'w-full'} md:w-80 lg:w-96 shrink-0`}>
        <ChatList 
          activeChatId={activeChatId} 
          onSelectChat={setActiveChatId} 
        />
      </div>

      {/* Active Chat - Hidden on mobile if NO chat is active */}
      <div className={`flex-1 h-full ${!activeChatId ? 'hidden md:flex' : 'w-full flex'}`}>
        {activeChat ? (
          <ActiveChat chat={activeChat} onBack={() => setActiveChatId(null)} />
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
