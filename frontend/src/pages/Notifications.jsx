import React from 'react';
import Avatar from '../components/ui/Avatar';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like', user: 'sarah_codes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', time: '2h', postImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop', text: 'liked your photo.' },
  { id: 2, type: 'follow', user: 'mike_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', time: '4h', isFollowing: false, text: 'started following you.' },
  { id: 3, type: 'comment', user: 'alex_design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', time: '5h', postImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop', text: 'commented: "This layout is absolutely fire! 🔥"' },
  { id: 4, type: 'like', user: 'ui_daily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UI', time: '1d', postImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop', text: 'liked your reel.' },
  { id: 5, type: 'follow', user: 'tech_guru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech', time: '1d', isFollowing: true, text: 'started following you.' },
  { id: 6, type: 'mention', user: 'jason_creativ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason', time: '2d', postImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=200&auto=format&fit=crop', text: 'mentioned you in a comment: "@user check this out!"' }
];

const Notifications = () => {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-8 md:px-8">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-3xl font-black italic tracking-tighter text-white">
          Notifi<span className="text-primary-pink">cations</span>
        </h1>
        <button className="text-xs font-bold uppercase tracking-widest text-primary-pink hover:text-white transition-colors">Mark all as read</button>
      </div>
      
      <div className="space-y-10">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-4">
            Earlier
            <div className="flex-1 h-px bg-white/5" />
          </h2>
          
          <div className="space-y-6">
            {MOCK_NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="flex items-center gap-4 group cursor-default p-2 rounded-3xl hover:bg-white/5 transition-all duration-300">
                {/* User Avatar with Ring */}
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary-pink to-purple-500 shadow-lg">
                   <Avatar src={notif.avatar} size="md" className="border-2 border-bg-dark" />
                </div>
                
                {/* Notification Text */}
                <div className="flex-1 text-sm leading-snug">
                  <span className="font-bold text-white hover:text-primary-pink cursor-pointer transition-colors mr-1.5">
                    {notif.user}
                  </span>
                  <span className="text-gray-400 font-medium italic">
                    {notif.text}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-600 block mt-1">
                    {notif.time} ago
                  </span>
                </div>

                {/* Right side action */}
                {notif.type === 'follow' ? (
                  <button 
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 ${
                      notif.isFollowing 
                        ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10' 
                        : 'bg-primary-pink text-white shadow-xl shadow-primary-pink/20 hover:scale-105'
                    }`}
                  >
                    {notif.isFollowing ? 'Following' : 'Follow Back'}
                  </button>
                ) : (
                  <div className="w-14 h-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/5 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <img 
                      src={notif.postImage} 
                      alt="Post thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
