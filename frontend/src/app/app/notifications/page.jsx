'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  UserPlus,
  ImageIcon,
  Film,
  BookImage,
  Phone,
  Video,
  Bell,
  Trash2,
  Sparkles,
} from 'lucide-react';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { toast } from 'react-toastify';
import { motion } from 'motion/react';

const timeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
};

const NotifIcon = ({ type }) => {
  const base = 'w-4 h-4';
  switch (type) {
    case 'like':
      return <Heart className={`${base} text-rose-400`} fill="currentColor" />;
    case 'follow':
      return <UserPlus className={`${base} text-blue-400`} />;
    case 'comment':
      return <ImageIcon className={`${base} text-amber-400`} />;
    case 'post':
      return <ImageIcon className={`${base} text-primary-pink`} />;
    case 'reel':
      return <Film className={`${base} text-purple-400`} />;
    case 'story':
      return <BookImage className={`${base} text-emerald-400`} />;
    case 'audio_call':
      return <Phone className={`${base} text-emerald-400`} />;
    case 'video_call':
      return <Video className={`${base} text-sky-400`} />;
    default:
      return <Bell className={`${base} text-zinc-400`} />;
  }
};

const notifText = (type, senderName) => {
  switch (type) {
    case 'follow':
      return `${senderName} started following you.`;
    case 'like':
      return `${senderName} liked your post.`;
    case 'comment':
      return `${senderName} commented on your post.`;
    case 'post':
      return `${senderName} shared a new post.`;
    case 'reel':
      return `${senderName} shared a new reel.`;
    case 'story':
      return `${senderName} added a new story.`;
    case 'audio_call':
      return `${senderName} called you (Audio).`;
    case 'video_call':
      return `${senderName} called you (Video).`;
    default:
      return `${senderName} interacted with you.`;
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  const fetchNotifications = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/notifications?limit=50', { headers, credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.data?.notifications || []);
        setUnreadCount(data.data?.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!socket) return;
    const handler = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(`🔔 ${notifText(notif.type, notif.sender?.username || 'Someone')}`, {
        autoClose: 3000,
        onClick: () => router.push('/app/notifications'),
      });
    };
    socket.on('newNotification', handler);
    return () => socket.off('newNotification', handler);
  }, [socket, router]);

  const handleMarkAllRead = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fetch('/api/notifications/read-all', {
      method: 'PATCH',
      headers,
      credentials: 'include',
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClearAll = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fetch('/api/notifications', { method: 'DELETE', headers, credentials: 'include' });
    setNotifications([]);
    setUnreadCount(0);
    toast.success('All notifications cleared');
  };

  const handleMarkRead = async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
    });
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleFollowBack = async (senderId) => {
    const isFollowing = followingMap[senderId];
    const method = isFollowing ? 'DELETE' : 'POST';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/follow/${senderId}`, {
      method,
      headers,
      credentials: 'include',
    });
    if (res.ok) {
      setFollowingMap((prev) => ({ ...prev, [senderId]: !isFollowing }));
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) handleMarkRead(notif._id);
    const sender = notif.sender;
    if (notif.type === 'follow' && sender) {
      router.push('/app/profile');
    } else if (notif.refPost || notif.refStory) {
      router.push('/app');
    }
  };

  const now = new Date();
  const today = notifications.filter((n) => now - new Date(n.createdAt) < 86400000);
  const thisWeek = notifications.filter((n) => {
    const diff = now - new Date(n.createdAt);
    return diff >= 86400000 && diff < 604800000;
  });
  const earlier = notifications.filter((n) => now - new Date(n.createdAt) >= 604800000);

  const renderGroup = (label, items) => {
    if (!items.length) return null;
    return (
      <div key={label} className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-3">
          <span>{label}</span>
          <div className="flex-1 h-px bg-white/5" />
        </h2>
        <div className="space-y-2">
          {items.map((notif) => {
            const sender = notif.sender;
            const isFollowType = notif.type === 'follow';
            const isFollowing = followingMap[sender?._id];

            return (
              <motion.div
                key={notif._id}
                whileHover={{ scale: 1.01, x: 2 }}
                onClick={() => handleNotifClick(notif)}
                className={`flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl cursor-pointer transition-all border ${
                  !notif.read
                    ? 'bg-primary-pink/10 border-primary-pink/25 shadow-sm shadow-primary-pink/10'
                    : 'glass-panel border-white/5 hover:border-white/10'
                }`}
              >
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary-pink shadow-neon-pink shrink-0" />
                )}

                <div className="relative shrink-0">
                  <img
                    src={
                      sender?.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`
                    }
                    alt={sender?.username}
                    className="w-11 h-11 rounded-full object-cover border border-white/10 bg-surface"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-bg-darker rounded-full flex items-center justify-center border border-white/10 shadow-md">
                    <NotifIcon type={notif.type} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-white leading-relaxed">
                    <span className="font-bold hover:text-primary-pink transition-colors">
                      {sender?.username}
                    </span>{' '}
                    <span className="text-zinc-300 font-medium">
                      {notifText(notif.type, '').replace(sender?.username, '').trim()}
                    </span>
                  </p>
                  <span className="text-[10px] text-zinc-500 font-semibold mt-0.5 block">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>

                {isFollowType ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowBack(sender?._id);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isFollowing
                        ? 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                        : 'bg-primary-pink text-white hover:bg-primary-pink-hover shadow-md shadow-primary-pink/25'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow Back'}
                  </motion.button>
                ) : notif.imageUrl || notif.refPost?.imageUrl || notif.refStory?.mediaUrl ? (
                  <img
                    src={notif.imageUrl || notif.refPost?.imageUrl || notif.refStory?.mediaUrl}
                    alt=""
                    className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-6 md:py-8 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight text-white flex items-center gap-2">
            <span>Notifi<span className="text-primary-pink text-glow">cations</span></span>
            <Sparkles className="w-4 h-4 text-primary-pink" />
          </h1>
          {unreadCount > 0 && (
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              <span className="text-primary-pink font-bold">{unreadCount}</span> new unread
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-primary-pink hover:text-primary-pink-hover transition-colors cursor-pointer"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-rose-400 cursor-pointer"
              title="Clear all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner
            size="lg"
            text="Loading notifications..."
            subtext="Checking for new activity"
          />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 my-12">
          <Bell size={48} className="text-zinc-600 mb-3 mx-auto" />
          <h3 className="text-base font-bold text-white mb-1">No notifications yet</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            When someone follows you or interacts with your posts, you will see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {renderGroup('Today', today)}
          {renderGroup('This Week', thisWeek)}
          {renderGroup('Earlier', earlier)}
        </div>
      )}
    </div>
  );
}
