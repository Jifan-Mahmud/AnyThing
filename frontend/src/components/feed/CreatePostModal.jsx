import React, { useState } from 'react';
import { X, Image as ImageIcon, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake preview URL for demonstration
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    if (!imagePreview && !caption) {
      toast.error('Please add an image or caption.');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Post created successfully!');
      setCaption('');
      setImagePreview(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-surface w-full max-w-lg rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Create New Post</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          {/* Image Upload Area */}
          <div className="relative w-full aspect-video bg-bg-darker rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden hover:border-primary-pink/50 transition-colors group cursor-pointer">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white font-medium">Change Image</span>
                </div>
              </>
            ) : (
              <>
                <ImageIcon size={48} className="text-gray-500 mb-2 group-hover:text-primary-pink transition-colors" />
                <span className="text-sm text-gray-400 font-medium">Click or drag photos here</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>

          {/* Caption Input */}
          <textarea 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..." 
            className="w-full bg-surface-light text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 resize-none min-h-[100px]"
          />

          {/* Location / Tag actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
              <MapPin size={16} /> Add Location
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex justify-end">
          <button 
            onClick={handlePost}
            className="px-6 py-2 bg-primary-pink text-white font-bold rounded-full hover:bg-primary-pink-hover transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-pink/20"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
