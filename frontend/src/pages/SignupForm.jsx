import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Globe, MessageSquare, Code, ChevronLeft, ArrowRight, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMOJIS = ['🚀', '✨', '🔥', '💖', '👋', '🎉', '🎈', '🍭', '🌈', '🎸', '🕹️', '📱'];

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signup(name, email, password, avatarFile, bio);
    setLoading(false);
    if (result.success) {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark font-sans text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-100">
        {EMOJIS.map((emoji, idx) => (
          <div 
            key={idx} 
            className="absolute animate-fly-up opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${12 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${1.5 + Math.random() * 2}rem`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-white/40 hover:text-primary-pink transition-colors font-bold group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Form Card */}
        <div className="bg-surface/40 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
          {/* Decorative Pink Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-pink/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-pink/10 rounded-full blur-[100px]" />

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter mb-2">
              Any<span className="text-primary-pink drop-shadow-[0_0_10px_rgba(255,182,193,0.5)]">Thing</span>
            </h1>
            <p className="text-white/40 font-medium">Create your account to start evolving.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 relative z-10">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="relative group cursor-pointer w-20 h-20 rounded-full overflow-hidden border-2 border-primary-pink/50 hover:border-primary-pink shadow-lg transition-colors">
                <img 
                  src={avatarPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=signup"} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <label 
                  htmlFor="signup-avatar-input"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera size={20} className="text-white" />
                </label>
                <input 
                  id="signup-avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
              <span className="text-[11px] font-bold text-primary-pink cursor-pointer" onClick={() => document.getElementById('signup-avatar-input').click()}>
                Add Profile Photo
              </span>
            </div>

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-pink transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-pink transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-pink transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Create Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="relative group">
              <textarea 
                placeholder="Tell us about yourself (Bio)..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                maxLength={150}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium text-sm resize-none"
                disabled={loading}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-pink text-white font-bold py-4 rounded-2xl hover:bg-white hover:text-black transition-all transform active:scale-95 shadow-xl shadow-primary-pink/10 mt-6 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8 z-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative px-4 bg-transparent text-[10px] text-white/20 uppercase tracking-widest font-bold">Or sign up with</span>
          </div>

          <div className="flex gap-4 relative z-10">
            <button className="flex-1 bg-white/5 border border-white/10 py-3 rounded-2xl flex items-center justify-center text-white hover:bg-primary-pink/10 hover:border-primary-pink/30 transition-colors shadow-sm">
              <Globe size={20} />
            </button>
            <button className="flex-1 bg-white/5 border border-white/10 py-3 rounded-2xl flex items-center justify-center text-white hover:bg-primary-pink/10 hover:border-primary-pink/30 transition-colors shadow-sm">
              <MessageSquare size={20} />
            </button>
            <button className="flex-1 bg-white/5 border border-white/10 py-3 rounded-2xl flex items-center justify-center text-white hover:bg-primary-pink/10 hover:border-primary-pink/30 transition-colors shadow-sm">
              <Code size={20} />
            </button>
          </div>

          <p className="text-center text-sm text-white/40 mt-10 font-medium relative z-10">
            Already have an account? {' '}
            <Link to="/login" className="text-primary-pink font-black hover:underline underline-offset-4">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
