import React from 'react';

const Avatar = ({ src, alt, size = 'md', hasStory = false, isOnline = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`rounded-full overflow-hidden ${sizeClasses[size]} ${
          hasStory ? 'ring-2 ring-primary-pink ring-offset-2 ring-offset-bg-darker p-[2px]' : ''
        }`}
      >
        <img 
          src={src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
          alt={alt || 'Avatar'} 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-darker rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;
