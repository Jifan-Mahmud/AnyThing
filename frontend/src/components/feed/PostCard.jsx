import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import Avatar from '../ui/Avatar';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-surface rounded-3xl overflow-hidden mb-8 border border-white/5">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar src={post.user.avatar} size="md" hasStory={post.user.hasStory} />
          <div>
            <h4 className="text-sm font-semibold text-white">{post.user.username}</h4>
            <p className="text-xs text-gray-400">{post.location || post.timeAgo}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image */}
      <div 
        className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-bg-darker cursor-pointer group"
        onDoubleClick={() => setLiked(true)}
      >
        <img 
          src={post.image} 
          alt="Post content" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        {/* Heart Overlay Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-0 active:opacity-100 active:scale-150 transition-all duration-300 pointer-events-none">
          <Heart size={80} className="text-white drop-shadow-2xl fill-white" />
        </div>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLiked(!liked)}
              className={`transition-colors ${liked ? 'text-primary-pink' : 'text-white hover:text-gray-300'}`}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <MessageCircle size={24} />
            </button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <Send size={24} />
            </button>
          </div>
          <button 
            onClick={() => setSaved(!saved)}
            className={`transition-colors ${saved ? 'text-white' : 'text-white hover:text-gray-300'}`}
          >
            <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2">
          {liked ? (post.likes + 1).toLocaleString() : post.likes.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span className="text-gray-300">{post.caption}</span>
        </div>

        {/* Comments Link */}
        <div className="text-gray-500 text-sm mt-2 cursor-pointer hover:text-gray-400">
          View all {post.comments} comments
        </div>
      </div>
    </div>
  );
};

export default PostCard;
