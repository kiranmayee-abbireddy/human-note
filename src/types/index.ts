export interface Note {
  id: string;
  content: string;
  createdAt: string;
  reported: boolean;
  category?: string;
  replies?: Note[];
}

export interface UserStats {
  streak: number;
  lastNoteDate: string;
  totalNotes: number;
  badges: string[];
}