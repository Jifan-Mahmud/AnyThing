import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, Video, Film, Music, Sparkles, Type, Smile, ChevronLeft, Search, Play, Pause } from 'lucide-react';
import { toast } from 'react-toastify';

const MOCK_MUSIC = [
  { id: 1, title: 'Stay With Me', artist: 'Lofi Girl', duration: '0:30' },
  { id: 2, title: 'Midnight City', artist: 'M83', duration: '0:30' },
  { id: 3, title: 'Blinding Lights', artist: 'The Weeknd', duration: '0:30' },
  { id: 4, title: 'Levitating', artist: 'Dua Lipa', duration: '0:30' },
];

const FILTERS = ['Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes'];

const CreatePostModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('upload'); // 'upload', 'edit', 'details'
  const [caption, setCaption] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [postType, setPostType] = useState('post'); // 'post' or 'reel'
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Normal');
  const [isMusicPanelOpen, setIsMusicPanelOpen] = useState(false);
  const [fileObject, setFileObject] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setMediaType(type);
      setFileObject(file);
      if (type === 'video') setPostType('reel');
      else setPostType('post');
      setMediaPreview(URL.createObjectURL(file));
      setStep('edit');
    }
  };

  const resetModal = () => {
    setStep('upload');
    setCaption('');
    setMediaPreview(null);
    setFileObject(null);
    setSelectedMusic(null);
    setActiveFilter('Normal');
    setIsMusicPanelOpen(false);
    setUploading(false);
    onClose();
  };

  const handleShare = async () => {
    if (!fileObject) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", fileObject);
    formData.append("caption", caption);
    formData.append("type", postType);

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`${postType === 'reel' ? 'Reel' : 'Post'} shared successfully!`);
        resetModal();
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to share post");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sharing the post");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const renderHeader = () => {
    if (step === 'upload') return (
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-lg font-bold text-white">Create New</h2>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <X size={24} />
        </button>
      </div>
    );

    return (
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <button 
          onClick={() => setStep(step === 'details' ? 'edit' : 'upload')}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          disabled={uploading}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-white">
          {step === 'edit' ? 'Edit' : 'New Post'}
        </h2>
        <button 
          onClick={() => step === 'edit' ? setStep('details') : handleShare()}
          className="text-primary-pink font-bold hover:text-primary-pink-hover disabled:opacity-50"
          disabled={uploading}
        >
          {step === 'edit' ? 'Next' : uploading ? 'Sharing...' : 'Share'}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className={`bg-surface w-full max-w-lg lg:max-w-4xl h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col transition-all duration-300 ${step !== 'upload' ? 'lg:flex-row' : ''}`}>
        
        {/* Main Media Section */}
        <div className={`flex-1 flex flex-col relative ${step !== 'upload' ? 'lg:w-[600px]' : ''}`}>
          {renderHeader()}

          <div className="flex-1 bg-bg-darker flex items-center justify-center relative group">
            {step === 'upload' ? (
              <div 
                className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                onClick={triggerFileInput}
              >
                <div className="flex gap-4 mb-4">
                  <div className={`p-4 rounded-2xl ${postType === 'post' ? 'bg-primary-pink text-white' : 'bg-white/5 text-gray-400'}`} onClick={(e) => {e.stopPropagation(); setPostType('post')}}>
                    <ImageIcon size={32} />
                  </div>
                  <div className={`p-4 rounded-2xl ${postType === 'reel' ? 'bg-primary-pink text-white' : 'bg-white/5 text-gray-400'}`} onClick={(e) => {e.stopPropagation(); setPostType('reel')}}>
                    <Film size={32} />
                  </div>
                </div>
                <p className="text-white font-medium mb-2">Drag photos and videos here</p>
                <button className="px-6 py-2 bg-primary-pink text-white rounded-lg font-bold">Select from computer</button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleMediaChange} accept="image/*,video/*" />
              </div>
            ) : (
              <>
                <div className={`w-full h-full overflow-hidden flex items-center justify-center ${activeFilter !== 'Normal' ? 'brightness-110 contrast-110 saturate-125' : ''}`}>
                  {mediaType === 'video' ? (
                    <video src={mediaPreview} className="w-full h-full object-contain" autoPlay loop muted />
                  ) : (
                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-contain" />
                  )}
                </div>
                
                {/* Floating Edit Controls (Story-like) */}
                {step === 'edit' && (
                  <div className="absolute top-4 right-4 flex flex-col gap-3">
                    <button className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60"><Type size={20} /></button>
                    <button className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60"><Smile size={20} /></button>
                    <button className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md hover:bg-black/60"><Sparkles size={20} /></button>
                    <button 
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${selectedMusic ? 'bg-primary-pink text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                      onClick={() => setIsMusicPanelOpen(!isMusicPanelOpen)}
                    >
                      <Music size={20} />
                    </button>
                  </div>
                )}
                
                {selectedMusic && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 animate-in slide-in-from-bottom-2">
                    <Music size={14} className="text-primary-pink animate-pulse" />
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">{selectedMusic.title} • {selectedMusic.artist}</span>
                    <button onClick={() => setSelectedMusic(null)} className="text-white/50 hover:text-white"><X size={14} /></button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar Controls (Edit/Details) */}
        {step !== 'upload' && (
          <div className="w-full lg:w-80 bg-surface border-l border-white/5 flex flex-col h-full animate-in slide-in-from-right duration-300">
            {step === 'edit' ? (
              <div className="flex-1 flex flex-col p-4">
                <h3 className="text-white font-bold mb-4">Edit</h3>
                <div className="grid grid-cols-3 gap-2 mb-8">
                  {FILTERS.map(filter => (
                    <button 
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${activeFilter === filter ? 'bg-primary-pink/10 border border-primary-pink' : 'bg-white/5 border border-transparent'}`}
                    >
                      <div className={`w-full aspect-square rounded-md bg-gradient-to-br from-gray-700 to-gray-900 ${filter === 'Moon' ? 'grayscale' : filter === 'Clarendon' ? 'sepia-[0.3]' : ''}`} />
                      <span className="text-[10px] font-bold text-white">{filter}</span>
                    </button>
                  ))}
                </div>

                {isMusicPanelOpen && (
                  <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2 mb-4 bg-white/5 p-2 rounded-xl">
                      <Search size={16} className="text-gray-500" />
                      <input type="text" placeholder="Search music" className="bg-transparent text-sm text-white focus:outline-none w-full" />
                    </div>
                    <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                      {MOCK_MUSIC.map(song => (
                        <button 
                          key={song.id}
                          onClick={() => {setSelectedMusic(song); setIsMusicPanelOpen(false)}}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors ${selectedMusic?.id === song.id ? 'bg-primary-pink/10' : ''}`}
                        >
                          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-primary-pink">
                            <Play size={16} fill="currentColor" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-bold text-white leading-tight">{song.title}</p>
                            <p className="text-xs text-gray-500">{song.artist}</p>
                          </div>
                          <span className="text-[10px] text-gray-500">{song.duration}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center gap-3 mb-6">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-8 h-8 rounded-full" alt="avatar" />
                  <span className="text-sm font-bold text-white">Alex Dev</span>
                </div>
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..." 
                  className="w-full bg-transparent text-white text-sm focus:outline-none resize-none min-h-[150px]"
                />
                <div className="mt-auto space-y-4 border-t border-white/5 pt-4">
                  <button className="w-full flex items-center justify-between text-white py-2 hover:bg-white/5 px-2 rounded-lg">
                    <span className="text-sm">Add location</span>
                    <MapPin size={18} className="text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between text-white py-2 hover:bg-white/5 px-2 rounded-lg">
                    <span className="text-sm">Tag people</span>
                    <span className="text-xs text-gray-500">None</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
