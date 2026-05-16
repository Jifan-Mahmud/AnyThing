import React, { useState } from 'react';
import { Search, Film, X } from 'lucide-react';
import PostCard from '../components/feed/PostCard';

const EXPLORE_POSTS = [
  { id: 1, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', likes: '1.2k', comments: 34, user: { username: 'creative_soul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1' }, caption: 'Loving these neon aesthetics! 💜', timeAgo: '2h ago' },
  { id: 2, type: 'reel', size: 'large', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', likes: '2.4k', comments: 124, user: { username: 'tech_guru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2' }, caption: 'Future of tech is here! 💻', timeAgo: '4h ago' },
  { id: 3, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop', likes: '8k', comments: 400, user: { username: 'design_daily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3' }, caption: 'Abstract geometry is always a good idea.', timeAgo: '5h ago' },
  { id: 4, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', likes: '450', comments: 12, user: { username: 'cyber_punk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4' }, caption: 'Setup goals.', timeAgo: '1d ago' },
  { id: 5, type: 'reel', size: 'small', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop', likes: '900', comments: 45, user: { username: 'code_life', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c5' }, caption: 'Late night coding sessions.', timeAgo: '1d ago' },
  { id: 6, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', likes: '3.1k', comments: 89, user: { username: 'portrait_pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c6' }, caption: 'Golden hour portraits.', timeAgo: '2d ago' },
  { id: 7, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop', likes: '5.5k', comments: 120, user: { username: 'nature_lover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c7' }, caption: 'Lost in the woods.', timeAgo: '2d ago' },
  { id: 8, type: 'reel', size: 'large', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=800&auto=format&fit=crop', likes: '10k', comments: 500, user: { username: 'cat_memes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c8' }, caption: 'Just cat things 🐱', timeAgo: '3d ago' },
  { id: 9, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop', likes: '1.1k', comments: 42, user: { username: 'fashion_week', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c9' }, caption: 'Spring collection drop.', timeAgo: '4d ago' },
  { id: 10, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop', likes: '7.8k', comments: 310, user: { username: 'wanderlust', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c10' }, caption: 'Take me back here!', timeAgo: '5d ago' },
  { id: 11, type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop', likes: '9.2k', comments: 840, user: { username: 'beauty_tips', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c11' }, caption: 'Daily routine essentials.', timeAgo: '1w ago' },
  { id: 12, type: 'reel', size: 'small', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop', likes: '6.4k', comments: 200, user: { username: 'fitness_junkie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c12' }, caption: 'Morning workout done! 💪', timeAgo: '1w ago' },
];

const Explore = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 md:px-8 py-6">
      {/* Search Bar */}
      <div className="mb-6 sticky top-0 z-10 bg-bg-darker/80 backdrop-blur-md py-2">
        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-surface text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 transition-all border border-white/5"
          />
        </div>
      </div>

      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4 auto-rows-[120px] sm:auto-rows-[150px] md:auto-rows-[250px]">
        {EXPLORE_POSTS.map((post) => {
          const isLarge = post.size === 'large';

          return (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`relative group cursor-pointer overflow-hidden bg-surface ${isLarge ? 'row-span-2' : ''}`}
            >
              <img
                src={post.image}
                alt="Explore post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Type indicator (Reel icon) */}
              {post.type === 'reel' && (
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  <Film size={20} className="fill-white/80" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 md:gap-6 transition-opacity duration-300">
                <div className="flex items-center gap-1 md:gap-2 text-white font-bold text-sm md:text-base">
                  <span className="text-lg md:text-xl text-primary-pink">♥</span> {post.likes}
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-white font-bold text-sm md:text-base">
                  <span className="text-lg md:text-xl">💬</span> {post.comments}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-black/95 md:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full h-full md:h-auto md:max-w-lg overflow-y-auto hide-scrollbar md:rounded-3xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedPost(null)}
              className="fixed md:absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
            <div className="min-h-full flex flex-col justify-center pt-16 md:pt-0">
              <PostCard post={selectedPost} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
