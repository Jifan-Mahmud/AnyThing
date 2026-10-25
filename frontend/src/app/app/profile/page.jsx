'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Grid,
  Bookmark,
  UserPlus,
  Image as ImageIcon,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Avatar from '../../../components/ui/Avatar';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import EditProfileModal from '../../../components/profile/EditProfileModal';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

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

  const handleShareProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile URL copied to clipboard!');
    }
  };

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
    username: user?.username || 'creator',
    name: user?.name || user?.username || 'Creator Profile',
    bio: '',
    avatarUrl: user?.avatarUrl || '',
    posts: 0,
    followerCount: 0,
    followingCount: 0,
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
      {/* Profile Header Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl sm:rounded-[32px] p-6 sm:p-8 border border-white/5 shadow-2xl mb-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 sm:gap-8">
          {/* Avatar with Glow Ring */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="relative shrink-0">
              <Avatar
                src={
                  displayUser.avatarUrl ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'
                }
                size="xl"
                hasStory={true}
                className="w-20 h-20 sm:w-28 sm:h-28"
              />
            </div>

            {/* Mobile Stats */}
            <div className="flex flex-1 justify-around text-center md:hidden">
              <div>
                <span className="font-black text-lg text-white">{posts.length}</span>
                <p className="text-[11px] text-zinc-400 font-medium">Posts</p>
              </div>
              <div>
                <span className="font-black text-lg text-white">{displayUser.followerCount || 0}</span>
                <p className="text-[11px] text-zinc-400 font-medium">Followers</p>
              </div>
              <div>
                <span className="font-black text-lg text-white">{displayUser.followingCount || 0}</span>
                <p className="text-[11px] text-zinc-400 font-medium">Following</p>
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>@{displayUser.username}</span>
                  <Sparkles className="w-4 h-4 text-primary-pink" />
                </h1>
                <p className="text-xs font-semibold text-zinc-400 mt-0.5">
                  {displayUser.name || displayUser.username}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsEditOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] hover:opacity-90 text-white rounded-xl font-bold text-xs shadow-md shadow-[#ff2e83]/20 transition-all cursor-pointer"
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShareProfile}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>

            {/* Desktop Stats */}
            <div className="hidden md:flex gap-8 my-3 text-sm">
              <div>
                <span className="font-black text-white">{posts.length}</span>{' '}
                <span className="text-zinc-400 font-medium">posts</span>
              </div>
              <div>
                <span className="font-black text-white">{displayUser.followerCount || 0}</span>{' '}
                <span className="text-zinc-400 font-medium">followers</span>
              </div>
              <div>
                <span className="font-black text-white">{displayUser.followingCount || 0}</span>{' '}
                <span className="text-zinc-400 font-medium">following</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed mt-1">
              {displayUser.bio || 'Digital creator on AnyThing. Building ideas and inspiring connections.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-white/5 mb-6">
        <div className="flex gap-8">
          {[
            { id: 'posts', label: 'Posts', icon: Grid },
            { id: 'saved', label: 'Saved', icon: Bookmark },
            { id: 'tagged', label: 'Tagged', icon: UserPlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 py-3 px-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive ? 'text-primary-pink' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {isActive && (
                    <motion.div
                      layoutId="activeProfileTab"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] shadow-neon-pink"
                    />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square group cursor-pointer bg-surface overflow-hidden rounded-2xl border border-white/5 shadow-md"
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
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
                <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
                  <span className="text-primary-pink">♥</span> {post.likeCount || 0}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 my-8">
          <ImageIcon size={44} className="mx-auto mb-3 text-zinc-600" />
          <h4 className="font-bold text-base text-white mb-1">No Posts Yet</h4>
          <p className="text-xs text-zinc-400">Posts you share will appear on your profile grid.</p>
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
