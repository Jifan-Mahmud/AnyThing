import React, { useState } from 'react';
import ChatList from '../components/messages/ChatList';
import ActiveChat from '../components/messages/ActiveChat';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(1); // Default to first chat for demo

  return (
    <div className="flex h-full w-full">
      <div className={`h-full ${activeChatId ? 'hidden md:block' : 'w-full'}`}>
        <ChatList 
          activeChatId={activeChatId} 
          onSelectChat={setActiveChatId} 
        />
      </div>
      <div className={`flex-1 h-full ${!activeChatId ? 'hidden md:flex' : 'w-full'}`}>
        <ActiveChat chat={activeChatId ? { id: activeChatId } : null} />
      </div>
    </div>
  );
};

export default Messages;
