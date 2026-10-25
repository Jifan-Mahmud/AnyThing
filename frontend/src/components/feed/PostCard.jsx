'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Sparkles } from 'lucide-react';
import { Heart, HeartFill } from '@gravity-ui/icons';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'motion/react';

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
    setTimeout(() => setShowHeartBurst(false), 900);
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-xl hover:border-white/10 transition-all sm:max-w-xl md:max-w-2xl mx-auto w-full select-none"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goToProfile}>
          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Avatar src={post.user?.avatar} size="md" hasStory={post.user?.hasStory} />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white group-hover:text-primary-pink transition-colors">
                {post.user?.username}
              </h4>
              {post.user?.isVerified && (
                <Sparkles className="w-3.5 h-3.5 text-primary-pink" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">
              {post.location || post.timeAgo}
            </p>
          </div>
        </div>

        {currentUser && post.user?.id === currentUser._id ? (
          <button className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
            <MoreHorizontal size={18} />
          </button>
        ) : (
          post.user?.username !== 'jason_creativ' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFollowToggle}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                isFollowing
                  ? 'text-zinc-400 bg-white/5 hover:text-white hover:bg-white/10'
                  : 'text-primary-pink bg-primary-pink/10 hover:bg-primary-pink hover:text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )
        )}
      </div>

      {/* Post Media Container */}
      <div
        className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-bg-darker cursor-pointer overflow-hidden group"
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
              <HeartFill className="w-24 h-24 text-primary-pink drop-shadow-[0_0_25px_rgba(255,75,152,0.85)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions & Metadata */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setLiked(!liked)}
              className="cursor-pointer transition-colors"
              aria-label="Like post"
            >
              {liked ? (
                <HeartFill className="w-6 h-6 text-primary-pink drop-shadow-[0_0_10px_rgba(255,75,152,0.6)]" />
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
              <MessageCircle size={22} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Send size={22} className="-mt-0.5" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setSaved(!saved)}
            className="cursor-pointer transition-colors text-zinc-300 hover:text-white"
            aria-label="Save"
          >
            <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Likes Count */}
        <div className="font-bold text-xs sm:text-sm mb-2 text-white tracking-tight">
          {liked ? (post.likes + 1).toLocaleString() : post.likes.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="text-xs sm:text-sm leading-relaxed mb-2">
          <span
            onClick={goToProfile}
            className="font-bold text-white mr-2 cursor-pointer hover:text-primary-pink transition-colors"
          >
            {post.user?.username}
          </span>
          <span className="text-zinc-300">{post.caption}</span>
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
          className="text-zinc-400 text-xs mt-2 hover:text-zinc-200 transition-colors font-medium block"
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
            <div className="flex-1 relative flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-primary-pink/40">
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
