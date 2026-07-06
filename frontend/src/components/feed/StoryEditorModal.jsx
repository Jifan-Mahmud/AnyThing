import React, { useState } from 'react';
import { X, Music, Sparkles, Type, Smile, ChevronRight, Play } from 'lucide-react';
import { toast } from 'react-toastify';

const MOCK_MUSIC = [
  { id: 1, title: 'Stay With Me', artist: 'Lofi Girl' },
  { id: 2, title: 'Midnight City', artist: 'M83' },
  { id: 3, title: 'Blinding Lights', artist: 'The Weeknd' },
];

const StoryEditorModal = ({ isOpen, onClose, mediaFile, onStoryShared }) => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  if (!isOpen || !mediaFile) return null;

  const handleShare = async () => {
    try {
      const formData = new FormData();
      formData.append("media", mediaFile);

      const res = await fetch("/api/stories", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Shared to Your Story! 🌟');
        if (onStoryShared) onStoryShared(data.data);
        onClose();
      } else {
        toast.error(data.message || "Failed to upload story");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error: Failed to share story");
    }
  };

  const mediaUrl = URL.createObjectURL(mediaFile);
  const isVideo = mediaFile.type.startsWith('video/');

  return (
    <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-3xl overflow-hidden bg-bg-darker flex flex-col border border-white/10">
        
        {/* Media Preview */}
        <div className="flex-1 relative">
          {isVideo ? (
            <video src={mediaUrl} className="w-full h-full object-cover" autoPlay loop muted />
          ) : (
            <img src={mediaUrl} alt="Story Preview" className="w-full h-full object-cover" />
          )}

          {/* Floating Controls */}
          <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between z-20">
            <button onClick={onClose} className="p-2 bg-black/20 rounded-full text-white backdrop-blur-md"><X size={24} /></button>
            <div className="flex gap-3">
              <button className="p-2 bg-black/20 rounded-full text-white backdrop-blur-md"><Type size={20} /></button>
              <button className="p-2 bg-black/20 rounded-full text-white backdrop-blur-md"><Smile size={20} /></button>
              <button className="p-2 bg-black/20 rounded-full text-white backdrop-blur-md"><Sparkles size={20} /></button>
              <button 
                onClick={() => setIsMusicOpen(!isMusicOpen)}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${selectedMusic ? 'bg-primary-pink text-white' : 'bg-black/20 text-white'}`}
              >
                <Music size={20} />
              </button>
            </div>
          </div>

          {/* Music Selection Overlay */}
          {isMusicOpen && (
            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-lg p-6 flex flex-col animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-xl">Music</h3>
                <button onClick={() => setIsMusicOpen(false)} className="text-white"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                {MOCK_MUSIC.map(song => (
                  <button 
                    key={song.id}
                    onClick={() => {setSelectedMusic(song); setIsMusicOpen(false)}}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-pink">
                      <Play size={20} fill="currentColor" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">{song.title}</p>
                      <p className="text-gray-500 text-sm">{song.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sticker/Music Indicator */}
          {selectedMusic && !isMusicOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white/20 animate-bounce">
               <div className="w-8 h-8 bg-primary-pink rounded-full flex items-center justify-center text-white">
                 <Music size={16} />
               </div>
               <div>
                 <p className="text-white text-sm font-bold leading-tight">{selectedMusic.title}</p>
                 <p className="text-white/60 text-[10px]">{selectedMusic.artist}</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-transparent absolute bottom-0 left-0 right-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <button className="flex-1 py-3 px-4 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-sm flex items-center justify-center gap-2">
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" size="xs" /> Your Story
            </button>
            <button 
              onClick={handleShare}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryEditorModal;

// Mock Avatar for local use in modal
const Avatar = ({ src, size }) => (
  <img src={src} className={`${size === 'xs' ? 'w-5 h-5' : 'w-8 h-8'} rounded-full`} alt="avatar" />
);
