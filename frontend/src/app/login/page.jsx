'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  ChevronLeft,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/app');
    } else {
      setErrorMsg(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker font-sans text-white relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient Aurora Glows */}
      <div
        className="aurora-bg w-[500px] h-[500px] bg-primary-pink/15 -top-20 -left-20"
        style={{ animationDuration: '14s' }}
      />
      <div
        className="aurora-bg w-[450px] h-[450px] bg-purple-600/15 -bottom-20 -right-20"
        style={{ animationDuration: '18s', animationDelay: '-6s' }}
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
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400">
            <Sparkles className="w-3 h-3 text-primary-pink" />
            <span>Secure Access</span>
          </div>
        </motion.div>

        {/* Auth Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel border border-white/10 rounded-3xl sm:rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-pink to-purple-600 items-center justify-center shadow-lg shadow-primary-pink/25 mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight">
              Any<span className="text-primary-pink text-glow">Thing</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-medium">
              Welcome back! Step into your creative sphere.
            </p>
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

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 transition-all placeholder:text-zinc-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-zinc-400 hover:text-primary-pink font-semibold transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary-pink transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/20 transition-all placeholder:text-zinc-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary-pink hover:bg-primary-pink-hover text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary-pink/25 mt-6 flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="text-sm">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-400 font-medium">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary-pink font-bold hover:underline underline-offset-4 ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
