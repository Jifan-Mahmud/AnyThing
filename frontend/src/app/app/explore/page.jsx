'use client';

import React, { useState, useEffect } from 'react';
import { Search, Film, X, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import PostCard from '../../../components/feed/PostCard';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['All', 'Trending', 'Reels', 'Design', 'Motion', 'Photography'];

const MOCK_EXPLORE_POSTS = [
  {
    id: 'mock1',
    type: 'image',
    size: 'small',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    likes: 1200,
    comments: 34,
    user: {
      username: 'creative_soul',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1',
    },
    caption: 'Loving these neon obsidian aesthetics! 💜',
    timeAgo: '2h ago',
  },
  {
    id: 'mock2',
    type: 'reel',
    size: 'large',
    image:
      'https://res.cloudinary.com/mmquu2ps/video/upload/v1785047869/posts/nixnmu8iap3w0vqhajeb.mp4',
    likes: 2400,
    comments: 124,
    user: {
      username: 'tech_guru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2',
    },
    caption: 'Future of social media connection is here! 💻',
    timeAgo: '4h ago',
  },
  {
    id: 'mock3',
    type: 'image',
    size: 'small',
    image:
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop',
    likes: 8100,
    comments: 400,
    user: {
      username: 'design_daily',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3',
    },
    caption: 'Abstract geometry is always a good idea.',
    timeAgo: '5h ago',
  },
];

export default function ExplorePage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchExplorePosts = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/posts', { headers, credentials: 'include' });
      const data = await res.json();

      if (res.ok && data.success && data.data.posts?.length > 0) {
        const mapped = data.data.posts.map((p) => ({
          id: p._id,
          type: p.type === 'reel' ? 'reel' : 'image',
          size: p.type === 'reel' ? 'large' : 'small',
          image: p.imageUrl,
          likes: p.likeCount || 0,
          comments: 0,
          user: {
            username: p.author?.username || 'unknown',
            avatar:
              p.author?.avatarUrl ||
              'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
            hasStory: false,
          },
          caption: p.caption || '',
          timeAgo: new Date(p.createdAt).toLocaleDateString(),
        }));
        setPosts(mapped);
      } else {
        setPosts(MOCK_EXPLORE_POSTS);
      }
    } catch (err) {
      console.error('Error loading explore posts:', err);
      setPosts(MOCK_EXPLORE_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter') {
      if (!searchQuery.trim()) {
        fetchExplorePosts();
        return;
      }
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/users/search?q=${searchQuery}`, {
          headers,
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.success && data.data.users?.length > 0) {
          const mappedUsers = data.data.users.map((u) => ({
            id: u._id,
            type: 'image',
            size: 'small',
            image:
              u.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
            likes: 0,
            comments: 0,
            user: {
              username: u.username,
              avatar:
                u.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
              hasStory: false,
            },
            caption: u.bio || 'User profile',
            timeAgo: 'Joined recently',
          }));
          setPosts(mappedUsers);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Search Bar & Categories Header */}
      <div className="mb-6 sticky top-0 z-20 bg-bg-darker/80 backdrop-blur-xl py-3 border-b border-white/5">
        <div className="relative w-full max-w-lg mx-auto mb-3">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search creators & press Enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-white/5 text-white rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:border-primary-pink/50 border border-white/10 transition-all text-xs sm:text-sm font-medium placeholder-zinc-500 shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary-pink text-white shadow-md shadow-primary-pink/25'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <LoadingSpinner
            size="lg"
            text="Discovering content..."
            subtext="Curating posts and trending media"
          />
        </div>
      ) : posts.length > 0 ? (
        /* Bento Explore Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 auto-rows-[140px] sm:auto-rows-[190px] md:auto-rows-[240px]">
          {posts.map((post) => {
            const isLarge = post.size === 'large';

            return (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPost(post)}
                className={`relative group cursor-pointer overflow-hidden bg-surface rounded-2xl border border-white/5 shadow-md ${
                  isLarge ? 'row-span-2 col-span-1' : ''
                }`}
              >
                {post.type === 'reel' ? (
                  <video
                    src={post.image}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseOver={(e) => e.target.play().catch(() => {})}
                    onMouseOut={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={post.image}
                    alt="Explore post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}

                {post.type === 'reel' && (
                  <div className="absolute top-3 right-3 text-white drop-shadow-md">
                    <Film size={18} className="fill-white/80" />
                  </div>
                )}

                {/* Hover Backdrop Overlay with Likes */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-5 transition-opacity duration-300 backdrop-blur-[2px]">
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
                    <span className="text-primary-pink">♥</span> {post.likes}
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
                    <span>💬</span> {post.comments}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 my-12">
          <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-zinc-500 mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-white mb-1">No media found</h4>
          <p className="text-xs text-zinc-400">Try a different search query or explore all categories.</p>
        </div>
      )}

      {/* Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
            {/* Mobile Header Bar */}
            <div className="fixed top-0 inset-x-0 h-14 bg-bg-darker/90 backdrop-blur-md border-b border-white/5 flex items-center px-4 justify-between z-50 md:hidden">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Post Details</span>
              <div className="w-8" />
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full h-full md:h-auto md:max-w-lg overflow-y-auto hide-scrollbar md:rounded-3xl"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="hidden md:block absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white transition-colors backdrop-blur-md cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="min-h-full flex flex-col justify-center pt-16 md:pt-0">
                <PostCard post={selectedPost} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
