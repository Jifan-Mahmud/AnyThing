import React from 'react';

const Avatar = ({ src, alt, size = 'md', hasStory = false, isOnline = false, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {hasStory ? (
        <div className="rounded-full bg-gradient-to-tr from-[#ff2e83] via-[#ff6584] to-[#ffa07a] p-[2.5px] shadow-sm shadow-[#ff2e83]/25">
          <div className={`rounded-full overflow-hidden ${currentSize} ring-2 ring-bg-darker`}>
            <img
              src={src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
              alt={alt || 'Avatar'}
              className="w-full h-full object-cover rounded-full bg-surface"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div className={`rounded-full overflow-hidden ${currentSize} border border-white/10 bg-surface`}>
          <img
            src={src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </div>
      )}

      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-bg-darker rounded-full ring-1 ring-emerald-400/50" />
      )}
    </div>
  );
};

export default Avatar;
