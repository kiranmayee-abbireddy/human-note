import React from 'react';
import { getStreak, getBadges } from '../services/noteService';
import { Award, Flame } from 'lucide-react';

const UserStats: React.FC = () => {
  const streak = getStreak();
  const badges = getBadges();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-lg font-semibold">{streak} Day Streak</span>
        </div>
        <div className="flex gap-2">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full"
            >
              <Award className="h-4 w-4" />
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStats;