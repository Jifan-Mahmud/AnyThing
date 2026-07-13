import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, UserPlus, ImageIcon, Film, BookImage, Phone, Video, Loader2, Bell, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

// Helper: format relative time
const timeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return `${Math.floor(diff / 604800)}w`;
};

// Icon per type
const NotifIcon = ({ type }) => {
  const base = "w-5 h-5";
  switch (type) {
    case 'like':        return <Heart className={`${base} text-red-400`} fill="currentColor" />;
    case 'follow':      return <UserPlus className={`${base} text-blue-400`} />;
    case 'comment':     return <ImageIcon className={`${base} text-yellow-400`} />;
    case 'post':        return <ImageIcon className={`${base} text-primary-pink`} />;
    case 'reel':        return <Film className={`${base} text-purple-400`} />;
    case 'story':       return <BookImage className={`${base} text-green-400`} />;
    case 'audio_call':  return <Phone className={`${base} text-emerald-400`} />;
    case 'video_call':  return <Video className={`${base} text-sky-400`} />;
    default:            return <Bell className={`${base} text-gray-400`} />;
  }
};

// Text per type
const notifText = (type, senderName) => {
  switch (type) {
    case 'follow':      return `${senderName} started following you.`;
    case 'like':        return `${senderName} liked your post.`;
    case 'comment':     return `${senderName} commented on your post.`;
    case 'post':        return `${senderName} shared a new post.`;
    case 'reel':        return `${senderName} shared a new reel.`;
    case 'story':       return `${senderName} added a new story.`;
    case 'audio_call':  return `${senderName} called you (Audio).`;
    case 'video_call':  return `${senderName} called you (Video).`;
    default:            return `${senderName} did something.`;
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=50", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  // Real-time notifications via socket
  useEffect(() => {
    if (!socket) return;
    const handler = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info(`🔔 ${notifText(notif.type, notif.sender?.username || 'Someone')}`, {
        autoClose: 3000,
        onClick: () => navigate('/app/notifications'),
      });
    };
    socket.on('newNotification', handler);
    return () => socket.off('newNotification', handler);
  }, [socket, navigate]);

  const handleMarkAllRead = async () => {
    await fetch("/api/notifications/read-all", { method: "PATCH", credentials: "include" });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClearAll = async () => {
    await fetch("/api/notifications", { method: "DELETE", credentials: "include" });
    setNotifications([]);
    setUnreadCount(0);
    toast.success("All notifications cleared");
  };

  const handleMarkRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, { method: "PATCH", credentials: "include" });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleFollowBack = async (senderId) => {
    const isFollowing = followingMap[senderId];
    const method = isFollowing ? "DELETE" : "POST";
    const res = await fetch(`/api/follow/${senderId}`, { method, credentials: "include" });
    if (res.ok) {
      setFollowingMap(prev => ({ ...prev, [senderId]: !isFollowing }));
    }
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) handleMarkRead(notif._id);
    const sender = notif.sender;
    if (notif.type === 'follow' && sender) {
      navigate('/app/profile', { state: { user: sender } });
    } else if (notif.refPost || notif.refStory) {
      navigate('/app');
    }
  };

  // Group by "Today" / "This Week" / "Earlier"
  const now = new Date();
  const today = notifications.filter(n => (now - new Date(n.createdAt)) < 86400000);
  const thisWeek = notifications.filter(n => {
    const diff = now - new Date(n.createdAt);
    return diff >= 86400000 && diff < 604800000;
  });
  const earlier = notifications.filter(n => (now - new Date(n.createdAt)) >= 604800000);

  const renderGroup = (label, items) => {
    if (!items.length) return null;
    return (
      <div key={label}>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-3">
          {label}
          <div className="flex-1 h-px bg-white/5" />
        </h2>
        <div className="space-y-1">
          {items.map(notif => {
            const sender = notif.sender;
            const isFollowType = notif.type === 'follow';
            const isFollowing = followingMap[sender?._id];

            return (
              <div
                key={notif._id}
                onClick={() => handleNotifClick(notif)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                  !notif.read ? 'bg-primary-pink/5 border border-primary-pink/10' : ''
                }`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary-pink shrink-0" />
                )}

                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={sender?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.username}`}
                    alt={sender?.username}
                    className="w-12 h-12 rounded-full object-cover border border-white/10 bg-surface"
                  />
                  {/* Type badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-bg-darker rounded-full flex items-center justify-center border border-white/10">
                    <NotifIcon type={notif.type} />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-snug">
                    <span className="font-bold hover:text-primary-pink transition-colors">{sender?.username}</span>
                    {' '}
                    <span className="text-gray-400 font-medium">
                      {notifText(notif.type, '').replace(sender?.username, '').trim()}
                    </span>
                  </p>
                  <span className="text-[11px] text-gray-600 font-semibold">{timeAgo(notif.createdAt)}</span>
                </div>

                {/* Right side */}
                {isFollowType ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFollowBack(sender?._id); }}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isFollowing
                        ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                        : 'bg-primary-pink text-white hover:bg-primary-pink-hover shadow-lg shadow-primary-pink/20'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow Back'}
                  </button>
                ) : (notif.imageUrl || notif.refPost?.imageUrl || notif.refStory?.mediaUrl) ? (
                  <img
                    src={notif.imageUrl || notif.refPost?.imageUrl || notif.refStory?.mediaUrl}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-8 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white">
            Notifi<span className="text-primary-pink">cations</span>
          </h1>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-primary-pink font-bold">{unreadCount}</span> unread
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold uppercase tracking-widest text-primary-pink hover:text-white transition-colors"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-red-400"
              title="Clear all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary-pink" size={36} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={52} className="text-gray-700 mb-4" />
          <h3 className="text-lg font-bold text-gray-500">No notifications yet</h3>
          <p className="text-sm text-gray-600 mt-1">When someone follows you or interacts with your posts, you'll see it here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {renderGroup("Today", today)}
          {renderGroup("This Week", thisWeek)}
          {renderGroup("Earlier", earlier)}
        </div>
      )}
    </div>
  );
};

export default Notifications;
