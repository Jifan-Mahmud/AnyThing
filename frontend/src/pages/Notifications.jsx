import React from 'react';
import Avatar from '../components/ui/Avatar';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'like',
    user: 'sarah_codes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    time: '2h',
    postImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    text: 'liked your photo.'
  },
  {
    id: 2,
    type: 'follow',
    user: 'mike_dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    time: '4h',
    isFollowing: false,
    text: 'started following you.'
  },
  {
    id: 3,
    type: 'comment',
    user: 'alex_design',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    time: '5h',
    postImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    text: 'commented: "This layout is absolutely fire! 🔥"'
  },
  {
    id: 4,
    type: 'like',
    user: 'ui_daily',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UI',
    time: '1d',
    postImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop',
    text: 'liked your reel.'
  },
  {
    id: 5,
    type: 'follow',
    user: 'tech_guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    time: '1d',
    isFollowing: true,
    text: 'started following you.'
  },
  {
    id: 6,
    type: 'mention',
    user: 'jason_creativ',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    time: '2d',
    postImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=200&auto=format&fit=crop',
    text: 'mentioned you in a comment: "@user check this out!"'
  }
];

const Notifications = () => {
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 py-6 md:px-8">
      <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
      
      <div className="flex flex-col gap-4">
        {/* Sections can be mapped by date, e.g., "Today", "This Week", etc. For now we list all. */}
        <div className="mb-2">
          <h2 className="text-white font-semibold mb-4">Earlier</h2>
          
          <div className="flex flex-col gap-5">
            {MOCK_NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="flex items-center gap-3">
                {/* User Avatar */}
                <Avatar src={notif.avatar} size="md" className="cursor-pointer" />
                
                {/* Notification Text */}
                <div className="flex-1 text-sm">
                  <span className="font-bold text-white cursor-pointer hover:underline mr-1">
                    {notif.user}
                  </span>
                  <span className="text-gray-300">
                    {notif.text}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {notif.time}
                  </span>
                </div>

                {/* Right side action (Post thumbnail or Follow button) */}
                {notif.type === 'follow' ? (
                  <button 
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                      notif.isFollowing 
                        ? 'bg-surface-light text-white hover:bg-surface' 
                        : 'bg-primary-pink text-white hover:bg-primary-pink-hover'
                    }`}
                  >
                    {notif.isFollowing ? 'Following' : 'Follow'}
                  </button>
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-md">
                    <img 
                      src={notif.postImage} 
                      alt="Post thumbnail" 
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity" 
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
