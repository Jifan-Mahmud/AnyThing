'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Music,
  Volume2,
  VolumeX,
  X,
  Loader2,
  Smile,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Avatar from '../../../components/ui/Avatar';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_REELS = [
  {
    id: 'mock1',
    video: 'https://res.cloudinary.com/mmquu2ps/video/upload/v1785047869/posts/nixnmu8iap3w0vqhajeb.mp4',
    username: 'jason_creativ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    caption: 'Neon obsidian vibes only. ✨ What do you think of this aesthetic? #neon #cyberpunk #design',
    music: 'Original Audio - jason_creativ',
    likes: '124K',
    comments: 1204,
    shares: '15K',
  },
  {
    id: 'mock2',
    video: 'https://res.cloudinary.com/mmquu2ps/video/upload/v1783952896/posts/pttivngorgifmzfkdj27.mp4',
    username: 'sarah_codes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    caption: 'Building the next evolution of social media, one line at a time. 💻🔥 #coding #setup #developer',
    music: 'Trending Song - Lofi Beats',
    likes: '89K',
    comments: 432,
    shares: '8K',
  },
];

const ReelItem = ({ reel, isActive, isMuted, toggleMute }) => {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recentComments, setRecentComments] = useState([]);

  const goToProfile = (e) => {
    e.stopPropagation();
    router.push('/app/profile');
  };

  useEffect(() => {
    if (isActive && videoRef.current && !showComments) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else if (videoRef.current) {
      videoRef.current.pause();
      if (!showComments) videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive, showComments]);

  const togglePlay = () => {
    if (showComments) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleClick = (e) => {
    if (showComments) return;
    e.stopPropagation();
    setIsLiked(true);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setRecentComments([...recentComments, { username: 'you', text: commentText.trim() }]);
    setCommentText('');
    setShowComments(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  return (
    <div className="relative h-full w-full max-w-md mx-auto snap-start bg-black flex items-center justify-center overflow-hidden shrink-0 snap-always select-none">
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.video}
        className="h-full w-full object-cover"
        loop
        muted={isMuted}
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
        playsInline
      />

      {/* Play/Pause overlay */}
      {!isPlaying && !showComments && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Top Controls (Mute) */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="p-2.5 bg-black/50 backdrop-blur-xl rounded-full text-white hover:bg-black/70 transition shadow-lg cursor-pointer"
          aria-label="Toggle audio"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
      </div>

      {/* Right side floating action buttons */}
      <div
        className={`absolute bottom-24 right-4 flex flex-col items-center gap-5 z-20 transition-opacity duration-300 ${
          showComments ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <div className="p-3 bg-black/50 rounded-full group-hover:bg-black/70 transition backdrop-blur-xl border border-white/10 shadow-lg">
            <Heart
              size={24}
              className={isLiked ? 'fill-primary-pink text-primary-pink drop-shadow-[0_0_12px_rgba(255,75,152,0.8)]' : 'text-white'}
            />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">{reel.likes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(true);
          }}
        >
          <div className="p-3 bg-black/50 rounded-full group-hover:bg-black/70 transition backdrop-blur-xl border border-white/10 shadow-lg">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">
            {(reel.comments + recentComments.length).toLocaleString()}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="p-3 bg-black/50 rounded-full group-hover:bg-black/70 transition backdrop-blur-xl border border-white/10 shadow-lg">
            <Send size={24} className="text-white -mt-0.5" />
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">{reel.shares}</span>
        </motion.button>

        <button className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition backdrop-blur-xl border border-white/10 mt-1 cursor-pointer">
          <MoreHorizontal size={20} className="text-white" />
        </button>

        <div
          className="w-9 h-9 mt-3 rounded-full border-2 border-primary-pink overflow-hidden animate-spin shadow-neon-pink"
          style={{ animationDuration: '6s' }}
        >
          <img src={reel.avatar} alt="music cover" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bottom Creator Info & Caption */}
      <div
        className={`absolute bottom-6 left-4 right-20 z-20 transition-opacity duration-300 ${
          showComments ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div className="cursor-pointer" onClick={goToProfile}>
            <Avatar src={reel.avatar} size="sm" className="border border-white/30 shadow-lg" />
          </div>
          <span
            className="text-white font-bold text-sm drop-shadow-md hover:text-primary-pink transition-colors cursor-pointer"
            onClick={goToProfile}
          >
            @{reel.username}
          </span>
          {reel.username !== 'you' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFollowing(!isFollowing);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                isFollowing
                  ? 'bg-white/20 text-white backdrop-blur-md border border-white/30'
                  : 'bg-primary-pink text-white shadow-md shadow-primary-pink/30 hover:bg-primary-pink-hover'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <p className="text-white text-xs sm:text-sm mb-3 drop-shadow-md line-clamp-2 leading-relaxed">
          {reel.caption}
        </p>

        <div className="flex items-center gap-2 text-white bg-black/50 w-max px-3 py-1.5 rounded-full backdrop-blur-xl border border-white/10 shadow-lg">
          <Music size={13} className="animate-pulse text-primary-pink" />
          <span className="text-[11px] font-semibold">{reel.music}</span>
        </div>
      </div>

      {/* Comments Bottom Sheet Overlay */}
      {showComments && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="h-[65%] w-full bg-surface rounded-t-3xl flex flex-col shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom-full duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 relative">
              <div className="w-10 h-1 bg-white/20 rounded-full absolute top-2.5 left-1/2 -translate-x-1/2" />
              <h3 className="text-white font-bold text-sm text-center flex-1 mt-2">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full transition-colors mt-2 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              <div className="flex gap-3">
                <Avatar src={reel.avatar} size="sm" />
                <div>
                  <span className="font-bold text-white text-xs mr-2">{reel.username}</span>
                  <span className="text-xs text-zinc-300">{reel.caption}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" size="sm" />
                <div>
                  <span className="font-bold text-white text-xs mr-2">alex_dev</span>
                  <span className="text-xs text-zinc-300">This aesthetic is gorgeous! 🔥</span>
                </div>
              </div>

              {recentComments.map((comment, idx) => (
                <div key={idx} className="flex gap-3 animate-in slide-in-from-right-4 fade-in">
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" size="sm" />
                  <div>
                    <span className="font-bold text-white text-xs mr-2">{comment.username}</span>
                    <span className="text-xs text-zinc-300">{comment.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="p-3 border-t border-white/5 bg-bg-darker">
              <div className="flex items-center gap-3 bg-surface rounded-full px-4 py-2.5 border border-white/10">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" size="sm" />
                <div className="flex-1 relative flex items-center">
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
                      className="text-zinc-500 hover:text-white cursor-pointer transition-colors absolute right-1"
                    />
                  )}
                </div>
                {commentText && (
                  <button
                    onClick={handleAddComment}
                    className="text-primary-pink text-xs font-bold hover:text-primary-pink-hover transition-colors px-1 cursor-pointer"
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);

  const fetchReels = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/posts?type=reel', { headers, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success && data.data.posts?.length > 0) {
        const mapped = data.data.posts.map((r) => ({
          id: r._id,
          video: r.imageUrl,
          username: r.author?.username || 'unknown',
          avatar:
            r.author?.avatarUrl ||
            'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
          caption: r.caption || '',
          music: 'Original Audio',
          likes: r.likeCount || 0,
          comments: 0,
          shares: 0,
        }));
        setReels(mapped);
      } else {
        setReels(MOCK_REELS);
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
      setReels(MOCK_REELS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const index = Math.round(
          containerRef.current.scrollTop / containerRef.current.clientHeight
        );
        setActiveIndex(index);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [reels]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black p-12">
        <LoadingSpinner
          size="lg"
          text="Loading reels..."
          subtext="Immersive video feed"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black flex justify-center">
      <div
        ref={containerRef}
        className="h-full w-full max-w-md overflow-y-scroll snap-y snap-mandatory scroll-smooth flex flex-col hide-scrollbar relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => (
          <ReelItem
            key={reel.id}
            reel={reel}
            isActive={index === activeIndex}
            isMuted={isMuted}
            toggleMute={() => setIsMuted(!isMuted)}
          />
        ))}
      </div>
    </div>
  );
}
