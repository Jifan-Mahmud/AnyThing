import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import CreatePostModal from '../feed/CreatePostModal';

const AppLayout = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-darker text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-white/5 bg-bg-dark">
        <Sidebar onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto pb-16 md:pb-0 relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-bg-dark/80 backdrop-blur-md z-50">
        <MobileNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </div>

      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
    </div>
  );
};

export default AppLayout;
