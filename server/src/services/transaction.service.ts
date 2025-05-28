import { TransactionRecentDTO } from "../dtos/transaction-recent.dto";
import { ICreateTransactionDTO } from "../dtos/transaction.dto";
import { ITransactionRepository } from "../interfaces/transaction.interface";
import { ITransaction } from "../models/transaction.model";

export class TransactionService {
  constructor(private readonly repository: ITransactionRepository) {}

  async addTransaction(
    userId: string,
    data: ICreateTransactionDTO
  ): Promise<ITransaction> {
    return await this.repository.create(userId, data);
  }

  async getRecentTransactions(
    userId: string,
    period: "week" | "month" | "year"
  ): Promise<TransactionRecentDTO[]> {
    return await this.repository.getRecentTransactions(userId, period);
  }
}
