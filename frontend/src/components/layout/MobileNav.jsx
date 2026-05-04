import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageSquare, User, PlusSquare, Clapperboard } from 'lucide-react';

const MobileNav = ({ onOpenCreatePost }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Reels', path: '/reels', icon: Clapperboard },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="flex items-center justify-around h-full px-2 relative">
      {navItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-primary-pink'
                : 'text-gray-400 hover:text-white'
            }`
          }
        >
          <item.icon size={24} strokeWidth={2.5} />
        </NavLink>
      ))}

      {/* Center Create Button */}
      <button 
        onClick={onOpenCreatePost}
        className="p-3 bg-primary-pink text-white rounded-full hover:bg-primary-pink-hover transition-transform hover:scale-110 shadow-lg shadow-primary-pink/20 -mt-6 border-4 border-bg-dark"
      >
        <PlusSquare size={24} strokeWidth={2.5} />
      </button>

      {navItems.slice(2).map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? 'text-primary-pink'
                : 'text-gray-400 hover:text-white'
            }`
          }
        >
          <item.icon size={24} strokeWidth={2.5} />
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
