'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Grid,
  Bookmark,
  UserPlus,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Avatar from '../../../components/ui/Avatar';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import EditProfileModal from '../../../components/profile/EditProfileModal';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let targetUser = null;

      const res = await fetch(`/api/me`, { headers, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        targetUser = data.data;
      } else {
        targetUser = user;
      }

      setProfileData(targetUser);

      if (targetUser?._id) {
        const postsRes = await fetch(`/api/users/${targetUser._id}/posts`, {
          headers,
          credentials: 'include',
        });
        const postsData = await postsRes.json();
        if (postsRes.ok && postsData.success) {
          setPosts(postsData.data.posts || []);
        }
      }
    } catch (err) {
      console.error('Error fetching profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileAndPosts();
    }
  }, [user]);

  if (loading && !profileData) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <LoadingSpinner
          size="lg"
          text="Loading profile..."
          subtext="Fetching stats and posts"
        />
      </div>
    );
  }

  const displayUser = profileData || {
    username: user?.username || 'loading',
    name: user?.name || user?.username || 'User Profile',
    bio: '',
    avatarUrl: user?.avatarUrl || '',
    posts: 0,
    followers: 0,
    following: 0,
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 py-6 md:py-8 md:px-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:gap-8 mb-8 md:mb-12">
        {/* Mobile: Avatar and Stats side by side */}
        <div className="flex items-center gap-6 md:gap-8 mb-4 md:mb-0">
          <div className="flex-shrink-0">
            <Avatar
              src={
                displayUser.avatarUrl ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'
              }
              size="xl"
              className="border-4 border-surface w-20 h-20 md:w-32 md:h-32 shadow-xl"
            />
          </div>

          {/* Stats (Mobile only view) */}
          <div className="flex flex-1 justify-around text-center md:hidden">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{posts.length}</span>
              <span className="text-gray-400 text-xs">posts</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{displayUser.followerCount || 0}</span>
              <span className="text-gray-400 text-xs">followers</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{displayUser.followingCount || 0}</span>
              <span className="text-gray-400 text-xs">following</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold">@{displayUser.username}</h1>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditOpen(true)}
                className="flex-1 md:flex-none px-4 py-1.5 bg-surface-light text-white rounded-xl font-semibold text-sm hover:bg-surface transition-colors"
              >
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:flex-none px-4 py-1.5 bg-surface-light text-white rounded-xl font-semibold text-sm hover:bg-surface transition-colors"
              >
                Share Profile
              </motion.button>
              <button className="p-2 bg-surface-light text-white rounded-xl hover:bg-surface transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Stats (Desktop only view) */}
          <div className="hidden md:flex gap-10 mb-6 text-sm md:text-base">
            <div>
              <span className="font-bold text-white">{posts.length}</span>{' '}
              <span className="text-gray-400">posts</span>
            </div>
            <div className="cursor-pointer">
              <span className="font-bold text-white">{displayUser.followerCount || 0}</span>{' '}
              <span className="text-gray-400">followers</span>
            </div>
            <div className="cursor-pointer">
              <span className="font-bold text-white">{displayUser.followingCount || 0}</span>{' '}
              <span className="text-gray-400">following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="text-sm md:text-base">
            <h2 className="font-bold text-white">{displayUser.name || displayUser.username}</h2>
            <p className="whitespace-pre-line text-gray-300 mt-1">
              {displayUser.bio || 'No bio yet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around md:justify-center border-t border-white/10 mb-1 md:mb-6">
        <div className="flex w-full md:w-auto md:gap-12 justify-around">
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 md:py-4 border-t-2 border-primary-pink text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <Grid size={22} className="md:w-4 md:h-4" />{' '}
            <span className="hidden md:inline">Posts</span>
          </button>
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 md:py-4 border-t-2 border-transparent text-gray-400 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <Bookmark size={22} className="md:w-4 md:h-4" />{' '}
            <span className="hidden md:inline">Saved</span>
          </button>
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 md:py-4 border-t-2 border-transparent text-gray-400 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <UserPlus size={22} className="md:w-4 md:h-4" />{' '}
            <span className="hidden md:inline">Tagged</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square group cursor-pointer bg-surface overflow-hidden rounded-xl md:rounded-2xl shadow-md"
            >
              {post.type === 'reel' ? (
                <video
                  src={post.imageUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  onMouseOver={(e) => e.target.play().catch(() => {})}
                  onMouseOut={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
              ) : (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="text-xl text-primary-pink">♥</span> {post.likeCount || 0}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <ImageIcon size={48} className="mb-3 text-gray-600" />
          <p className="text-sm font-semibold">No Posts Yet</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdateSuccess={fetchProfileAndPosts}
      />
    </div>
  );
}
