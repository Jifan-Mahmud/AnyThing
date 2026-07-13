import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SuggestedPeople = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState(new Set());

  const fetchSuggestions = async () => {
    try {
      // Fetch up to 50 suggestions
      const res = await fetch("/api/users/suggested?limit=50", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuggestions(data.data || []);
      }
    } catch (err) {
      console.error("Error loading suggestions:", err);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const handleFollowUser = async (userId) => {
    try {
      const isFollowing = followingIds.has(userId);
      const method = isFollowing ? "DELETE" : "POST";
      
      const res = await fetch(`/api/follow/${userId}`, {
        method,
        credentials: "include"
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message || (isFollowing ? "Unfollowed successfully" : "Followed successfully"));
        
        // Toggle follow state locally
        setFollowingIds(prev => {
          const next = new Set(prev);
          if (isFollowing) {
            next.delete(userId);
          } else {
            next.add(userId);
          }
          return next;
        });
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white flex justify-center">
      <div className="w-full max-w-2xl px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Suggested
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Discover people you may know</p>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-pink" size={36} />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-1 bg-surface border border-white/5 rounded-2xl p-4 md:p-6 shadow-xl">
            {suggestions.map((u) => {
              const isFollowing = followingIds.has(u._id);
              return (
                <div 
                  key={u._id} 
                  className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.01] px-2 rounded-xl transition-colors"
                >
                  {/* User details */}
                  <div 
                    onClick={() => navigate(`/app/profile`, { state: { user: u } })}
                    className="flex items-center gap-4 cursor-pointer group flex-1 min-w-0"
                  >
                    <img 
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                      alt={u.username} 
                      className="w-12 h-12 rounded-full object-cover bg-bg-darker border border-white/10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-primary-pink transition-colors truncate">
                        {u.username}
                      </h4>
                      <p className="text-xs text-gray-400 truncate max-w-[200px] md:max-w-[300px]">
                        {u.name || "Suggested for you"}
                      </p>
                    </div>
                  </div>

                  {/* Follow button */}
                  <button 
                    onClick={() => handleFollowUser(u._id)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isFollowing 
                        ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' 
                        : 'bg-primary-pink text-white hover:bg-primary-pink-hover shadow-lg shadow-primary-pink/25 hover:shadow-primary-pink/40 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface border border-white/5 rounded-2xl">
            <UserPlus size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">No suggestions available</h3>
            <p className="text-sm text-gray-600 mt-1">You are already following everyone!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedPeople;
