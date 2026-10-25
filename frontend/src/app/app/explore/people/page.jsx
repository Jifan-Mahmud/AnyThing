'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Sparkles } from 'lucide-react';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import { motion } from 'motion/react';

export default function SuggestedPeoplePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());

  const fetchSuggestions = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/users/suggested?limit=50', {
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuggestions(data.data || []);
      }
    } catch (err) {
      console.error('Error loading suggestions:', err);
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const handleFollowUser = async (userId) => {
    try {
      const isFollowing = followingIds.has(userId);
      const method = isFollowing ? 'DELETE' : 'POST';
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/follow/${userId}`, {
        method,
        headers,
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          data.message || (isFollowing ? 'Unfollowed successfully' : 'Followed successfully')
        );

        setFollowingIds((prev) => {
          const next = new Set(prev);
          if (isFollowing) {
            next.delete(userId);
          } else {
            next.add(userId);
          }
          return next;
        });
      } else {
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      console.error('Error following/unfollowing user:', err);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker text-white flex justify-center">
      <div className="w-full max-w-2xl px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black italic tracking-tight text-white flex items-center gap-1.5">
              <span>Suggested <span className="text-primary-pink text-glow">Creators</span></span>
              <Sparkles className="w-4 h-4 text-primary-pink" />
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">Discover new voices and creative minds</p>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner
              size="lg"
              text="Finding creators..."
              subtext="Loading suggestions for you"
            />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-1.5 glass-panel border border-white/5 rounded-3xl p-4 md:p-6 shadow-2xl">
            {suggestions.map((u) => {
              const isFollowing = followingIds.has(u._id);
              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between py-3 px-3 hover:bg-white/[0.03] rounded-2xl transition-colors"
                >
                  <div
                    onClick={() => router.push('/app/profile')}
                    className="flex items-center gap-3.5 cursor-pointer group flex-1 min-w-0"
                  >
                    <img
                      src={
                        u.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                      }
                      alt={u.username}
                      className="w-11 h-11 rounded-full object-cover bg-bg-darker border border-white/10 group-hover:scale-105 transition-transform duration-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary-pink transition-colors truncate">
                        {u.username}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate max-w-[180px] sm:max-w-[280px]">
                        {u.name || 'Suggested creator'}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFollowUser(u._id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                      isFollowing
                        ? 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10'
                        : 'bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] text-white hover:opacity-90 shadow-md shadow-[#ff2e83]/25'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </motion.button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 my-12">
            <UserPlus size={44} className="text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No suggestions available</h3>
            <p className="text-xs text-zinc-400">You are already connected with our top creators!</p>
          </div>
        )}
      </div>
    </div>
  );
}
