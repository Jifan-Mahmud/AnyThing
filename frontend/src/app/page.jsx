'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '../components/ui/BrandLogo';
import {
  Video,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const FLOATING_EMOJIS = ['✨', '🔥', '💖', '🚀', '🌟', '⚡', '💫', '🎉'];

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Instant Realtime Chat',
    description: 'Ultra-low latency direct messaging, typing indicators, and instant read receipts powered by WebSockets.',
    color: 'from-[#ff2e83]/20 to-[#ffa07a]/20',
    border: 'border-[#ff2e83]/30',
    iconColor: 'text-primary-pink',
  },
  {
    icon: Video,
    title: 'HD Video & Audio Calls',
    description: 'Peer-to-peer crystal clear WebRTC calls. Connect face-to-face with friends anywhere across the globe.',
    color: 'from-[#ffa07a]/20 to-[#ff2e83]/20',
    border: 'border-[#ffa07a]/30',
    iconColor: 'text-[#ffa07a]',
  },
  {
    icon: Sparkles,
    title: 'Immersive Reels & Stories',
    description: 'Express your day with high-res 24h disappearing stories and full-screen vertical reels with audio.',
    color: 'from-[#ff2e83]/20 to-rose-500/20',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-400',
  },
  {
    icon: Compass,
    title: 'Dynamic Discovery',
    description: 'Discover creators tailored to your vibe. Explore trending media, hashtags, and fresh ideas instantly.',
    color: 'from-[#ffa07a]/20 to-amber-500/20',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
];

const STATS = [
  { label: 'Active Creators', value: '150K+', change: '+24% this week' },
  { label: 'Daily Interactions', value: '2.4M', change: 'Realtime live' },
  { label: 'Latency Speed', value: '<45ms', change: 'Global edge sync' },
  { label: 'Creator Satisfaction', value: '99.8%', change: 'Top rated' },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/app');
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen bg-bg-darker text-white font-sans relative overflow-x-hidden selection:bg-primary-pink selection:text-white">
      {/* Ambient Sunset Glows (Hot Pink + Soft Peach) */}
      <div
        className="aurora-bg w-[550px] h-[550px] bg-[#ff2e83]/15 -top-40 -left-20"
        style={{ animationDuration: '16s' }}
      />
      <div
        className="aurora-bg w-[650px] h-[650px] bg-[#ffa07a]/15 -top-20 -right-40"
        style={{ animationDuration: '22s', animationDelay: '-4s' }}
      />
      <div
        className="aurora-bg w-[500px] h-[500px] bg-[#ff2e83]/10 bottom-40 left-1/3"
        style={{ animationDuration: '18s', animationDelay: '-8s' }}
      />

      {/* Floating Emojis Subtle Stream */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        {FLOATING_EMOJIS.map((emoji, idx) => (
          <div
            key={idx}
            className="absolute animate-fly-up"
            style={{
              left: `${(idx * 12.5) % 95}%`,
              animationDuration: `${14 + (idx % 4) * 3}s`,
              animationDelay: `${idx * 1.8}s`,
              fontSize: '1.5rem',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg-darker/70 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <BrandLogo size="md" onClick={() => router.push('/')} />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Log In
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push('/signup')}
              className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] hover:opacity-95 text-white transition-all shadow-lg shadow-[#ff2e83]/25 hover:shadow-[#ff2e83]/40 cursor-pointer"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-zinc-300 mb-8 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#ffa07a] animate-pulse" />
          <span>The Next Evolution of Social Media</span>
          <Sparkles className="w-3.5 h-3.5 text-[#ffa07a] ml-1" />
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] max-w-5xl"
        >
          Engage, Evolve & <br className="hidden sm:inline" />
          <span className="text-gradient-brand">Excel on AnyThing</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed"
        >
          A high-performance modern social experience crafted for seamless connection.
          Instant chats, crystal WebRTC calls, full-screen reels, and active creator communities.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] hover:opacity-95 text-white font-bold text-base shadow-xl shadow-[#ff2e83]/30 flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            <span>Start Free Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/10 backdrop-blur-md transition-all cursor-pointer"
          >
            Sign In with Account
          </motion.button>
        </motion.div>

        {/* Hero Interactive Showcase Bento */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 sm:mt-24 w-full max-w-5xl relative"
        >
          <div className="glass-panel rounded-3xl sm:rounded-[36px] p-4 sm:p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#ff2e83]/10 via-[#ffa07a]/5 to-transparent pointer-events-none" />

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
              {/* Left Card: Chat Feature Preview */}
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-panel p-5 rounded-2xl border border-white/10 text-left flex flex-col gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff2e83]/20 flex items-center justify-center text-primary-pink">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Live Messages</h4>
                    <p className="text-xs text-zinc-400">Socket.io persistent</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-xs text-zinc-300">
                  <span className="text-primary-pink font-semibold">@alex:</span> Just uploaded our new reel, check it out! 🚀
                </div>
              </motion.div>

              {/* Center Card: Creator Highlight */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl overflow-hidden border-2 border-primary-pink/40 shadow-2xl shadow-primary-pink/20 aspect-[4/5] max-w-xs mx-auto w-full group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
                  alt="Featured Creator"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] text-white text-[11px] font-bold mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Creator</span>
                  </div>
                  <h3 className="font-bold text-lg text-white">Sara Jenkins</h3>
                  <p className="text-xs text-zinc-300">Digital Arts & Motion Design</p>
                </div>
              </motion.div>

              {/* Right Card: Calling Feature Preview */}
              <motion.div
                whileHover={{ y: -4 }}
                className="glass-panel p-5 rounded-2xl border border-white/10 text-left flex flex-col gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ffa07a]/20 flex items-center justify-center text-[#ffa07a]">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">WebRTC Calling</h4>
                    <p className="text-xs text-zinc-400">Peer-to-peer encrypted</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                  <span className="text-zinc-500 font-mono">04:12</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-surface/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/5 transition-colors"
              >
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-gradient-brand tracking-tight">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-semibold text-white">{stat.label}</span>
                <span className="text-xs text-zinc-500 mt-0.5">{stat.change}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#ffa07a] mb-3">
            State of the Art Experience
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Designed for Modern Digital Creators
          </h3>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Everything you need to broadcast your world, interact with true fans, and form lasting bonds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 hover:border-primary-pink/30 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center mb-6 border ${feature.border} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary-pink transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl sm:rounded-[40px] p-8 sm:p-14 lg:p-20 border border-primary-pink/20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ff2e83]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#ffa07a]/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Ready to Upgrade Your Social Life?
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg mb-8">
              Join thousands of creators who have found their home on AnyThing. Completely free to join.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/signup')}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#ff2e83] to-[#ffa07a] hover:opacity-95 text-white font-bold text-lg shadow-2xl shadow-[#ff2e83]/30 transition-all cursor-pointer"
            >
              Create Account Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 relative z-10 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" onClick={() => router.push('/')} />
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms</span>
            <span className="hover:text-zinc-300 cursor-pointer">Community</span>
            <span className="hover:text-zinc-300 cursor-pointer">Support</span>
          </div>
          <p>© 2026 AnyThing Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
