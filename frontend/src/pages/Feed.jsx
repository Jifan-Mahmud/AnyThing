import React, { useState, useEffect, useCallback } from 'react';
import StoriesBar from '../components/feed/StoriesBar';
import PostCard from '../components/feed/PostCard';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

// Import local assets for mock story/reel fallbacks
import reel1 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM.mp4';
import reel2 from '../assets/WhatsApp Video 2026-05-05 at 12.19.17 AM (1).mp4';

const MOCK_STORIES = [
  { id: 1, username: 'alex_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', viewed: false },
  { id: 2, username: 'mira_art', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', viewed: false },
  { id: 3, username: 'urban_fit', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo', viewed: false },
  { id: 4, username: 'sarah_studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', viewed: true },
];

const MOCK_REELS = [
  { _id: 'mock1', imageUrl: reel1, author: { username: 'jason_creativ' } },
  { _id: 'mock2', imageUrl: reel2, author: { username: 'sarah_codes' } },
];

const SUGGESTIONS = [
  { id: 1, username: 'elara.design', subtitle: 'Followed by you', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara' },
  { id: 2, username: 'marcus_xv', subtitle: 'New to AnyThing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: 3, username: 'nina.vibes', subtitle: 'Followed by alex_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina' },
];

const Feed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState(MOCK_REELS); // always start with mock reels visible
  const [stories, setStories] = useState([]);
  const [myStory, setMyStory] = useState(null);
  const [hasMyStory, setHasMyStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/api/users/suggested", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuggestions(data.data || []);
      }
    } catch (err) {
      console.error("Error loading suggestions:", err);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const res = await fetch(`/api/follow/${userId}`, {
        method: "POST",
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Followed successfully");
        setSuggestions(prev => prev.filter(u => u._id !== userId));
        fetchFeedAndReels();
      }
    } catch (err) {
      console.error("Error following user:", err);
      toast.error("Failed to follow user");
    }
  };

  const fetchFeedAndReels = async () => {
    setLoading(true);
    try {
      // 1. Try to fetch followed feed posts
      let feedPosts = [];
      const feedRes = await fetch("/api/posts/feed", { credentials: "include" });
      const feedData = await feedRes.json();

      if (feedRes.ok && feedData.success && feedData.data.posts?.length > 0) {
        feedPosts = feedData.data.posts;
      } else {
        // Fallback: fetch all public posts
        const publicRes = await fetch("/api/posts", { credentials: "include" });
        const publicData = await publicRes.json();
        if (publicRes.ok && publicData.success) {
          feedPosts = publicData.data.posts || [];
        }
      }

      // Map backend posts to frontend structure
      const mappedPosts = feedPosts.map(p => ({
        id: p._id,
        user: {
          id: p.author?._id,
          username: p.author?.username || 'unknown',
          avatar: p.author?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
          hasStory: false,
        },
        location: '',
        image: p.imageUrl,
        likes: p.likeCount || 0,
        comments: 0,
        caption: p.caption || '',
        timeAgo: new Date(p.createdAt).toLocaleDateString(),
        likedByMe: p.likedByMe || false,
        type: p.type,
        isFollowing: p.isFollowing
      }));

      setPosts(mappedPosts);

      // 2. Fetch real reels — fall back to mock if none in DB
      const reelsRes = await fetch("/api/posts?type=reel", { credentials: "include" });
      const reelsData = await reelsRes.json();
      if (reelsRes.ok && reelsData.success && reelsData.data.posts?.length > 0) {
        setReels(reelsData.data.posts);
      } else {
        setReels(MOCK_REELS);
      }

      // 3. Fetch backend stories
      const storiesRes = await fetch("/api/stories", { credentials: "include" });
      const storiesData = await storiesRes.json();
      if (storiesRes.ok && storiesData.success) {
        const allStories = storiesData.data || [];
        
        // Filter out current user's active stories to display on 'Your Story' bubble
        const myStoryObj = allStories.find(s => s.id === user?._id);
        const otherStories = allStories.filter(s => s.id !== user?._id);
        
        setStories(otherStories);
        setMyStory(myStoryObj || null);
        setHasMyStory(!!(myStoryObj && myStoryObj.stories?.length > 0));
      }
    } catch (err) {
      console.error("Error loading feed:", err);
      setReels(MOCK_REELS); // always show something
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeedAndReels();
      fetchSuggestions();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle new post from CreatePostModal (own post)
  const handleNewPost = useCallback((newPost) => {
    const mapped = {
      id: newPost._id,
      user: {
        id: newPost.author?._id,
        username: newPost.author?.username || user?.username || 'you',
        avatar: newPost.author?.avatarUrl || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
        hasStory: false,
      },
      location: '',
      image: newPost.imageUrl,
      likes: 0,
      comments: 0,
      caption: newPost.caption || '',
      timeAgo: 'Just now',
      likedByMe: false,
      type: newPost.type,
      isFollowing: false,
    };
    setPosts(prev => [mapped, ...prev]);
  }, [user]);

  // Listen for real-time posts from other users via socket
  useEffect(() => {
    if (!socket) return;
    const handleFeedUpdate = (newPost) => {
      handleNewPost(newPost);
    };
    socket.on('feedUpdated', handleFeedUpdate);
    return () => socket.off('feedUpdated', handleFeedUpdate);
  }, [socket, handleNewPost]);

  // Listen for own post created (browser custom event from CreatePostModal)
  useEffect(() => {
    const handleOwnPost = (e) => {
      handleNewPost(e.detail);
    };
    window.addEventListener('ownPostCreated', handleOwnPost);
    return () => window.removeEventListener('ownPostCreated', handleOwnPost);
  }, [handleNewPost]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="animate-spin text-primary-pink" size={40} />
      </div>
    );
  }

  // ── Reels strip — always visible regardless of posts ────────────────────────
  const ReelsStrip = () => (
    <div className="my-4 md:my-8 py-4 bg-surface md:rounded-2xl border-y md:border border-white/5 overflow-hidden">
      <div className="px-4 flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">🎬</span> Reels
        </h3>
        {/* "See all" button navigates to /app/reels */}
        <button
          onClick={() => navigate('/app/reels')}
          className="text-xs font-bold text-primary-pink hover:text-white transition-colors uppercase tracking-wider"
        >
          See all →
        </button>
      </div>

      <div
        className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel) => (
          <div
            key={reel._id}
            onClick={() => navigate('/app/reels')}
            className="relative w-36 h-64 md:w-40 md:h-72 flex-shrink-0 snap-start rounded-xl overflow-hidden cursor-pointer group"
          >
            <video
              src={reel.imageUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-bold shadow-sm flex items-center gap-1">▷ Watch</p>
              <p className="text-xs text-gray-300 shadow-sm">@{reel.author?.username || 'user'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full justify-center">
      {/* Main Feed Column */}
      <div className="w-full max-w-2xl px-0 md:px-8 py-2 md:py-6 overflow-x-hidden">
          <StoriesBar 
            stories={stories} 
            currentUser={user} 
            hasMyStory={hasMyStory}
            myStory={myStory}
            onStoryUploaded={() => fetchFeedAndReels()}
          />

        <div className="mt-4 md:mt-8 space-y-6">
          {posts.length > 0 ? (
            <>
              {/* First post */}
              <PostCard post={posts[0]} />

              {/* Reels section — always shown */}
              <ReelsStrip />

              {/* Remaining posts */}
              {posts.slice(1).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          ) : (
            <>
              {/* No posts yet — still show Reels strip */}
              <ReelsStrip />
              <div className="text-center py-16 text-gray-500">
                <p className="font-semibold text-lg">No posts on feed yet.</p>
                <p className="text-sm text-gray-600 mt-1">Create one using the Create button!</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar (Suggestions) - Hidden on smaller screens */}
      <div className="hidden lg:block w-80 py-8 px-6 border-l border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 font-semibold text-sm">SUGGESTED FOR YOU</h3>
          <button onClick={() => navigate('/app/explore/people')} className="text-white text-xs font-semibold hover:text-gray-300">See All</button>
        </div>

        <div className="space-y-4">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((u) => (
              <div key={u._id} className="flex items-center justify-between">
                <div onClick={() => navigate(`/app/profile`, { state: { user: u } })} className="flex items-center gap-3 cursor-pointer">
                  <img 
                    src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                    alt={u.username} 
                    className="w-10 h-10 rounded-full object-cover bg-surface border border-white/5" 
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white hover:text-primary-pink transition-colors">
                      {u.username}
                    </h4>
                    <p className="text-xs text-gray-500 truncate max-w-[130px]">
                      {u.name || "Suggested for you"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleFollowUser(u._id)}
                  className="text-primary-pink text-xs font-semibold hover:text-primary-pink-hover transition-colors"
                >
                  Follow
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 text-center py-2">No new suggestions</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-2">
          {['ABOUT', 'HELP', 'PRESS', 'API', 'JOBS', 'PRIVACY', 'TERMS'].map(link => (
            <a key={link} href="#" className="hover:text-gray-400">{link}</a>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-600">© 2026 ANYTHING FROM CREATOR CO.</p>
      </div>
    </div>
  );
};

export default Feed;
