'use client';

import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  text = '',
  subtext = '',
  className = '',
}) {
  // Dimension mappings
  const dimensions = {
    sm: {
      outer: 'w-7 h-7',
      inner: 'w-4 h-4',
      core: 'w-1.5 h-1.5',
      glow: 'w-16 h-16',
      fontSize: 'text-xs',
      logoSize: 'text-xs',
    },
    md: {
      outer: 'w-12 h-12',
      inner: 'w-8 h-8',
      core: 'w-2.5 h-2.5',
      glow: 'w-28 h-28',
      fontSize: 'text-sm',
      logoSize: 'text-base',
    },
    lg: {
      outer: 'w-18 h-18',
      inner: 'w-12 h-12',
      core: 'w-3.5 h-3.5',
      glow: 'w-44 h-44',
      fontSize: 'text-base',
      logoSize: 'text-xl',
    },
    xl: {
      outer: 'w-24 h-24',
      inner: 'w-16 h-16',
      core: 'w-5 h-5',
      glow: 'w-60 h-60',
      fontSize: 'text-lg',
      logoSize: 'text-2xl',
    },
  }[size] || {
    outer: 'w-12 h-12',
    inner: 'w-8 h-8',
    core: 'w-2.5 h-2.5',
    glow: 'w-28 h-28',
    fontSize: 'text-sm',
    logoSize: 'text-base',
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Visual Ambient Glow & Spinner Body */}
      <div className="relative flex items-center justify-center">
        {/* Soft Pink Ambient Glow */}
        <div
          className={`absolute rounded-full bg-primary-pink/20 blur-2xl pointer-events-none animate-pulse ${dimensions.glow}`}
        />

        {/* Outer Gradient Spinner Ring */}
        <div
          className={`relative rounded-full p-[2.5px] bg-gradient-to-tr from-primary-pink via-[#ff1493] to-purple-500/20 animate-spin ${dimensions.outer}`}
          style={{ animationDuration: '1.2s' }}
        >
          {/* Inner cutout to form a glowing ring */}
          <div className="w-full h-full bg-bg-darker rounded-full" />
        </div>

        {/* Inner Counter-Rotating Accent Ring */}
        <div
          className={`absolute rounded-full border-2 border-transparent border-t-white/80 border-b-primary-pink/80 animate-spin ${dimensions.inner}`}
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />

        {/* Pulsating Center Core */}
        <div
          className={`absolute rounded-full bg-gradient-to-r from-primary-pink to-[#ff1493] shadow-[0_0_12px_rgba(255,105,180,0.9)] animate-ping ${dimensions.core}`}
          style={{ animationDuration: '1.8s' }}
        />
        <div
          className={`absolute rounded-full bg-primary-pink shadow-[0_0_8px_rgba(255,105,180,1)] ${dimensions.core}`}
        />
      </div>

      {/* Brand Text or Custom Message */}
      {(text || fullScreen) && (
        <div className="flex flex-col items-center text-center space-y-1 z-10">
          {fullScreen && (
            <div className={`font-black italic tracking-tighter text-white ${dimensions.logoSize} drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]`}>
              Any<span className="text-primary-pink">Thing</span>
            </div>
          )}

          {text && (
            <p className={`font-semibold tracking-wide text-gray-200 ${dimensions.fontSize}`}>
              {text}
            </p>
          )}

          {subtext && (
            <p className="text-xs text-gray-500 tracking-wider">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-darker/95 backdrop-blur-xl flex items-center justify-center transition-all duration-300">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}
