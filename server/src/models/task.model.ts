// src/modules/tasks/models/TaskModel.ts
import { Schema, model } from "mongoose";
import { Task } from "../entities/task";

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: "baixa" | "media" | "alta";
  status: "todo" | "progress" | "done";
  category:
    | "trabalho"
    | "estudos"
    | "pessoal"
    | "saude"
    | "casa"
    | "financeiro"
    | "outros";
  userId: string;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    priority: {
      type: String,
      enum: ["baixa", "media", "alta"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "trabalho",
        "estudos",
        "pessoal",
        "saude",
        "casa",
        "financeiro",
        "outros",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "progress", "done"],
      required: true,
    },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export const TaskModel = model<ITask>("Task", TaskSchema);
