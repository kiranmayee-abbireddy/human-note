import { Note, UserStats } from '../types';
import { generateId } from '../utils/helpers';
import { format, subYears, isToday, parseISO } from 'date-fns';

const STORAGE_KEY = 'human_notes';
const STATS_KEY = 'human_notes_stats';

const getAllNotes = (): Note[] => {
  const notesJson = localStorage.getItem(STORAGE_KEY);
  if (!notesJson) return [];
  try {
    return JSON.parse(notesJson);
  } catch (error) {
    console.error('Error parsing notes:', error);
    return [];
  }
};

const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const getRandomNote = (): Note | null => {
  const notes = getAllNotes().filter(note => !note.reported);
  if (notes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

export const getNoteFromPast = (): Note | null => {
  const notes = getAllNotes().filter(note => !note.reported);
  const oneYearAgo = subYears(new Date(), 1);
  const pastNotes = notes.filter(note => {
    const noteDate = parseISO(note.createdAt);
    return format(noteDate, 'MM-dd') === format(oneYearAgo, 'MM-dd');
  });
  
  if (pastNotes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * pastNotes.length);
  return pastNotes[randomIndex];
};

export const addNote = (content: string, category?: string): Note => {
  const notes = getAllNotes();
  const newNote: Note = {
    id: generateId(),
    content,
    createdAt: new Date().toISOString(),
    reported: false,
    category,
    replies: []
  };
  
  notes.push(newNote);
  saveNotes(notes);
  updateStreak();
  return newNote;
};

export const addReply = (parentId: string, content: string, category?: string): Note | null => {
  const notes = getAllNotes();
  const parentNote = notes.find(note => note.id === parentId);
  
  if (!parentNote) return null;
  
  const reply: Note = {
    id: generateId(),
    content,
    createdAt: new Date().toISOString(),
    reported: false,
    category
  };
  
  if (!parentNote.replies) parentNote.replies = [];
  parentNote.replies.push(reply);
  saveNotes(notes);
  updateStreak();
  return reply;
};

export const reportNote = (id: string): void => {
  const notes = getAllNotes();
  const updatedNotes = notes.map(note => 
    note.id === id ? { ...note, reported: true } : note
  );
  saveNotes(updatedNotes);
};

export const getRecentNotes = (limit: number = 10): Note[] => {
  const notes = getAllNotes()
    .filter(note => !note.reported)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  return notes;
};

export const getNotesByCategory = (category: string): Note[] => {
  return getAllNotes()
    .filter(note => !note.reported && note.category === category);
};

const getUserStats = (): UserStats => {
  const statsJson = localStorage.getItem(STATS_KEY);
  if (!statsJson) {
    return {
      streak: 0,
      lastNoteDate: '',
      totalNotes: 0,
      badges: []
    };
  }
  return JSON.parse(statsJson);
};

const saveUserStats = (stats: UserStats): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

const updateStreak = (): void => {
  const stats = getUserStats();
  const today = new Date();
  
  if (!stats.lastNoteDate || !isToday(parseISO(stats.lastNoteDate))) {
    stats.streak = isToday(parseISO(stats.lastNoteDate)) ? stats.streak + 1 : 1;
    stats.lastNoteDate = today.toISOString();
    stats.totalNotes++;
    
    // Award badges based on milestones
    if (stats.streak === 7) stats.badges.push('Week Warrior');
    if (stats.streak === 30) stats.badges.push('Monthly Maven');
    if (stats.totalNotes === 10) stats.badges.push('Kindness Starter');
    if (stats.totalNotes === 50) stats.badges.push('Kindness Pro');
    
    saveUserStats(stats);
  }
};

export const getStreak = (): number => {
  const stats = getUserStats();
  return stats.streak;
};

export const getBadges = (): string[] => {
  const stats = getUserStats();
  return stats.badges;
};

export const initializeWithSampleNotes = (): void => {
  const existingNotes = getAllNotes();
  
  if (existingNotes.length === 0) {
    const sampleNotes: Note[] = [
      {
        id: generateId(),
        content: "You're doing better than you think. Keep going!",
        createdAt: new Date().toISOString(),
        reported: false,
        category: "encouragement"
      },
      {
        id: generateId(),
        content: "The world is better with you in it. Even when it doesn't feel like it.",
        createdAt: new Date().toISOString(),
        reported: false,
        category: "support"
      },
      {
        id: generateId(),
        content: "Your struggles today are developing the strength you need for tomorrow.",
        createdAt: new Date().toISOString(),
        reported: false,
        category: "motivation"
      },
      {
        id: generateId(),
        content: "Take a deep breath. This moment is yours.",
        createdAt: new Date().toISOString(),
        reported: false,
        category: "mindfulness"
      },
      {
        id: generateId(),
        content: "Someone out there is inspired by you, even if you don't realize it.",
        createdAt: new Date().toISOString(),
        reported: false,
        category: "kindness"
      }
    ];
    
    saveNotes(sampleNotes);
  }
};