import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Music, Volume2, VolumeX, X, Smile, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';

// Import local assets for fallbacks
import reel1 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM.mp4';
import reel2 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM (1).mp4';

const MOCK_REELS = [
  {
    id: 'mock1',
    video: reel1,
    username: 'jason_creativ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    caption: 'Neon vibes only. ✨ What do you think of this aesthetic? #neon #cyberpunk #design',
    music: 'Original Audio - jason_creativ',
    likes: '124K',
    comments: 1204,
    shares: '15K'
  },
  {
    id: 'mock2',
    video: reel2,
    username: 'sarah_codes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    caption: 'Building the future, one line at a time. 💻🔥 #coding #setup #developer',
    music: 'Trending Song - Lofi Beats',
    likes: '89K',
    comments: 432,
    shares: '8K'
  }
];

const ReelItem = ({ reel, isActive, isMuted, toggleMute }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recentComments, setRecentComments] = useState([]);

  const goToProfile = (e) => {
    e.stopPropagation();
    navigate('/app/profile', { state: { user: { username: reel.username, avatar: reel.avatar }, from: location.pathname } });
  };

  useEffect(() => {
    if (isActive && videoRef.current && !showComments) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false)); // Autoplay policy
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
    <div className="relative h-full w-full max-w-md mx-auto snap-start bg-black flex items-center justify-center overflow-hidden shrink-0 snap-always">
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
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Top Controls (Mute) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition shadow-lg"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Right side actions */}
      <div className={`absolute bottom-24 right-4 flex flex-col items-center gap-6 z-20 transition-opacity duration-300 ${showComments ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          className="flex flex-col items-center gap-1.5 group"
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
        >
          <div className="p-3 bg-black/40 rounded-full group-hover:bg-black/60 transition backdrop-blur-md">
            <Heart size={28} className={isLiked ? 'fill-primary-pink text-primary-pink' : 'text-white'} />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">{reel.likes}</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1.5 group"
          onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
        >
          <div className="p-3 bg-black/40 rounded-full group-hover:bg-black/60 transition backdrop-blur-md">
            <MessageCircle size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">{(reel.comments + recentComments.length).toLocaleString()}</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 group">
          <div className="p-3 bg-black/40 rounded-full group-hover:bg-black/60 transition backdrop-blur-md">
            <Send size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">{reel.shares}</span>
        </button>

        <button className="p-3 bg-black/40 rounded-full hover:bg-black/60 transition backdrop-blur-md mt-2">
          <MoreHorizontal size={24} className="text-white" />
        </button>

        <div className="w-10 h-10 mt-4 rounded-md border-2 border-white overflow-hidden animate-spin" style={{ animationDuration: '4s' }}>
          <img src={reel.avatar} alt="music cover" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className={`absolute bottom-6 left-4 right-20 z-20 transition-opacity duration-300 ${showComments ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="cursor-pointer" onClick={goToProfile}>
            <Avatar src={reel.avatar} size="sm" className="border-2 border-white shadow-lg" />
          </div>
          <span className="text-white font-bold drop-shadow-md hover:underline cursor-pointer" onClick={goToProfile}>{reel.username}</span>
          {reel.username !== 'you' && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); }}
              className={`px-3 py-1 border text-xs font-bold rounded-lg transition-all ${
                isFollowing 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black/20 backdrop-blur-md text-white border-white/50 hover:bg-white hover:text-black'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <p className="text-white text-sm mb-3 drop-shadow-md line-clamp-2">
          {reel.caption}
        </p>

        <div className="flex items-center gap-2 text-white bg-black/40 w-max px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <Music size={14} className="animate-pulse text-primary-pink" />
          <span className="text-xs font-medium marquee-text">{reel.music}</span>
        </div>
      </div>

      {/* Comments Bottom Sheet Overlay */}
      {showComments && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="h-[60%] w-full bg-surface/95 rounded-t-3xl flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300 border-t border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 relative">
              <div className="w-12 h-1.5 bg-white/20 rounded-full absolute top-2 left-1/2 -translate-x-1/2"></div>
              <h3 className="text-white font-bold text-center flex-1 mt-2">Comments</h3>
              <button 
                onClick={() => setShowComments(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors mt-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex gap-3">
                <Avatar src={reel.avatar} size="sm" />
                <div>
                  <span className="font-semibold text-white text-sm mr-2">{reel.username}</span>
                  <span className="text-sm text-gray-200">{reel.caption}</span>
                </div>
              </div>
              
              {/* Dummy existing comment */}
              <div className="flex gap-3 mt-4">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" size="sm" />
                <div>
                  <span className="font-semibold text-white text-sm mr-2">alex_dev</span>
                  <span className="text-sm text-gray-200">This is so cool! 🔥</span>
                </div>
              </div>

              {/* Recent Comments */}
              {recentComments.map((comment, idx) => (
                <div key={idx} className="flex gap-3 animate-in slide-in-from-right-4 fade-in">
                  <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" size="sm" />
                  <div>
                    <span className="font-semibold text-white text-sm mr-2">{comment.username}</span>
                    <span className="text-sm text-gray-200">{comment.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input Area */}
            <div className="p-4 border-t border-white/10 bg-bg-darker">
              <div className="flex items-center gap-4 bg-surface-light rounded-full px-4 py-3 border-none outline-none transition-all shadow-inner">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" size="sm" />
                <div className="flex-1 relative flex items-center border-none outline-none">
                  <input 
                    type="text" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a comment..." 
                    className="w-full bg-transparent text-base text-white border-none focus:outline-none focus:ring-0 placeholder-gray-500"
                    autoFocus
                  />
                  {!commentText && <Smile size={20} className="text-gray-500 cursor-pointer hover:text-white transition-colors absolute right-2" />}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);

  const fetchReels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?type=reel", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success && data.data.posts?.length > 0) {
        const mapped = data.data.posts.map(r => ({
          id: r._id,
          video: r.imageUrl,
          username: r.author?.username || 'unknown',
          avatar: r.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
          caption: r.caption || '',
          music: 'Original Audio',
          likes: r.likeCount || 0,
          comments: 0,
          shares: 0
        }));
        setReels(mapped);
      } else {
        // Fallback to mock reels
        setReels(MOCK_REELS);
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
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
        const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
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
      <div className="flex h-full w-full items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary-pink" size={40} />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black flex justify-center">
      {/* Scrollable Container */}
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
};

export default Reels;
