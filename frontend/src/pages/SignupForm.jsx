import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Globe, MessageSquare, Code, ChevronLeft, ArrowRight } from 'lucide-react';

const EMOJIS = ['🚀', '✨', '🔥', '💖', '👋', '🎉', '🎈', '🍭', '🌈', '🎸', '🕹️', '📱'];

const SignupForm = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/app');
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
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-pink transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-pink transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-pink transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Create Password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink/30 transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary-pink text-white font-bold py-4 rounded-2xl hover:bg-white hover:text-black transition-all transform active:scale-95 shadow-xl shadow-primary-pink/10 mt-6 flex items-center justify-center gap-2 group"
            >
              Sign Up
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
