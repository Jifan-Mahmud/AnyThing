import React, { useState, useEffect } from 'react';
import { Search, Film, X, Loader2 } from 'lucide-react';
import PostCard from '../components/feed/PostCard';

const MOCK_EXPLORE_POSTS = [
  { id: 'mock1', type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', likes: '1.2k', comments: 34, user: { username: 'creative_soul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1' }, caption: 'Loving these neon aesthetics! 💜', timeAgo: '2h ago' },
  { id: 'mock2', type: 'reel', size: 'large', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', likes: '2.4k', comments: 124, user: { username: 'tech_guru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2' }, caption: 'Future of tech is here! 💻', timeAgo: '4h ago' },
  { id: 'mock3', type: 'image', size: 'small', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop', likes: '8k', comments: 400, user: { username: 'design_daily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3' }, caption: 'Abstract geometry is always a good idea.', timeAgo: '5h ago' },
];

const Explore = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchExplorePosts = async () => {
    setLoading(true);
    try {
      let url = "/api/posts";
      // If there is a search query, we can query users or posts.
      // For now, let's load all posts/reels.
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      
      if (res.ok && data.success && data.data.posts?.length > 0) {
        const mapped = data.data.posts.map(p => ({
          id: p._id,
          type: p.type === 'reel' ? 'reel' : 'image',
          size: p.type === 'reel' ? 'large' : 'small',
          image: p.imageUrl,
          likes: p.likeCount || 0,
          comments: 0,
          user: {
            username: p.author?.username || 'unknown',
            avatar: p.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
            hasStory: false
          },
          caption: p.caption || '',
          timeAgo: new Date(p.createdAt).toLocaleDateString()
        }));
        setPosts(mapped);
      } else {
        setPosts(MOCK_EXPLORE_POSTS);
      }
    } catch (err) {
      console.error("Error loading explore posts:", err);
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
      // If empty query, reset
      if (!searchQuery.trim()) {
        fetchExplorePosts();
        return;
      }
      setLoading(true);
      try {
        // Search by username
        const res = await fetch(`/api/users/search?q=${searchQuery}`, { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success && data.data.users?.length > 0) {
          // Map searched users to a mock post list (representing profiles found)
          const mappedUsers = data.data.users.map(u => ({
            id: u._id,
            type: 'image',
            size: 'small',
            image: u.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
            likes: 0,
            comments: 0,
            user: {
              username: u.username,
              avatar: u.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
              hasStory: false
            },
            caption: u.bio || 'User profile',
            timeAgo: 'Joined recently'
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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 md:px-8 py-6">
      {/* Search Bar */}
      <div className="mb-6 sticky top-0 z-10 bg-bg-darker/80 backdrop-blur-md py-2">
        <div className="relative w-full max-w-md mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search username & press Enter"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full bg-surface text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-pink/50 transition-all border border-white/5"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-pink" size={40} />
        </div>
      ) : posts.length > 0 ? (
        /* Explore Grid */
        <div className="grid grid-cols-3 gap-1 md:gap-4 auto-rows-[120px] sm:auto-rows-[150px] md:auto-rows-[250px]">
          {posts.map((post) => {
            const isLarge = post.size === 'large';

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`relative group cursor-pointer overflow-hidden bg-surface rounded-xl ${isLarge ? 'row-span-2' : ''}`}
              >
                {post.type === 'reel' ? (
                  <video 
                    src={post.image} 
                    className="w-full h-full object-cover" 
                    muted 
                    loop
                    playsInline
                    onMouseOver={(e) => e.target.play().catch(err => console.log(err))}
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                ) : (
                  <img
                    src={post.image}
                    alt="Explore post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

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
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="font-semibold text-lg">No posts or users found.</p>
        </div>
      )}

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
