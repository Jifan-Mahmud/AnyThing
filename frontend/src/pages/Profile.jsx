import React, { useState } from 'react';
import { Settings, Grid, Bookmark, UserPlus, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const passedUser = location.state?.user;
  const isCurrentUser = !passedUser || passedUser.username === MOCK_PROFILE.username;
  
  const [isFollowing, setIsFollowing] = useState(false);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const displayUser = isCurrentUser ? MOCK_PROFILE : {
    ...MOCK_PROFILE,
    username: passedUser.username,
    avatar: passedUser.avatar,
    name: passedUser.username.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    bio: `Hey there! I am ${passedUser.username}. Welcome to my profile! ✨`
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 py-6 md:py-8 md:px-8">
      {!isCurrentUser && (
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-white mb-6 hover:text-primary-pink transition-colors w-max"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back</span>
        </button>
      )}
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:gap-8 mb-8 md:mb-12">
        {/* Mobile: Avatar and Stats side by side. Desktop: Avatar left, rest right */}
        <div className="flex items-center gap-6 md:gap-8 mb-4 md:mb-0">
          <div className="flex-shrink-0">
            <Avatar src={displayUser.avatar} size="xl" className="border-4 border-surface w-20 h-20 md:w-32 md:h-32" />
          </div>

          {/* Stats (Mobile only view, hidden on md) */}
          <div className="flex flex-1 justify-around text-center md:hidden">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{displayUser.posts}</span>
              <span className="text-gray-400 text-xs">posts</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{displayUser.followers}k</span>
              <span className="text-gray-400 text-xs">followers</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{displayUser.following}</span>
              <span className="text-gray-400 text-xs">following</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold">{displayUser.username}</h1>
            <div className="flex gap-2">
              {isCurrentUser ? (
                <>
                  <button className="flex-1 md:flex-none px-4 py-1.5 bg-surface-light text-white rounded-lg font-semibold text-sm hover:bg-surface transition-colors">
                    Edit Profile
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-1.5 bg-surface-light text-white rounded-lg font-semibold text-sm hover:bg-surface transition-colors">
                    Share Profile
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex-1 md:flex-none px-6 py-1.5 rounded-lg font-bold text-sm transition-all ${
                      isFollowing 
                        ? 'bg-surface-light text-white hover:bg-surface' 
                        : 'bg-primary-pink text-white hover:bg-primary-pink-hover shadow-lg shadow-primary-pink/20'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-1.5 bg-surface-light text-white rounded-lg font-semibold text-sm hover:bg-surface transition-colors">
                    Message
                  </button>
                </>
              )}
              <button className="p-1.5 bg-surface-light text-white rounded-lg hover:bg-surface transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Stats (Desktop only view) */}
          <div className="hidden md:flex gap-10 mb-6 text-sm md:text-base">
            <div>
              <span className="font-bold">{displayUser.posts}</span> <span className="text-gray-400">posts</span>
            </div>
            <div className="cursor-pointer">
              <span className="font-bold">{displayUser.followers}k</span> <span className="text-gray-400">followers</span>
            </div>
            <div className="cursor-pointer">
              <span className="font-bold">{displayUser.following}</span> <span className="text-gray-400">following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="text-sm md:text-base">
            <h2 className="font-bold">{displayUser.name}</h2>
            <p className="whitespace-pre-line text-gray-300 mt-1">{displayUser.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around md:justify-center border-t border-white/10 mb-1 md:mb-6">
        <div className="flex w-full md:w-auto md:gap-12 justify-around">
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 md:py-4 border-t-2 border-primary-pink text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <Grid size={24} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Posts</span>
          </button>
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 md:py-4 border-t-2 border-transparent text-gray-400 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <Bookmark size={24} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Saved</span>
          </button>
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 py-3 md:py-4 border-t-2 border-transparent text-gray-400 hover:text-white font-semibold text-xs tracking-widest uppercase transition-colors">
            <UserPlus size={24} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Tagged</span>
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
