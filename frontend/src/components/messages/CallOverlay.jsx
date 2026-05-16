import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, MoreHorizontal, Camera, Volume2, X } from 'lucide-react';
import Avatar from '../ui/Avatar';

const CallOverlay = ({ type, onClose, user }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  if (type === 'video') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Main Video Background (Simulated) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('${user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'}')` }}
        ></div>
        
        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-start p-6">
          <div>
            <h2 className="text-white font-bold text-xl drop-shadow-md">AnyThing</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium drop-shadow-md">LIVE • 12:44</span>
            </div>
          </div>
        </div>

        {/* Picture in Picture (Self Camera) */}
        <div className="absolute top-6 right-6 z-20 w-28 h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl glass-panel">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop')` }}
          ></div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {isMuted ? <MicOff size={10} className="text-red-400" /> : <Mic size={10} className="text-white" />}
            <span className="text-[10px] text-white">You</span>
          </div>
        </div>

        {/* Floating Comments */}
        <div className="absolute bottom-32 left-6 z-10 flex flex-col gap-3 max-w-[280px]">
          <div className="glass-panel rounded-2xl p-3 pr-8 relative overflow-hidden">
            <div className="flex gap-2">
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" size="sm" />
              <div>
                <p className="text-xs font-bold text-white">Elena_V</p>
                <p className="text-sm text-white/90">Can you show the new collection?</p>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-3 pr-8 relative overflow-hidden opacity-80">
            <div className="flex gap-2">
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" size="sm" />
              <div>
                <p className="text-xs font-bold text-white">Marcus_Design</p>
                <p className="text-sm text-white/90">Lighting looks amazing here!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center justify-around md:justify-center w-[95%] md:w-auto gap-1 md:gap-2 glass-panel px-3 md:px-6 py-3 md:py-4 rounded-[2.5rem]">
          <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-1.5 min-w-[60px] group">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
            </div>
            <span className="text-[10px] text-white/80 font-medium">MUTE</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 min-w-[60px] group">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Camera size={20} className="text-white" />
            </div>
            <span className="text-[10px] text-white/80 font-medium">FLIP</span>
          </button>
          
          <button onClick={onClose} className="flex flex-col items-center gap-1.5 min-w-[70px] mx-2">
            <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105">
              <Phone size={24} className="text-white rotate-[135deg]" />
            </div>
            <span className="text-[10px] text-white/80 font-medium">END</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 min-w-[60px] group relative">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <MessageSquare size={20} className="text-white" />
            </div>
            <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-primary-pink rounded-full border-2 border-black/50"></span>
            <span className="text-[10px] text-white/80 font-medium">CHAT</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 min-w-[60px] group">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <MoreHorizontal size={20} className="text-white" />
            </div>
            <span className="text-[10px] text-white/80 font-medium">MORE</span>
          </button>
        </div>
      </div>
    );
  }

  // Audio Call UI
  return (
    <div className="fixed inset-0 z-50 bg-[#1a1518] flex flex-col animate-in fade-in zoom-in-95 duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-primary-pink/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-2 text-white/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
          <span className="text-xs font-semibold tracking-wider">END-TO-END ENCRYPTED</span>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Center Avatar */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-10">
        <div className="relative w-40 h-40 mb-8">
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border border-primary-pink/30 animate-ping"></div>
          <div className="absolute -inset-4 rounded-full border border-primary-pink/10 animate-pulse delay-75"></div>
          
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"}
            alt={user?.name || "Caller"}
            className="w-full h-full object-cover rounded-full border-4 border-[#2a2226] shadow-[0_0_40px_rgba(255,105,180,0.2)] bg-surface"
          />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">{user?.name || "Elena Vance"}</h2>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-pink animate-pulse"></span>
          <p className="text-sm font-semibold text-primary-pink tracking-widest">CALLING...</p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 pb-8 md:pb-12 flex flex-col items-center w-full px-4">
        <div className="flex items-center justify-around md:justify-center w-full md:w-auto gap-2 md:gap-3 glass-panel px-4 md:px-6 py-3 md:py-4 rounded-[2.5rem] bg-[#2a2226]/80 border-white/5">
          <button onClick={() => setIsSpeaker(!isSpeaker)} className="flex flex-col items-center gap-2 min-w-[64px] group">
            <div className="text-white/80 group-hover:text-white transition-colors">
              <Volume2 size={24} />
            </div>
            <span className="text-[10px] text-white/60 font-semibold tracking-wider">SPEAKER</span>
          </button>
          
          <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-2 min-w-[64px] group">
            <div className="text-white/80 group-hover:text-white transition-colors">
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </div>
            <span className="text-[10px] text-white/60 font-semibold tracking-wider">MUTE</span>
          </button>
          
          <button onClick={onClose} className="mx-4 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:scale-105">
            <Phone size={28} className="text-white rotate-[135deg]" />
          </button>

          <button onClick={() => setIsVideoOff(!isVideoOff)} className="flex flex-col items-center gap-2 min-w-[64px] group">
            <div className="text-white/80 group-hover:text-white transition-colors">
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </div>
            <span className="text-[10px] text-white/60 font-semibold tracking-wider">VIDEO</span>
          </button>

          <button className="flex flex-col items-center gap-2 min-w-[64px] group">
            <div className="text-white/80 group-hover:text-white transition-colors">
              <MoreHorizontal size={24} />
            </div>
            <span className="text-[10px] text-white/60 font-semibold tracking-wider">MORE</span>
          </button>
        </div>
        
        <div className="mt-8 text-white/30 font-bold tracking-[0.2em] italic">
          CreatorChat
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;
