import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { Home, Compass, MessageSquare, Bell, User, PlusSquare, Clapperboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onOpenCreatePost }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Home', path: '/app', icon: Home },
    { name: 'Reels', path: '/app/reels', icon: Clapperboard },
    { name: 'Explore', path: '/app/explore', icon: Compass },
    { name: 'Messages', path: '/app/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
    { name: 'Profile', path: '/app/profile', icon: User },
  ];

  const checkIsActive = (itemPath, isActive) => {
    if (!isActive) return false;
    if (itemPath === '/app/profile') {
      return !location.state?.user;
    }
    return true;
  };

  return (
    <div className="flex flex-col h-full py-8 px-6">
      {/* Logo */}
      <div className="mb-12 px-4">
        <div className="text-3xl font-black tracking-tighter italic text-white">
          Any<span className="text-primary-pink drop-shadow-[0_0_10px_rgba(255,105,180,0.3)]">Thing</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/app'}
            onClick={(e) => {
              if (item.path === '/app/profile') {
                e.preventDefault();
                navigate('/app/profile', { state: { user: null } });
              }
            }}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                checkIsActive(item.path, isActive)
                  ? 'bg-surface-light text-primary-pink font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={24} strokeWidth={2} />
            <span className="text-lg">{item.name}</span>
          </NavLink>
        ))}

        {/* Create Post Button */}
        <button
          onClick={onOpenCreatePost}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5 mt-4"
        >
          <PlusSquare size={24} strokeWidth={2} />
          <span className="text-lg">Create</span>
        </button>
      </nav>

      {/* Current User Profile Snippet */}
      <div className="mt-auto space-y-3">
        {user ? (
          <>
            <div 
              onClick={() => navigate('/app/profile', { state: { user: null } })}
              className="flex items-center gap-3 p-3 rounded-2xl bg-surface/50 hover:bg-surface cursor-pointer transition-colors border border-white/5"
            >
              <Avatar 
                src={user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"} 
                alt={user.name || user.username} 
                size="md" 
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-semibold truncate text-white">{user.name || user.username}</h3>
                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LogOut size={24} strokeWidth={2} />
              <span className="text-lg">Logout</span>
            </button>
          </>
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">Not logged in</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
