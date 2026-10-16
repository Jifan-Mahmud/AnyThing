'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
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
    setRecentComments([...recentComments, { username: currentUser?.username || 'you', text: commentText.trim() }]);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface md:rounded-3xl overflow-hidden mb-4 md:mb-8 border-y md:border border-white/5 md:shadow-xl sm:max-w-xl md:max-w-2xl mx-auto w-full"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goToProfile}>
          <motion.div whileHover={{ scale: 1.05 }} className="transition-transform">
            <Avatar src={post.user?.avatar} size="md" hasStory={post.user?.hasStory} />
          </motion.div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:underline">
              {post.user?.username}
            </h4>
            <p className="text-xs text-gray-400">{post.location || post.timeAgo}</p>
          </div>
        </div>
        {currentUser && post.user?.id === currentUser._id ? (
          <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
            <MoreHorizontal size={20} />
          </button>
        ) : (
          post.user?.username !== 'jason_creativ' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFollowToggle}
              className={`text-sm font-bold transition-colors ${
                isFollowing
                  ? 'text-gray-400 hover:text-white'
                  : 'text-primary-pink hover:text-primary-pink-hover'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </motion.button>
          )
        )}
      </div>

      {/* Post Image / Video */}
      <div
        className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-bg-darker cursor-pointer group"
        onDoubleClick={handleDoubleTap}
      >
        {post.type === 'reel' ||
        post.image?.endsWith('.mp4') ||
        post.image?.endsWith('.mov') ||
        post.image?.endsWith('.webm') ? (
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
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        )}

        {/* Double-tap Heart Burst Animation with Motion */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.9] }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <HeartFill className="w-24 h-24 text-primary-pink drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setLiked(!liked)}
              className={`transition-colors duration-200 ${
                liked ? 'text-primary-pink' : 'text-white hover:text-gray-300'
              }`}
            >
              {liked ? (
                <HeartFill className="w-6 h-6 text-primary-pink drop-shadow-[0_0_8px_rgba(255,105,180,0.5)]" />
              ) : (
                <Heart className="w-6 h-6" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowCommentBox(true)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <MessageCircle size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Send size={24} className="-mt-0.5" />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setSaved(!saved)}
            className={`transition-colors duration-200 ${
              saved ? 'text-white' : 'text-white hover:text-gray-300'
            }`}
          >
            <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2 text-white">
          {liked ? (post.likes + 1).toLocaleString() : post.likes.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="text-sm mb-1">
          <span className="font-semibold text-white mr-2">{post.user?.username}</span>
          <span className="text-gray-200">{post.caption}</span>
        </div>

        {/* Recent Comments */}
        {recentComments.map((comment, idx) => (
          <div key={idx} className="text-sm mt-1 animate-in fade-in slide-in-from-top-1">
            <span className="font-semibold text-white mr-2">{comment.username}</span>
            <span className="text-gray-300">{comment.text}</span>
          </div>
        ))}

        {/* Comments Link */}
        <div
          className="text-gray-500 text-sm mt-2 cursor-pointer hover:text-gray-400 transition-colors"
          onClick={() => setShowCommentBox(true)}
        >
          View all {post.comments + recentComments.length} comments
        </div>

        {/* Add Comment Input */}
        {showCommentBox && (
          <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4 animate-in fade-in slide-in-from-top-2">
            <Avatar
              src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'}
              size="md"
            />
            <div className="flex-1 relative flex items-center bg-bg-darker/60 rounded-full px-4 py-2.5 border border-white/10">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
                autoFocus={showCommentBox}
              />
              {!commentText && (
                <Smile
                  size={20}
                  className="text-gray-500 cursor-pointer hover:text-white transition-colors"
                />
              )}
            </div>
            {commentText && (
              <button
                onClick={handleAddComment}
                className="text-primary-pink text-sm font-bold hover:text-primary-pink-hover transition-colors px-2"
              >
                Post
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;
