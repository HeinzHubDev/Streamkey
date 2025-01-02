// Formatiert die Zeit in Minuten und Sekunden
export function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Kürzt einen Text auf eine bestimmte Länge
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generiert eine zufällige ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

