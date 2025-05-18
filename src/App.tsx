import React, { useState, useEffect } from 'react';
import { PenLine, RefreshCw, X, Clock } from 'lucide-react';
import Header from './components/Header';
import NoteCard from './components/NoteCard';
import NoteWall from './components/NoteWall';
import UserStats from './components/UserStats';
import { Note } from './types';
import {
  getRandomNote,
  getNoteFromPast,
  addNote,
  addReply,
  reportNote,
  initializeWithSampleNotes
} from './services/noteService';
import { moderateContent } from './utils/helpers';

const categories = [
  'encouragement',
  'support',
  'motivation',
  'mindfulness',
  'kindness',
  'hope',
  'celebration',
  'grief',
  'anxiety',
  'heartbreak',
];

function App() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showWall, setShowWall] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showPastNote, setShowPastNote] = useState(false);

  useEffect(() => {
    initializeWithSampleNotes();
    fetchRandomNote();
  }, []);

  const fetchRandomNote = () => {
    const note = showPastNote ? getNoteFromPast() : getRandomNote();
    setCurrentNote(note);
    setShowPastNote(false);
  };

  const handleSubmitNote = () => {
    if (!newNoteContent.trim()) {
      setError('Please write something kind.');
      return;
    }

    if (newNoteContent.length > 280) {
      setError('Note is too long. Please keep it under 280 characters.');
      return;
    }

    if (!moderateContent(newNoteContent)) {
      setError('Please keep the content positive and appropriate.');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category for your note.');
      return;
    }

    if (isReplying && currentNote) {
      addReply(currentNote.id, newNoteContent, selectedCategory);
    } else {
      addNote(newNoteContent, selectedCategory);
    }

    setNewNoteContent('');
    setSelectedCategory('');
    setIsWriting(false);
    setIsReplying(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleReport = (id: string) => {
    reportNote(id);
    fetchRandomNote();
  };

  const handleReply = (id: string) => {
    setIsReplying(true);
    setIsWriting(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <UserStats />

        {success && (
          <div className="fixed top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
            <span>Thanks for spreading kindness! 💚</span>
            <button onClick={() => setSuccess(false)} className="text-green-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {!isWriting ? (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={fetchRandomNote}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Read a Note
              </button>
              <button
                onClick={() => setIsWriting(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <PenLine className="h-5 w-5" />
                Write a Note
              </button>
              <button
                onClick={() => {
                  setShowPastNote(true);
                  fetchRandomNote();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Clock className="h-5 w-5" />
                Note from the Past
              </button>
            </div>

            {currentNote && (
              <NoteCard
                note={currentNote}
                onReport={handleReport}
                onReply={handleReply}
                showReplies={true}
              />
            )}

            {!currentNote && (
              <p className="text-slate-600 italic">No notes available. Be the first to write one!</p>
            )}

            <button
              onClick={() => setShowWall(!showWall)}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              {showWall ? 'Hide Wall of Hope' : 'Show Wall of Hope'}
            </button>

            {showWall && <NoteWall />}
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-6">
              <textarea
                value={newNoteContent}
                onChange={(e) => {
                  setNewNoteContent(e.target.value);
                  setError(null);
                }}
                placeholder={isReplying
                  ? "Write a kind reply... (max 280 chars)"
                  : "Write something kind and uplifting... (max 280 chars)"}
                className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                maxLength={280}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Choose a category:
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                        selectedCategory === category
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              {error && (
                <p className="text-rose-500 text-sm mt-2">{error}</p>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setIsWriting(false);
                    setIsReplying(false);
                    setNewNoteContent('');
                    setSelectedCategory('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNote}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Share Anonymously
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;