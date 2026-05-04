import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from '../ui/Avatar';

const StoryViewerModal = ({ isOpen, onClose, storyUser }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose(); // auto close when story finishes
          return 100;
        }
        return prev + 1; // 100 steps, let's say 3s total -> 30ms per step
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen || !storyUser) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    onClose(); // just close for now in mock since we only have 1 story per user
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 p-2 bg-black/20 rounded-full"
      >
        <X size={28} />
      </button>

      {/* Story Container */}
      <div className="relative w-full h-full md:w-[400px] md:h-[800px] md:max-h-[90vh] bg-surface rounded-none md:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-4 pt-6 md:pt-4">
          <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* User Info Header */}
        <div className="absolute top-10 left-0 right-0 z-20 flex items-center gap-3 px-4">
          <Avatar src={storyUser.avatar} size="sm" />
          <span className="text-white font-bold text-sm shadow-sm">{storyUser.username}</span>
          <span className="text-white/70 text-xs shadow-sm">2h</span>
        </div>

        {/* Story Image/Video (Mock) */}
        <img 
          src={`https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop&seed=${storyUser.id}`} 
          alt="Story content" 
          className="w-full h-full object-cover"
        />

        {/* Tap areas for next/prev */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-2/3 z-10 cursor-pointer" onClick={handleNext} />
        
        {/* Navigation Arrows (Desktop) */}
        <button 
          onClick={handlePrev} 
          className="hidden md:flex absolute top-1/2 -left-16 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNext} 
          className="hidden md:flex absolute top-1/2 -right-16 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default StoryViewerModal;
