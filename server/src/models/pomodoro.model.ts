import { Schema, model, Document } from 'mongoose';

export interface Pomodoro extends Document {
  userId: string;
  date: string;
  count: number;
}

const PomodoroSchema = new Schema<Pomodoro>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
});

PomodoroSchema.index({ userId: 1, date: 1 }, { unique: true });

export const PomodoroModel = model<Pomodoro>('Pomodoro', PomodoroSchema);
