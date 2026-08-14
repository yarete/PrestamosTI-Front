// Utility functions for calendar and date manipulation

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const getMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Convert Sunday(0) to 6, Monday(1) to 0
  
  const daysInMonth = getDaysInMonth(year, month);
  const matrix: (Date | null)[] = Array(startOffset).fill(null);
  
  daysInMonth.forEach(day => matrix.push(day));
  
  // Fill the rest of the week with nulls to complete the row
  const remaining = matrix.length % 7;
  if (remaining !== 0) {
    for (let i = 0; i < 7 - remaining; i++) {
      matrix.push(null);
    }
  }
  
  return matrix;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isSameDay = (d1: Date | null, d2: Date | null) => {
  if (!d1 || !d2) return false;
  return d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();
};

export const isDateInRange = (date: Date, start: Date | null, end: Date | null) => {
  if (!start || !end) return false;
  const t = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return (t > s && t < e) || (t < s && t > e);
};
