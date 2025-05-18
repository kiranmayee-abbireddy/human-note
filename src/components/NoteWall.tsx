import React, { useEffect, useState } from 'react';
import { getRecentNotes } from '../services/noteService';
import NoteCard from './NoteCard';
import type { Note } from '../types';

const NoteWall: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const updateNotes = () => {
      const recentNotes = getRecentNotes(10);
      setNotes(recentNotes);
    };

    updateNotes();
    const interval = setInterval(updateNotes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notes.map(note => (
        <NoteCard key={note.id} note={note} onReport={() => {}} />
      ))}
    </div>
  );
};

export default NoteWall;