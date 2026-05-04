import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Music, Volume2, VolumeX } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

// Import local assets
import reel1 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM.mp4';
import reel2 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM (1).mp4';

const MOCK_REELS = [
  {
    id: 1,
    video: reel1,
    username: 'jason_creativ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    caption: 'Neon vibes only. ✨ What do you think of this aesthetic? #neon #cyberpunk #design',
    music: 'Original Audio - jason_creativ',
    likes: '124K',
    comments: '1,204',
    shares: '15K'
  },
  {
    id: 2,
    video: reel2,
    username: 'sarah_codes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    caption: 'Building the future, one line at a time. 💻🔥 #coding #setup #developer',
    music: 'Trending Song - Lofi Beats',
    likes: '89K',
    comments: '432',
    shares: '8K'
  }
];

const ReelItem = ({ reel, isActive, isMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false)); // Autoplay policy
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
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
    e.stopPropagation();
    setIsLiked(true);
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
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Top Controls (Mute) */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Right side actions */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6 z-10">
        <button 
          className="flex flex-col items-center gap-1 group"
          onClick={() => setIsLiked(!isLiked)}
        >
          <div className="p-3 bg-black/40 rounded-full group-hover:bg-black/60 transition backdrop-blur-md">
            <Heart size={28} className={isLiked ? 'fill-primary-pink text-primary-pink' : 'text-white'} />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">{reel.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-black/40 rounded-full group-hover:bg-black/60 transition backdrop-blur-md">
            <MessageCircle size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">{reel.comments}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
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
      <div className="absolute bottom-4 left-4 right-20 z-10">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={reel.avatar} size="sm" className="border-2 border-white" />
          <span className="text-white font-bold drop-shadow-md hover:underline cursor-pointer">{reel.username}</span>
          <button className="px-3 py-1 border border-white text-white text-xs font-bold rounded-lg hover:bg-white hover:text-black transition">
            Follow
          </button>
        </div>
        
        <p className="text-white text-sm mb-3 drop-shadow-md line-clamp-2">
          {reel.caption}
        </p>

        <div className="flex items-center gap-2 text-white bg-black/40 w-max px-3 py-1.5 rounded-full backdrop-blur-md">
          <Music size={14} className="animate-pulse" />
          <span className="text-xs font-medium marquee-text">{reel.music}</span>
        </div>
      </div>
    </div>
  );
};

const Reels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);

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
  }, []);

  return (
    <div className="h-full w-full bg-black flex justify-center">
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="h-full w-full max-w-md overflow-y-scroll snap-y snap-mandatory scroll-smooth flex flex-col hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {MOCK_REELS.map((reel, index) => (
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
