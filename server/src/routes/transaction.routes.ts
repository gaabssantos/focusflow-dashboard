import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { ensureAuth } from "../middlewares/ensureAuth";

const transactionRoutes = Router();
const controller = new TransactionController();

transactionRoutes.post("/transaction", ensureAuth, (req, res) => {
  controller.create(req, res);
});

transactionRoutes.get("/transaction/recents/:period", ensureAuth, async (req, res) => {
  await controller.getRecentTransactions(req, res);
});

export default transactionRoutes;
