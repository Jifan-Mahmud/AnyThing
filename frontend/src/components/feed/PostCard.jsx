import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recentComments, setRecentComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [isFollowing, setIsFollowing] = useState(post.isFollowing || false);

  useEffect(() => {
    setIsFollowing(post.isFollowing || false);
  }, [post.isFollowing]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login to follow creators");
      return;
    }
    
    try {
      const url = `/api/follow/${post.user.id}`;
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsFollowing(!isFollowing);
        toast.success(data.message || (isFollowing ? "Unfollowed creator" : "Following creator!"));
      } else {
        toast.error(data.message || "Failed to complete request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle follow status");
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setRecentComments([...recentComments, { username: 'you', text: commentText.trim() }]);
    setCommentText('');
    setShowCommentBox(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const goToProfile = () => {
    navigate('/app/profile', { state: { user: post.user, from: location.pathname } });
  };

  return (
    <div className="bg-surface md:rounded-3xl overflow-hidden mb-2 md:mb-8 border-y md:border border-white/5 md:shadow-lg sm:max-w-xl md:max-w-2xl mx-auto w-full">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goToProfile}>
          <div className="group-hover:scale-105 transition-transform">
            <Avatar src={post.user.avatar} size="md" hasStory={post.user.hasStory} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white group-hover:underline">{post.user.username}</h4>
            <p className="text-xs text-gray-400">{post.location || post.timeAgo}</p>
          </div>
        </div>
        {currentUser && post.user.id === currentUser._id ? (
          <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5">
            <MoreHorizontal size={20} />
          </button>
        ) : (
          post.user.username !== 'jason_creativ' && (
            <button 
              onClick={handleFollowToggle}
              className={`text-sm font-bold transition-colors ${
                isFollowing 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-primary-pink hover:text-primary-pink-hover'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )
        )}
      </div>

      {/* Post Image / Video */}
      <div
        className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-bg-darker cursor-pointer group animate-in fade-in duration-300"
        onDoubleClick={() => setLiked(true)}
      >
        {post.type === 'reel' || post.image?.endsWith('.mp4') || post.image?.endsWith('.mov') || post.image?.endsWith('.webm') ? (
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
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        )}
        {/* Heart Overlay Animation */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 z-10 ${liked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <Heart size={100} className="text-white drop-shadow-2xl fill-white" />
        </div>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`transition-colors hover:scale-110 active:scale-95 duration-200 ${liked ? 'text-primary-pink' : 'text-white hover:text-gray-300'}`}
            >
              <Heart size={26} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => setShowCommentBox(true)}
              className="text-white hover:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <MessageCircle size={26} />
            </button>
            <button className="text-white hover:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-200">
              <Send size={26} className="-mt-1" />
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className={`transition-colors hover:scale-110 active:scale-95 duration-200 ${saved ? 'text-white' : 'text-white hover:text-gray-300'}`}
          >
            <Bookmark size={26} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2 text-white">
          {liked ? (post.likes + 1).toLocaleString() : post.likes.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="text-sm mb-1">
          <span className="font-semibold text-white mr-2">{post.user.username}</span>
          <span className="text-gray-200">{post.caption}</span>
        </div>

        {/* Recent Comments */}
        {recentComments.map((comment, idx) => (
          <div key={idx} className="text-sm mt-1 animate-in fade-in slide-in-from-top-2">
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
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" size="md" />
            <div className="flex-1 relative flex items-center bg-bg-darker/50 rounded-full px-4 py-2.5 outline-none border-none">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..." 
                className="w-full bg-transparent text-base text-white border-none focus:outline-none focus:ring-0 placeholder-gray-500"
                autoFocus={showCommentBox}
              />
              {!commentText && <Smile size={20} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />}
            </div>
            {commentText && (
              <button 
                onClick={handleAddComment}
                className="text-primary-pink text-base font-bold hover:text-primary-pink-hover transition-colors px-2"
              >
                Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
