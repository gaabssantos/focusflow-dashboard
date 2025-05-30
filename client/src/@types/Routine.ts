export interface Routine {
  _id: string;
  title: string;
  description?: string;
  dayOfWeek: number;
  time: string;
  category: string;
  userId: string;
}