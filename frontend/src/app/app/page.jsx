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
import { Play, Sparkles, UserPlus, Compass } from 'lucide-react';

const MOCK_REELS = [
  {
    _id: 'mock1',
    imageUrl: 'https://res.cloudinary.com/mmquu2ps/video/upload/v1785047869/posts/nixnmu8iap3w0vqhajeb.mp4',
    author: { username: 'jason_creativ' },
  },
  {
    _id: 'mock2',
    imageUrl: 'https://res.cloudinary.com/mmquu2ps/video/upload/v1783952896/posts/pttivngorgifmzfkdj27.mp4',
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
        toast.success(data.message || 'Followed creator!');
        setSuggestions((prev) => prev.filter((u) => u._id !== userId));
        fetchFeedAndReels();
      }
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow creator');
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
        image: p.imageUrl,
        likes: p.likeCount || 0,
        comments: 0,
        caption: p.caption || '',
        timeAgo: new Date(p.createdAt).toLocaleDateString(),
        type: p.type || 'image',
        isFollowing: p.isFollowing || false,
      }));
      setPosts(mappedPosts);

      // 2. Fetch Reels
      const reelsRes = await fetch('/api/posts?type=reel', { headers, credentials: 'include' });
      const reelsData = await reelsRes.json();
      if (reelsRes.ok && reelsData.success && reelsData.data.posts?.length > 0) {
        setReels(reelsData.data.posts);
      }

      // 3. Fetch Stories
      const storiesRes = await fetch('/api/stories', { headers, credentials: 'include' });
      const storiesData = await storiesRes.json();
      if (storiesRes.ok && storiesData.success && storiesData.data?.stories) {
        const fetchedStories = storiesData.data.stories;
        const currentUserId = user?._id || user?.id;
        const myActive = fetchedStories.find((s) => s.author?._id === currentUserId);
        const others = fetchedStories.filter((s) => s.author?._id !== currentUserId);

        if (myActive) {
          setHasMyStory(true);
          setMyStory({
            id: myActive._id,
            username: myActive.author?.username || 'You',
            avatar: myActive.author?.avatarUrl,
            mediaUrl: myActive.mediaUrl,
            mediaType: myActive.mediaType,
          });
        } else {
          setHasMyStory(false);
          setMyStory(null);
        }

        const mappedOthers = others.map((s) => ({
          id: s._id,
          username: s.author?.username || 'user',
          avatar:
            s.author?.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.author?.username}`,
          mediaUrl: s.mediaUrl,
          mediaType: s.mediaType,
          viewed: false,
        }));
        setStories(mappedOthers);
      }
    } catch (err) {
      console.error('Error fetching feed content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedAndReels();
    fetchSuggestions();
  }, [user]);

  // Real-time new post socket listener
  useEffect(() => {
    if (socket) {
      const handleNewPost = (newPost) => {
        setPosts((prev) => [
          {
            id: newPost._id,
            user: {
              id: newPost.author?._id,
              username: newPost.author?.username || 'unknown',
              avatar:
                newPost.author?.avatarUrl ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder',
              hasStory: false,
            },
            image: newPost.imageUrl,
            likes: 0,
            comments: 0,
            caption: newPost.caption || '',
            timeAgo: 'Just now',
            type: newPost.type || 'image',
            isFollowing: true,
          },
          ...prev,
        ]);
      };

      socket.on('post:created', handleNewPost);
      return () => socket.off('post:created', handleNewPost);
    }
  }, [socket]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-12">
        <LoadingSpinner
          size="lg"
          text="Curating your feed..."
          subtext="Fetching the freshest stories and reels"
        />
      </div>
    );
  }

  const ReelsStrip = () => (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 my-6 border border-white/5 shadow-xl sm:max-w-xl md:max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-pink animate-pulse" />
          <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            <span>Trending Reels</span>
            <Sparkles className="w-3.5 h-3.5 text-primary-pink" />
          </h3>
        </div>
        <button
          onClick={() => router.push('/app/reels')}
          className="text-xs font-bold text-primary-pink hover:text-primary-pink-hover transition-colors flex items-center gap-1"
        >
          Watch All
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {reels.map((reel) => (
          <motion.div
            key={reel._id}
            whileHover={{ y: -4, scale: 1.03 }}
            onClick={() => router.push('/app/reels')}
            className="relative w-32 sm:w-36 aspect-[9/16] rounded-2xl overflow-hidden bg-bg-darker shrink-0 cursor-pointer border border-white/10 group shadow-lg"
          >
            <video
              src={reel.imageUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.target.play().catch(() => {})}
              onMouseOut={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 right-2 text-left pointer-events-none">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-bold mb-1">
                <Play className="w-2.5 h-2.5 fill-white" />
                Play
              </span>
              <p className="text-[11px] font-bold text-white truncate drop-shadow-sm">
                @{reel.author?.username || 'creator'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full justify-center">
      {/* Main Feed Column */}
      <div className="w-full max-w-2xl px-3 sm:px-6 md:px-8 py-3 sm:py-6 overflow-x-hidden">
        <StoriesBar
          stories={stories}
          currentUser={user}
          hasMyStory={hasMyStory}
          myStory={myStory}
          onStoryUploaded={() => fetchFeedAndReels()}
        />

        <div className="space-y-4">
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
              <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 my-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-zinc-500 mb-4">
                  <Compass className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-white mb-1">No posts on your feed yet</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
                  Follow some suggested creators or share your first post using the Create button!
                </p>
                <button
                  onClick={() => router.push('/app/explore')}
                  className="px-6 py-2.5 rounded-full bg-primary-pink hover:bg-primary-pink-hover text-white text-xs font-bold shadow-lg shadow-primary-pink/25 transition-all"
                >
                  Explore Trending Posts
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar Suggestions (Desktop Only) */}
      <aside className="hidden lg:block w-80 py-8 px-6 border-l border-white/5 shrink-0 select-none">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
            Suggested Creators
          </h3>
          <button
            onClick={() => router.push('/app/explore/people')}
            className="text-primary-pink text-xs font-bold hover:underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-3.5">
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((u) => (
              <motion.div
                key={u._id}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/[0.03] transition-colors"
              >
                <div
                  onClick={() => router.push('/app/profile')}
                  className="flex items-center gap-3 cursor-pointer group min-w-0"
                >
                  <img
                    src={
                      u.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`
                    }
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover bg-surface border border-white/10 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white group-hover:text-primary-pink transition-colors truncate">
                      {u.username}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate max-w-[120px]">
                      {u.name || 'Suggested creator'}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFollowUser(u._id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary-pink/10 hover:bg-primary-pink text-primary-pink hover:text-white transition-all shrink-0 cursor-pointer"
                >
                  Follow
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-zinc-400 text-xs">
              All caught up! No new suggestions.
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="mt-10 pt-6 border-t border-white/5 text-[11px] text-zinc-400 space-y-3">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {['About', 'Help', 'API', 'Privacy', 'Terms', 'Creators'].map((link) => (
              <span key={link} className="hover:text-zinc-400 cursor-pointer">
                {link}
              </span>
            ))}
          </div>
          <p>© 2026 AnyThing Social. Designed with Care.</p>
        </div>
      </aside>
    </div>
  );
}
