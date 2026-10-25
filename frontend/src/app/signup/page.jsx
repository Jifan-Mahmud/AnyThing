'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '../../components/ui/BrandLogo';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import {
  Mail,
  Lock,
  User,
  ChevronLeft,
  ArrowRight,
  Camera,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await signup(name, email, password, avatarFile, bio);
    setLoading(false);
    if (result.success) {
      router.replace('/app');
    } else {
      setErrorMsg(result.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker font-sans text-white relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient Sunset Glows (Hot Pink + Soft Peach) */}
      <div
        className="aurora-bg w-[550px] h-[550px] bg-[#ff2e83]/15 -top-20 -right-20"
        style={{ animationDuration: '16s' }}
      />
      <div
        className="aurora-bg w-[450px] h-[450px] bg-[#ffa07a]/15 -bottom-20 -left-20"
        style={{ animationDuration: '20s', animationDelay: '-5s' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Top Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400">
            <Sparkles className="w-3 h-3 text-soft-peach" />
            <span>Join 150K+ Creators</span>
          </div>
        </motion.div>

        {/* Auth Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel border border-white/10 rounded-3xl sm:rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Header & Typographic Logo */}
          <div className="text-center mb-6 flex flex-col items-center">
            <BrandLogo size="lg" className="mb-2" onClick={() => router.push('/')} />
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              Join the new era of creator community & realtime social.
            </p>
          </div>

          {/* Google Auth Button */}
          <div className="mb-6">
            <GoogleAuthButton text="Sign up with Google" />
            <div className="relative mt-6 flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#101216] px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider absolute">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center"
            >
              {errorMsg}
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="relative group cursor-pointer w-20 h-20 rounded-full overflow-hidden border-2 border-[#ff2e83]/50 hover:border-[#ffa07a] shadow-lg transition-colors">
                <img
                  src={avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser'}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <label
                  htmlFor="signup-avatar-input"
                  className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera size={20} className="text-white mb-0.5" />
                  <span className="text-[9px] font-bold text-white uppercase">Upload</span>
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
              <span
                className="text-[11px] font-bold text-soft-peach cursor-pointer hover:underline"
                onClick={() => document.getElementById('signup-avatar-input')?.click()}
              >
                Choose Profile Photo
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-300">
                Full Name / Username
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary-pink transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 transition-all placeholder:text-zinc-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary-pink transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 transition-all placeholder:text-zinc-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-300">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary-pink transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 transition-all placeholder:text-zinc-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-300">
                Short Bio (Optional)
              </label>
              <textarea
                placeholder="What excites you about creating?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                maxLength={150}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 transition-all placeholder:text-zinc-500 font-medium resize-none"
                disabled={loading}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-[#ff2e83]/25 mt-4 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-sm">Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Create Free Account</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-400 font-medium">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-soft-peach font-bold hover:underline underline-offset-4 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
