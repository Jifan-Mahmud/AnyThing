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
      <div
        className="flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Current User Add Story */}
        <div className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0">
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
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 bg-primary-pink text-white rounded-full p-0.5 border-2 border-bg-darker transition-transform cursor-pointer shadow-md"
            >
              <Plus size={16} strokeWidth={3} />
            </motion.div>
          </div>
          <span className="text-xs text-gray-400">Your Story</span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleMediaSelect}
          />
        </div>

        {/* Other Users' Stories */}
        {stories.map((story) => (
          <motion.div
            key={story.id || story._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => setActiveStoryUser(story)}
          >
            <Avatar src={story.avatar} size="lg" hasStory={!story.viewed} />
            <span className="text-xs text-gray-400 truncate w-16 text-center">
              {story.username}
            </span>
          </motion.div>
        ))}
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
