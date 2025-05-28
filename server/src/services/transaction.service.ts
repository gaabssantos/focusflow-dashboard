import { ICreateTransactionDTO } from "../dtos/transaction.dto";
import { ITransactionRepository } from "../interfaces/transaction.interface";
import { ITransaction } from "../models/transaction.model";

export class TransactionService {
  constructor(private readonly repository: ITransactionRepository) {}

  async addTransaction(userId: string, data: ICreateTransactionDTO): Promise<ITransaction> {
    return await this.repository.create(userId, data);
  }
}
