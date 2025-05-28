import { Schema, model, Document } from 'mongoose';

export interface Pomodoro extends Document {
  userId: string;
  date: string;
  count: number;
  currentStreak: number;
  lastUpdated: Date; // adiciona essa linha
}

const PomodoroSchema = new Schema<Pomodoro>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() }, // adiciona aqui no schema
});

PomodoroSchema.index({ userId: 1, date: 1 }, { unique: true });

export const PomodoroModel = model<Pomodoro>('Pomodoro', PomodoroSchema);
