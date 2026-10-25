'use client';

import React, { useState, useEffect, useCallback } from 'react';
import StoriesBar from '../../components/feed/StoriesBar';
import PostCard from '../../components/feed/PostCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

const MOCK_REELS = [
  {
    _id: 'mock1',
    imageUrl: '/WhatsApp%20Video%202026-05-05%20at%2012.19.17%20AM.mp4',
    author: { username: 'jason_creativ' },
  },
  {
    _id: 'mock2',
    imageUrl: '/WhatsApp%20Video%202026-05-05%20at%2012.19.17%20AM%20(1).mp4',
    author: { username: 'sarah_codes' },
  },
];

export default function FeedPage() {
  const { user, getAuthHeaders } = useAuth();
  const router = useRouter();
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState(MOCK_REELS);
  const [stories, setStories] = useState([]);
  const [myStory, setMyStory] = useState(null);
  const [hasMyStory, setHasMyStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch('/api/users/suggested', {
        headers: getAuthHeaders ? getAuthHeaders() : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuggestions(data.data || []);
      }
    } catch (err) {
      console.error('Error loading suggestions:', err);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const res = await fetch(`/api/follow/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders ? getAuthHeaders() : {},
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Followed successfully');
        setSuggestions((prev) => prev.filter((u) => u._id !== userId));
        fetchFeedAndReels();
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow user');
    }
  };

  const fetchFeedAndReels = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders ? getAuthHeaders() : {};

      // 1. Fetch followed feed posts
      let feedPosts = [];
      const feedRes = await fetch('/api/posts/feed', { headers, credentials: 'include' });
      const feedData = await feedRes.json();

      if (feedRes.ok && feedData.success && feedData.data.posts?.length > 0) {
        feedPosts = feedData.data.posts;
      } else {
        const publicRes = await fetch('/api/posts', { headers, credentials: 'include' });
        const publicData = await publicRes.json();
        if (publicRes.ok && publicData.success) {
          feedPosts = publicData.data.posts || [];
        }
      }

      const mappedPosts = feedPosts.map((p) => ({
        id: p._id,
        user: {
          id: p.author?._id,
          username: p.author?.username || 'unknown',
          avatar:
            p.author?.avatarUrl ||
            'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
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
        isFollowing: p.isFollowing,
      }));

      setPosts(mappedPosts);

      // 2. Fetch reels
      const reelsRes = await fetch('/api/posts?type=reel', { headers, credentials: 'include' });
      const reelsData = await reelsRes.json();
      if (reelsRes.ok && reelsData.success && reelsData.data.posts?.length > 0) {
        setReels(reelsData.data.posts);
      } else {
        setReels(MOCK_REELS);
      }

      // 3. Fetch stories
      const storiesRes = await fetch('/api/stories', { headers, credentials: 'include' });
      const storiesData = await storiesRes.json();
      if (storiesRes.ok && storiesData.success) {
        const allStories = storiesData.data || [];
        const myStoryObj = allStories.find((s) => s.id === user?._id);
        const otherStories = allStories.filter((s) => s.id !== user?._id);

        setStories(otherStories);
        setMyStory(myStoryObj || null);
        setHasMyStory(!!(myStoryObj && myStoryObj.stories?.length > 0));
      }
    } catch (err) {
      console.error('Error loading feed:', err);
      setReels(MOCK_REELS);
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

  const handleNewPost = useCallback(
    (newPost) => {
      const mapped = {
        id: newPost._id,
        user: {
          id: newPost.author?._id,
          username: newPost.author?.username || user?.username || 'you',
          avatar:
            newPost.author?.avatarUrl ||
            user?.avatarUrl ||
            'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
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
      setPosts((prev) => [mapped, ...prev]);
    },
    [user]
  );

  useEffect(() => {
    if (!socket) return;
    const handleFeedUpdate = (newPost) => {
      handleNewPost(newPost);
    };
    socket.on('feedUpdated', handleFeedUpdate);
    return () => socket.off('feedUpdated', handleFeedUpdate);
  }, [socket, handleNewPost]);

  useEffect(() => {
    const handleOwnPost = (e) => {
      handleNewPost(e.detail);
    };
    window.addEventListener('ownPostCreated', handleOwnPost);
    return () => window.removeEventListener('ownPostCreated', handleOwnPost);
  }, [handleNewPost]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <LoadingSpinner
          size="lg"
          text="Loading your feed..."
          subtext="Fetching the freshest posts & reels"
        />
      </div>
    );
  }

  const ReelsStrip = () => (
    <div className="my-4 md:my-8 py-4 bg-surface md:rounded-3xl border-y md:border border-white/5 overflow-hidden shadow-lg">
      <div className="px-4 flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">🎬</span> Reels
        </h3>
        <button
          onClick={() => router.push('/app/reels')}
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
          <motion.div
            key={reel._id}
            whileHover={{ scale: 1.03 }}
            onClick={() => router.push('/app/reels')}
            className="relative w-36 h-64 md:w-40 md:h-72 flex-shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer group shadow-md"
          >
            <video
              src={reel.imageUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-bold shadow-sm flex items-center gap-1">▷ Watch</p>
              <p className="text-xs text-gray-300 shadow-sm">@{reel.author?.username || 'user'}</p>
            </div>
          </motion.div>
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
              <PostCard post={posts[0]} />
              <ReelsStrip />
              {posts.slice(1).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
          ) : (
            <>
              <ReelsStrip />
              <div className="text-center py-16 text-gray-500">
                <p className="font-semibold text-lg">No posts on feed yet.</p>
                <p className="text-sm text-gray-600 mt-1">Create one using the Create button!</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar (Suggestions) */}
      <div className="hidden lg:block w-80 py-8 px-6 border-l border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 font-semibold text-sm">SUGGESTED FOR YOU</h3>
          <button
            onClick={() => router.push('/app/explore/people')}
            className="text-white text-xs font-semibold hover:text-gray-300"
          >
            See All
          </button>
        </div>

        <div className="space-y-4">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((u) => (
              <div key={u._id} className="flex items-center justify-between">
                <div
                  onClick={() => router.push('/app/profile')}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={
                      u.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                    }
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover bg-surface border border-white/5 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-primary-pink transition-colors">
                      {u.username}
                    </h4>
                    <p className="text-xs text-gray-500 truncate max-w-[130px]">
                      {u.name || 'Suggested for you'}
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

        <div className="mt-8 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-2">
          {['ABOUT', 'HELP', 'PRESS', 'API', 'JOBS', 'PRIVACY', 'TERMS'].map((link) => (
            <span key={link} className="hover:text-gray-400 cursor-pointer">
              {link}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-600">© 2026 ANYTHING SOCIAL PLATFORM.</p>
      </div>
    </div>
  );
}
