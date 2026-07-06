import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, MoreHorizontal, Camera, Volume2, X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useCall } from '../../context/CallContext';

const VideoStream = ({ stream, muted = false, className }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video 
      ref={videoRef} 
      autoPlay 
      playsInline 
      muted={muted} 
      className={`object-cover ${className}`} 
    />
  );
};

const CallOverlay = () => {
  const {
    callState,
    callType,
    otherUser,
    localStream,
    remoteStream,
    acceptCall,
    declineCall,
    endCall
  } = useCall();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Call timer
  useEffect(() => {
    let timer;
    if (callState === "connected") {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const handleToggleVideo = () => {
    if (localStream && callType === 'video') {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  if (callState === "idle") return null;

  // 1. INCOMING CALL SCREEN
  if (callState === "incoming") {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[80vw] h-[80vw] max-w-[600px] bg-primary-pink/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="z-10 flex flex-col items-center max-w-sm px-6 text-center">
          <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
            {/* Pulsing Ring Animation */}
            <div className="absolute inset-0 rounded-full border border-primary-pink/40 animate-ping"></div>
            <div className="absolute -inset-4 rounded-full border border-primary-pink/20 animate-pulse"></div>
            <img 
              src={otherUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"} 
              alt={otherUser?.username} 
              className="w-full h-full object-cover rounded-full border-4 border-primary-pink shadow-2xl relative z-10 bg-bg-dark"
            />
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
            {otherUser?.username}
          </h2>
          <p className="text-primary-pink/80 font-bold uppercase tracking-widest text-sm mb-12 animate-pulse">
            Incoming {callType === 'video' ? 'Video' : 'Audio'} Call...
          </p>

          <div className="flex items-center gap-12">
            <button 
              onClick={declineCall} 
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-110">
                <Phone size={28} className="text-white rotate-[135deg]" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white font-medium">Decline</span>
            </button>

            <button 
              onClick={acceptCall} 
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all hover:scale-110 animate-bounce">
                <Phone size={28} className="text-white" />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white font-medium">Accept</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. OUTGOING CALL SCREEN (Ringing)
  if (callState === "outgoing") {
    return (
      <div className="fixed inset-0 z-50 bg-[#120c10] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[80vw] h-[80vw] max-w-[600px] bg-primary-pink/20 rounded-full blur-[120px] animate-pulse"></div>
        </div>

        <div className="z-10 flex flex-col items-center text-center">
          <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-primary-pink/30 animate-ping"></div>
            <img 
              src={otherUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"} 
              alt={otherUser?.username} 
              className="w-full h-full object-cover rounded-full border-4 border-[#251821] shadow-2xl relative z-10"
            />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">{otherUser?.username}</h2>
          <p className="text-primary-pink font-semibold tracking-widest text-sm mb-16 animate-pulse">
            RINGING...
          </p>

          <button 
            onClick={endCall} 
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-105"
          >
            <Phone size={28} className="text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    );
  }

  // 3. CONNECTED VIDEO CALL
  if (callState === "connected" && callType === "video") {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
        {/* Remote Video Stream (Main Background) */}
        {remoteStream ? (
          <VideoStream stream={remoteStream} className="absolute inset-0 w-full h-full" />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 filter blur-lg"
            style={{ backgroundImage: `url('${otherUser?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop'}')` }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 flex justify-between items-start p-6">
          <div>
            <h2 className="text-white font-black tracking-tighter text-2xl italic drop-shadow-md">
              Any<span className="text-primary-pink">Thing</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium drop-shadow-md">
                LIVE • {formatDuration(callDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Picture in Picture (Local Video Stream / Self Camera) */}
        <div className="absolute top-6 right-6 z-20 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl glass-panel bg-bg-darker">
          {localStream && !isVideoOff ? (
            <VideoStream stream={localStream} muted={true} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-gray-500">
              <VideoOff size={24} />
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {isMuted ? <MicOff size={10} className="text-red-400" /> : <Mic size={10} className="text-white" />}
            <span className="text-[10px] text-white">You</span>
          </div>
        </div>

        {/* Bottom Floating Info */}
        <div className="absolute bottom-28 left-6 z-10 flex flex-col gap-2">
          <div className="glass-panel rounded-xl px-4 py-2 flex items-center gap-3">
            <Avatar src={otherUser?.avatarUrl} size="sm" />
            <div>
              <p className="text-xs font-bold text-white">{otherUser?.username}</p>
              <p className="text-[10px] text-gray-300">Connected</p>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 glass-panel px-6 py-4 rounded-[2.5rem] bg-black/40 border-white/10 backdrop-blur-md">
          <button 
            onClick={handleToggleMute} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button 
            onClick={handleToggleVideo} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
          
          <button 
            onClick={endCall} 
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all hover:scale-105"
          >
            <Phone size={24} className="text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    );
  }

  // 4. CONNECTED AUDIO CALL
  if (callState === "connected" && callType === "audio") {
    return (
      <div className="fixed inset-0 z-50 bg-[#150f13] flex flex-col animate-in fade-in duration-300">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[80vw] h-[80vw] max-w-[600px] bg-primary-pink/20 rounded-full blur-[120px]"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center p-6">
          <div className="flex items-center gap-2 text-white/50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-primary-pink">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
            <span className="text-[10px] font-bold tracking-wider">END-TO-END ENCRYPTED</span>
          </div>
          <button 
            onClick={endCall} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Center Avatar & Status */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-10">
          <div className="relative w-40 h-40 mb-8">
            <div className="absolute inset-0 rounded-full border border-primary-pink/30 animate-pulse"></div>
            <img 
              src={otherUser?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"}
              alt={otherUser?.username}
              className="w-full h-full object-cover rounded-full border-4 border-[#2d1b28] shadow-2xl bg-surface"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">{otherUser?.username}</h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-sm font-semibold text-gray-400 tracking-wider">
              {formatDuration(callDuration)}
            </p>
          </div>
        </div>

        {/* Remote Audio Track (Hidden) */}
        {remoteStream && (
          <audio 
            ref={(audioEl) => {
              if (audioEl && remoteStream) {
                audioEl.srcObject = remoteStream;
              }
            }} 
            autoPlay 
          />
        )}

        {/* Bottom Controls */}
        <div className="relative z-10 pb-16 flex flex-col items-center w-full px-4">
          <div className="flex items-center gap-4 glass-panel px-6 py-4 rounded-[2.5rem] bg-[#291724]/60 border-white/5">
            <button 
              onClick={handleToggleMute} 
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              onClick={endCall} 
              className="mx-4 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all hover:scale-105"
            >
              <Phone size={28} className="text-white rotate-[135deg]" />
            </button>

            <button 
              onClick={declineCall} 
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Volume2 size={20} />
            </button>
          </div>
          
          <div className="mt-8 text-white/30 text-xs font-black tracking-[0.3em] uppercase italic">
            AnyThing Voice
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CallOverlay;
