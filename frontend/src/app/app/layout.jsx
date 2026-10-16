'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import MobileNav from '../../components/layout/MobileNav';
import CreatePostModal from '../../components/feed/CreatePostModal';
import { Heart, Envelope } from '@gravity-ui/icons';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-bg-darker flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary-pink" size={40} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-darker text-white flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-darker/90 backdrop-blur-md z-40 shrink-0">
        <Link href="/app" className="text-2xl font-black tracking-tighter italic text-white">
          Any<span className="text-primary-pink drop-shadow-[0_0_10px_rgba(255,105,180,0.4)]">Thing</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/app/notifications"
            className="text-white hover:text-primary-pink transition-colors"
          >
            <Heart className="w-6 h-6" />
          </Link>
          <Link
            href="/app/messages"
            className="text-white hover:text-primary-pink transition-colors relative"
          >
            <Envelope className="w-6 h-6" />
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
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-bg-dark/95 backdrop-blur-md z-50">
        <MobileNav onOpenCreatePost={() => setIsCreatePostOpen(true)} />
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
}
