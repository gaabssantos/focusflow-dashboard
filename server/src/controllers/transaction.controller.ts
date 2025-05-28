import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { TransactionRepository } from "../repositories/transaction.repository";

const service = new TransactionService(new TransactionRepository());

export interface IRequest extends Request {
  user?: any;
}

export class TransactionController {
  async create(req: IRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const data = req.body;

      const transaction = await service.addTransaction(userId, data);
      return res.status(201).json(transaction);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar transação." });
    }
  }

  async getRecentTransactions(req: IRequest, res: Response) {
    try {
      const userId = req.user.id;
      const period = (req.params.period as 'week' | 'month' | 'year') || 'month';

      const result = await service.getRecentTransactions(userId, period);
      return res.json(result);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar transações recentes." });
    }
  }
}
