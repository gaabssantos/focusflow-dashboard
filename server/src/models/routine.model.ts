import { Schema, model, Document } from 'mongoose';

export interface Routine extends Document {
  title: string;
  description?: string;
  weekDay: number;
  time?: string;
  category?: string;
  createdAt: Date;
  userId: string;
}

const RoutineSchema = new Schema<Routine>({
  title: { type: String, required: true },
  description: { type: String },
  weekDay: { type: Number, required: true },
  time: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

export const RoutineModel = model<Routine>('Routine', RoutineSchema);
