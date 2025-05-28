import { model, Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
});

export const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
