/**
 * Generates a random ID for new notes
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Formats a date to a readable string
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Basic content moderation to filter out offensive words
 * This is a simple implementation and would need to be replaced
 * with a more robust solution in production
 */
export const moderateContent = (content: string): boolean => {
  const offensiveWords = ['hate', 'kill', 'stupid', 'dumb', 'idiot'];
  return !offensiveWords.some(word => 
    content.toLowerCase().includes(word)
  );
};