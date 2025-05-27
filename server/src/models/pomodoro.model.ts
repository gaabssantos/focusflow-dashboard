import { Schema, model } from "mongoose";

export interface IPomodoro extends Document {
  sessionToday: number;
  totalTime: number;
  sequence: number;
  userId: string;
}

const PomodoroSchema = new Schema<IPomodoro>(
  {
    sessionToday: { type: Number, required: true },
    totalTime: { type: Number, required: false, default: 0 },
    sequence: { type: Number, required: false, default: 0 },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export const PomodoroModel = model<IPomodoro>("Pomodoro", PomodoroSchema);
