import { ITransactionRepository } from "../interfaces/transaction.interface";
import { ICreateTransactionDTO } from "../dtos/transaction.dto";
import { TransactionModel, ITransaction } from "../models/transaction.model";

export class TransactionRepository implements ITransactionRepository {
  async create(userId: string, data: ICreateTransactionDTO): Promise<ITransaction> {
    return await TransactionModel.create({
      userId,
      ...data,
    });
  }
}
