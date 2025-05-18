import React from 'react';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 text-center">
      <div className="flex items-center justify-center mb-1">
        <Heart className="h-6 w-6 text-rose-500 mr-2" />
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">HumanNote</h1>
      </div>
      <p className="text-slate-600 text-sm italic">Read a note. Write a note. Be human.</p>
    </header>
  );
};

export default Header;