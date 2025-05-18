import React from 'react';
import { Flag, MessageCircle, Download } from 'lucide-react';
import { Note } from '../types';
import { formatDate } from '../utils/helpers';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import html2canvas from 'html2canvas';

interface NoteCardProps {
  note: Note;
  onReport: (id: string) => void;
  onReply?: (id: string) => void;
  showReplies?: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Times-Roman'
  },
  text: {
    fontSize: 14,
    marginBottom: 10
  }
});

const NoteDocument = ({ note }: { note: Note }) => (
  <Document>
    <Page size="A6" style={styles.page}>
      <Text style={styles.text}>{note.content}</Text>
      <Text style={styles.text}>- HumanNote</Text>
    </Page>
  </Document>
);

const categoryStyles = {
  encouragement: 'from-blue-50 to-indigo-50 text-blue-800',
  support: 'from-emerald-50 to-teal-50 text-emerald-800',
  motivation: 'from-amber-50 to-yellow-50 text-amber-800',
  mindfulness: 'from-purple-50 to-fuchsia-50 text-purple-800',
  kindness: 'from-rose-50 to-pink-50 text-rose-800',
  hope: 'from-sky-50 to-cyan-50 text-sky-800',
  celebration: 'from-orange-50 to-amber-50 text-orange-800',
  grief: 'from-slate-50 to-gray-50 text-slate-800',
  anxiety: 'from-violet-50 to-purple-50 text-violet-800',
  heartbreak: 'from-red-50 to-rose-50 text-red-800',
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onReport, onReply, showReplies = false }) => {
  const categoryStyle = note.category && categoryStyles[note.category as keyof typeof categoryStyles];

  const handleDownloadImage = async () => {
    const element = document.getElementById(`note-${note.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = 'humannote.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div
      id={`note-${note.id}`}
      className={`rounded-lg shadow-md p-6 max-w-md w-full bg-gradient-to-br ${
        categoryStyle || 'from-white to-slate-50 text-slate-800'
      }`}
    >
      <p
        className="text-lg font-medium mb-4 leading-relaxed"
        style={{ fontFamily: "'Crimson Text', serif" }}
      >
        "{note.content}"
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{formatDate(note.createdAt)}</span>
        
        {note.category && (
          <span className="px-3 py-1 bg-white bg-opacity-50 rounded-full capitalize">
            {note.category}
          </span>
        )}
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleDownloadImage}
              className="text-slate-600 hover:text-slate-800 transition-colors"
              title="Download as image"
            >
              <Download className="h-4 w-4" />
            </button>
            <PDFDownloadLink
              document={<NoteDocument note={note} />}
              fileName="humannote.pdf"
              className="text-slate-600 hover:text-slate-800 transition-colors"
              title="Download as PDF"
            >
              {({ loading }) => (
                loading ? '...' : 'PDF'
              )}
            </PDFDownloadLink>
          </div>
          
          {onReply && (
            <button
              onClick={() => onReply(note.id)}
              className="text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-1"
              title="Reply with kindness"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">
                {note.replies?.length || 0}
              </span>
            </button>
          )}
          
          <button
            onClick={() => onReport(note.id)}
            className="text-rose-500 hover:text-rose-600 transition-colors"
            title="Report inappropriate content"
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showReplies && note.replies && note.replies.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {note.replies.length} {note.replies.length === 1 ? 'Reply' : 'Replies'}
          </h3>
          {note.replies.map(reply => (
            <div
              key={reply.id}
              className="ml-4 pl-4 border-l-2 border-slate-200"
            >
              <NoteCard
                note={reply}
                onReport={onReport}
                showReplies={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteCard;