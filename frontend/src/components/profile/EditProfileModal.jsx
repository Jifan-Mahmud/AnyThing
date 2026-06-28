import React, { useState, useEffect } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const EditProfileModal = ({ isOpen, onClose, onUpdateSuccess }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [loading, setLoading] = useState(false);

  // Sync form with latest user data whenever modal opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setAvatarPreview(user.avatarUrl || "");
      setAvatarFile(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username.toLowerCase().replace(/[^a-z0-9_.]/g, "_"));
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await updateProfile(formData);
    setLoading(false);
    if (res.success) {
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-primary-pink shadow-lg">
              <img 
                src={avatarPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <label 
                htmlFor="avatar-input"
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </label>
              <input 
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </div>
            <span className="text-xs font-bold text-primary-pink">Change profile photo</span>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all font-medium text-sm"
              disabled={loading}
            />
          </div>

          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all font-medium text-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all font-medium text-sm resize-none"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-pink hover:bg-primary-pink-hover text-white font-bold py-3.5 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
