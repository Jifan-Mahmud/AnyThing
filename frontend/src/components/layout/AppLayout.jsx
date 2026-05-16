import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import CreatePostModal from '../feed/CreatePostModal';
import { Heart, MessageSquare } from 'lucide-react';

const AppLayout = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-darker text-white flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-darker/90 backdrop-blur-md z-40 shrink-0">
        <Link to="/app" className="text-2xl font-black tracking-tighter italic text-white">
          Any<span className="text-primary-pink drop-shadow-[0_0_10px_rgba(255,105,180,0.3)]">Thing</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/app/notifications" className="text-white hover:text-primary-pink transition-colors">
            <Heart size={24} />
          </Link>
          <Link to="/app/messages" className="text-white hover:text-primary-pink transition-colors relative">
            <MessageSquare size={24} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-pink rounded-full border-2 border-bg-darker"></span>
          </Link>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-white/5 bg-bg-dark shrink-0">
        <Sidebar onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative h-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-bg-dark/95 backdrop-blur-md z-50">
        <MobileNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </div>

      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </div>
  );
};

export default AppLayout;
