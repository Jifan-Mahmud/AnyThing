import React from 'react';
import Avatar from '../ui/Avatar';
import { Plus } from 'lucide-react';

const StoriesBar = ({ stories }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
      {/* Current User Add Story */}
      <div className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0">
        <div className="relative">
          <Avatar 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            size="lg" 
          />
          <div className="absolute bottom-0 right-0 bg-white text-black rounded-full p-0.5 border-2 border-bg-darker">
            <Plus size={16} strokeWidth={3} />
          </div>
        </div>
        <span className="text-xs text-gray-400">Your Story</span>
      </div>

      {/* Other Users' Stories */}
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0">
          <Avatar 
            src={story.avatar} 
            size="lg" 
            hasStory={!story.viewed} 
          />
          <span className="text-xs text-gray-400">{story.username}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesBar;
