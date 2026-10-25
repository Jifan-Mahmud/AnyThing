'use client';

import React, { useRef, useState } from 'react';
import Avatar from '../ui/Avatar';
import { Plus } from 'lucide-react';
import StoryViewerModal from './StoryViewerModal';
import StoryEditorModal from './StoryEditorModal';
import { motion } from 'motion/react';

const StoriesBar = ({ stories = [], currentUser, hasMyStory, myStory, onStoryUploaded }) => {
  const fileInputRef = useRef(null);
  const [activeStoryUser, setActiveStoryUser] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
    }
  };

  return (
    <>
      <div className="glass-panel rounded-3xl p-3 sm:p-4 mb-6 border border-white/5 shadow-xl sm:max-w-xl md:max-w-2xl mx-auto w-full">
        <div
          className="flex items-center gap-4 overflow-x-auto py-1 px-1 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Current User Story Add / View */}
          <div className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (hasMyStory && myStory) {
                    setActiveStoryUser(myStory);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="transition-transform"
              >
                <Avatar
                  src={
                    currentUser?.avatarUrl ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'
                  }
                  size="lg"
                  hasStory={hasMyStory}
                />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-0 right-0 bg-gradient-to-tr from-[#ff2e83] to-[#ffa07a] text-white rounded-full p-1 border-2 border-bg-darker shadow-md shadow-[#ff2e83]/30 cursor-pointer"
                aria-label="Add story"
              >
                <Plus size={14} strokeWidth={3} />
              </motion.button>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">Your Story</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleMediaSelect}
            />
          </div>

          {/* Friends Stories */}
          {stories.map((story) => (
            <motion.div
              key={story.id || story._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0"
              onClick={() => setActiveStoryUser(story)}
            >
              <Avatar src={story.avatar} size="lg" hasStory={!story.viewed} />
              <span className="text-[11px] font-semibold text-zinc-400 truncate w-16 text-center">
                {story.username}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <StoryViewerModal
        isOpen={!!activeStoryUser}
        onClose={() => setActiveStoryUser(null)}
        storyUser={activeStoryUser}
      />

      <StoryEditorModal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        mediaFile={selectedMedia}
        onStoryShared={() => {
          if (onStoryUploaded) onStoryUploaded();
        }}
      />
    </>
  );
};

export default StoriesBar;
