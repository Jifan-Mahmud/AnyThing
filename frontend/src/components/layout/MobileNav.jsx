import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, User, PlusSquare, Clapperboard } from 'lucide-react';

const MobileNav = ({ onOpenCreatePost }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Home', path: '/app', icon: Home },
    { name: 'Reels', path: '/app/reels', icon: Clapperboard },
    { name: 'Explore', path: '/app/explore', icon: Compass },
    { name: 'Profile', path: '/app/profile', icon: User },
  ];

  const checkIsActive = (itemPath, isActive) => {
    if (!isActive) return false;
    // If it's the profile path, only highlight if we're not viewing someone else's profile
    if (itemPath === '/app/profile') {
      return !location.state?.user;
    }
    return true;
  };

  return (
    <nav className="flex items-center justify-around h-full px-2 relative">
      {navItems.slice(0, 2).map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === '/app'}
          className={({ isActive }) =>
            `p-3 rounded-xl transition-all duration-300 ${
              checkIsActive(item.path, isActive)
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
          end={item.path === '/app'}
          className={({ isActive }) =>
            `p-3 rounded-xl transition-all duration-300 ${
              checkIsActive(item.path, isActive)
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
