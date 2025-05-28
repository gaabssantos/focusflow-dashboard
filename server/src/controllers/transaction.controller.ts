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
}
