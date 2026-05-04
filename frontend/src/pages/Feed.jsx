import React from 'react';
import StoriesBar from '../components/feed/StoriesBar';
import PostCard from '../components/feed/PostCard';

// Import local assets
import reel1 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM.mp4';
import reel2 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM (1).mp4';

const MOCK_STORIES = [
  { id: 1, username: 'alex_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', viewed: false },
  { id: 2, username: 'mira_art', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', viewed: false },
  { id: 3, username: 'urban_fit', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo', viewed: false },
  { id: 4, username: 'sarah_studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', viewed: true },
  { id: 5, username: 'jason_creativ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason', viewed: true },
  { id: 6, username: 'elara.design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara', viewed: true },
];

const MOCK_POSTS = [
  {
    id: 1,
    user: {
      username: 'jason_creativ',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
      hasStory: true,
    },
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    likes: 2481,
    comments: 84,
    caption: 'Exploring the boundaries of high-contrast visuals today. The pink and black combo never fails. #creatoreconomy #design',
    timeAgo: '2 hours ago',
  },
  {
    id: 2,
    user: {
      username: 'sophie.vogue',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      hasStory: false,
    },
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    likes: 1102,
    comments: 12,
    caption: 'Fashion is an extension of the self. New collection drop tomorrow! 🖤✨',
    timeAgo: '5 hours ago',
  },
  {
    id: 3,
    user: {
      username: 'urban_fit',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
      hasStory: true,
    },
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
    likes: 856,
    comments: 24,
    caption: 'Morning grind. No excuses. 💪',
    timeAgo: '8 hours ago',
  }
];

const SUGGESTIONS = [
  { id: 1, username: 'elara.design', subtitle: 'Followed by jason_creativ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara' },
  { id: 2, username: 'marcus_xv', subtitle: 'New to AnyThing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: 3, username: 'nina.vibes', subtitle: 'Followed by alex_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina' },
];

const Feed = () => {
  return (
    <div className="flex h-full w-full justify-center">
      {/* Main Feed Column */}
      <div className="w-full max-w-2xl px-4 py-6 md:px-8">
        <StoriesBar stories={MOCK_STORIES} />
        
        <div className="mt-8">
          {/* Post 1 */}
          <PostCard post={MOCK_POSTS[0]} />

          {/* Reels Section (Instagram injects these into the feed) */}
          <div className="my-8 py-4 bg-surface rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-4 flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">🎬</span> Reels
              </h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { id: 1, video: reel1, views: '1.2M', user: 'jason_creativ' },
                { id: 2, video: reel2, views: '840K', user: 'sarah_codes' },
                { id: 3, video: reel1, views: '200K', user: 'alex_dev' }, // Reusing videos for demo
                { id: 4, video: reel2, views: '50K', user: 'mira_art' },
              ].map(reel => (
                <div key={reel.id} className="relative w-40 h-72 flex-shrink-0 snap-start rounded-xl overflow-hidden cursor-pointer group">
                  <video 
                    src={reel.video} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    muted 
                    loop 
                    onMouseOver={(e) => e.target.play()} 
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-bold shadow-sm flex items-center gap-1">▷ {reel.views}</p>
                    <p className="text-xs text-gray-300 shadow-sm">@{reel.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Posts */}
          {MOCK_POSTS.slice(1).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Sidebar (Suggestions) - Hidden on smaller screens */}
      <div className="hidden lg:block w-80 py-8 px-6 border-l border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 font-semibold text-sm">SUGGESTED FOR YOU</h3>
          <button className="text-white text-xs font-semibold hover:text-gray-300">See All</button>
        </div>

        <div className="space-y-4">
          {SUGGESTIONS.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{user.username}</h4>
                  <p className="text-xs text-gray-500">{user.subtitle}</p>
                </div>
              </div>
              <button className="text-primary-pink text-xs font-semibold hover:text-primary-pink-hover">
                Follow
              </button>
            </div>
          ))}
        </div>

        {/* Footer links in right sidebar */}
        <div className="mt-8 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-2">
          {['ABOUT', 'HELP', 'PRESS', 'API', 'JOBS', 'PRIVACY', 'TERMS'].map(link => (
            <a key={link} href="#" className="hover:text-gray-400">{link}</a>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-600">© 2024 ANYTHING FROM CREATOR CO.</p>
      </div>
    </div>
  );
};

export default Feed;
