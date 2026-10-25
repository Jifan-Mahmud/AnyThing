'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Sparkles } from 'lucide-react';
import { Heart, HeartFill } from '@gravity-ui/icons';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'motion/react';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const PostCard = ({ post }) => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recentComments, setRecentComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const [isFollowing, setIsFollowing] = useState(post.isFollowing || false);

  useEffect(() => {
    setIsFollowing(post.isFollowing || false);
  }, [post.isFollowing]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Please login to follow creators');
      return;
    }

    try {
      const url = `/api/follow/${post.user.id}`;
      const method = isFollowing ? 'DELETE' : 'POST';
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method,
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsFollowing(!isFollowing);
        toast.success(data.message || (isFollowing ? 'Unfollowed creator' : 'Following creator!'));
      } else {
        toast.error(data.message || 'Failed to complete request');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle follow status');
    }
  };

  const handleDoubleTap = () => {
    setLiked(true);
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 850);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setRecentComments([
      ...recentComments,
      { username: currentUser?.username || 'you', text: commentText.trim() },
    ]);
    setCommentText('');
    setShowCommentBox(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const goToProfile = () => {
    router.push('/app/profile');
  };

  const isVideo =
    post.type === 'reel' ||
    post.image?.endsWith('.mp4') ||
    post.image?.endsWith('.mov') ||
    post.image?.endsWith('.webm');

  const displayLikes = liked ? post.likes + 1 : post.likes;

  // Render caption with peach highlighted hashtags
  const renderFormattedCaption = (text) => {
    if (!text) return null;
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={index}
            className="text-[#ffa07a] font-semibold hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel rounded-[26px] sm:rounded-[30px] overflow-hidden mb-6 border border-white/[0.08] hover:border-white/15 transition-all shadow-2xl shadow-black/40 sm:max-w-xl md:max-w-2xl mx-auto w-full select-none"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goToProfile}>
          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Avatar src={post.user?.avatar} size="md" hasStory={post.user?.hasStory} />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white group-hover:text-primary-pink transition-colors">
                {post.user?.username}
              </h4>
              <Sparkles className="w-3.5 h-3.5 text-soft-peach" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
              <span>{formatTimeAgo(post.timeAgo || post.createdAt)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span className="text-zinc-500">{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && post.user?.id === currentUser._id ? (
            <button className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer">
              <MoreHorizontal size={19} />
            </button>
          ) : (
            post.user?.username !== 'jason_creativ' && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFollowToggle}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/15 backdrop-blur-md'
                    : 'bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] text-white shadow-md shadow-[#ff2e83]/30 hover:opacity-95'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </motion.button>
            )
          )}
        </div>
      </div>

      {/* Post Media Container */}
      <div
        className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-bg-darker cursor-pointer overflow-hidden group select-none"
        onDoubleClick={handleDoubleTap}
      >
        {isVideo ? (
          <video
            src={post.image}
            className="w-full h-full object-cover"
            controls
            playsInline
            muted
          />
        ) : (
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            loading="lazy"
          />
        )}

        {/* Double-tap Heart Burst Animation */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 0.95] }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <HeartFill className="w-24 h-24 text-primary-pink drop-shadow-[0_0_30px_rgba(255,46,131,0.9)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions & Metadata */}
      <div className="p-4 sm:p-5">
        {/* Action Buttons Row */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setLiked(!liked)}
              className="cursor-pointer transition-colors"
              aria-label="Like post"
            >
              {liked ? (
                <HeartFill className="w-6 h-6 text-primary-pink drop-shadow-[0_0_12px_rgba(255,46,131,0.7)]" />
              ) : (
                <Heart className="w-6 h-6 text-zinc-300 hover:text-white" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Comments"
            >
              <MessageCircle size={23} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Send size={23} className="-mt-0.5" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setSaved(!saved)}
            className="cursor-pointer transition-colors text-zinc-300 hover:text-white"
            aria-label="Save"
          >
            <Bookmark size={23} fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Social Proof / Likes Counter with Avatar Stack */}
        <div className="flex items-center gap-2 mb-2.5">
          {displayLikes > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-bg-darker"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=U1"
                  alt=""
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-bg-darker"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=U2"
                  alt=""
                />
                <img
                  className="inline-block h-5 w-5 rounded-full ring-2 ring-bg-darker"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=U3"
                  alt=""
                />
              </div>
              <p className="text-xs text-zinc-300 font-medium">
                Liked by <span className="font-bold text-white">creators</span> and{' '}
                <span className="font-bold text-white">{displayLikes.toLocaleString()} others</span>
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 font-medium">
              Be the first to <span onClick={() => setLiked(true)} className="text-primary-pink font-bold hover:underline cursor-pointer">like this</span>
            </p>
          )}
        </div>

        {/* Caption */}
        <div className="text-xs sm:text-sm leading-relaxed mb-2">
          <span
            onClick={goToProfile}
            className="font-bold text-white mr-2 cursor-pointer hover:text-primary-pink transition-colors"
          >
            {post.user?.username}
          </span>
          <span className="text-zinc-200">
            {renderFormattedCaption(post.caption)}
          </span>
        </div>

        {/* Recent Comments */}
        {recentComments.map((comment, idx) => (
          <div key={idx} className="text-xs sm:text-sm mt-1.5 flex items-start gap-1.5">
            <span className="font-bold text-white">{comment.username}</span>
            <span className="text-zinc-300">{comment.text}</span>
          </div>
        ))}

        {/* Comments Link */}
        <button
          onClick={() => setShowCommentBox(true)}
          className="text-zinc-400 text-xs mt-2 hover:text-zinc-200 transition-colors font-medium block cursor-pointer"
        >
          View all {post.comments + recentComments.length} comments
        </button>

        {/* Add Comment Input Bar */}
        {showCommentBox && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-white/5 flex items-center gap-3"
          >
            <Avatar
              src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'}
              size="sm"
            />
            <div className="flex-1 relative flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-primary-pink/50">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                className="w-full bg-transparent text-xs sm:text-sm text-white focus:outline-none placeholder-zinc-500 font-medium"
                autoFocus
              />
              {!commentText && (
                <Smile
                  size={18}
                  className="text-zinc-400 hover:text-white cursor-pointer transition-colors"
                />
              )}
            </div>
            {commentText && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddComment}
                className="text-primary-pink text-xs font-bold hover:text-primary-pink-hover transition-colors px-2 cursor-pointer"
              >
                Post
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </motion.article>
  );
};

export default PostCard;
