import React from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from '../ui/Avatar';

// Note: Ensure lucide-react is installed or use the provided assets.
import { Home, Compass, MessageSquare, Bell, User, PlusSquare, Clapperboard } from 'lucide-react';

import LogoImage from '../../assets/Logo.png';

const Sidebar = ({ onOpenCreatePost }) => {
  const navItems = [
    { name: 'Home', path: '/app', icon: Home },
    { name: 'Reels', path: '/app/reels', icon: Clapperboard },
    { name: 'Explore', path: '/app/explore', icon: Compass },
    { name: 'Messages', path: '/app/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
    { name: 'Profile', path: '/app/profile', icon: User },
  ];

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
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive
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
      <div className="mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface/50 hover:bg-surface cursor-pointer transition-colors border border-white/5">
          <Avatar 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="Alex" 
            size="md" 
          />
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-semibold truncate text-white">Creator</h3>
            <p className="text-xs text-gray-500 truncate">@handle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
