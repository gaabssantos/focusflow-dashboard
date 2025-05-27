import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI não definida no .env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("🟢 MongoDB conectado com sucesso.");
  } catch (error) {
    console.error("🔴 Erro ao conectar com o MongoDB:", error);
    process.exit(1);
  }
}
