'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import MobileNav from '../../components/layout/MobileNav';
import CreatePostModal from '../../components/feed/CreatePostModal';
import { Heart, Envelope } from '@gravity-ui/icons';
import { Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AppProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        size="lg"
        text="Loading AnyThing..."
        subtext="Syncing your feed, stories and messages..."
      />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-darker text-white flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-darker/90 backdrop-blur-xl z-40 shrink-0">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-pink to-purple-600 flex items-center justify-center shadow-md shadow-primary-pink/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight italic text-white">
            Any<span className="text-primary-pink text-glow">Thing</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/app/notifications"
            className="text-zinc-400 hover:text-primary-pink transition-colors p-1"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <Link
            href="/app/messages"
            className="text-zinc-400 hover:text-primary-pink transition-colors relative p-1"
          >
            <Envelope className="w-5 h-5" />
            <span className="absolute 0 top-0.5 right-0.5 w-2 h-2 bg-primary-pink rounded-full ring-2 ring-bg-darker" />
          </Link>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 h-full">
        <Sidebar onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative h-full">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50">
        <MobileNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
}
