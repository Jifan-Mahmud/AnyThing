import React from 'react';
import { Settings, Grid, Bookmark, UserPlus } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

const MOCK_PROFILE = {
  username: 'jason_creativ',
  name: 'Jason Creativ',
  bio: 'Digital artist & UI/UX designer. Exploring the intersection of neon and brutalism. 🎨✨\nBased in New York.',
  followers: 12.4,
  following: 842,
  posts: 42,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason'
};

const MOCK_USER_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', likes: 2481, comments: 84 },
  { id: 2, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', likes: 1102, comments: 12 },
  { id: 3, image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop', likes: 856, comments: 24 },
  { id: 4, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', likes: 3402, comments: 142 },
  { id: 5, image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop', likes: 210, comments: 5 },
  { id: 6, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', likes: 5892, comments: 402 },
];

const Profile = () => {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 py-8 md:px-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="flex-shrink-0">
          <Avatar src={MOCK_PROFILE.avatar} size="xl" className="border-4 border-surface" />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 w-full justify-center md:justify-start">
            <h1 className="text-2xl font-bold">{MOCK_PROFILE.username}</h1>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-1.5 bg-surface-light text-white rounded-lg font-semibold text-sm hover:bg-surface transition-colors">
                Edit Profile
              </button>
              <button className="p-1.5 bg-surface-light text-white rounded-lg hover:bg-surface transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-6 mb-4 text-sm">
            <div className="flex flex-col md:flex-row md:gap-1 items-center">
              <span className="font-bold text-lg md:text-base">{MOCK_PROFILE.posts}</span>
              <span className="text-gray-400">posts</span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-1 items-center cursor-pointer">
              <span className="font-bold text-lg md:text-base">{MOCK_PROFILE.followers}k</span>
              <span className="text-gray-400">followers</span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-1 items-center cursor-pointer">
              <span className="font-bold text-lg md:text-base">{MOCK_PROFILE.following}</span>
              <span className="text-gray-400">following</span>
            </div>
          </div>

          <div className="text-sm">
            <h2 className="font-bold">{MOCK_PROFILE.name}</h2>
            <p className="whitespace-pre-line text-gray-300 mt-1">{MOCK_PROFILE.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t border-white/10 mb-6">
        <div className="flex gap-12">
          <button className="flex items-center gap-2 py-4 border-t-2 border-primary-pink text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <Grid size={16} /> Posts
          </button>
          <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-gray-400 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <Bookmark size={16} /> Saved
          </button>
          <button className="flex items-center gap-2 py-4 border-t-2 border-transparent text-gray-400 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <UserPlus size={16} /> Tagged
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {MOCK_USER_POSTS.map((post) => (
          <div key={post.id} className="relative aspect-square group cursor-pointer bg-surface overflow-hidden">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay with stats */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-xl">♥</span> {post.likes}
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-xl">💬</span> {post.comments}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
