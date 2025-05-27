import app from "./app";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 3333;

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
  });
}

startServer();