import { TransactionRecentDTO } from "../dtos/transaction-recent.dto";
import { ICreateTransactionDTO } from "../dtos/transaction.dto";
import { ITransaction } from "../models/transaction.model";

export interface ITransactionRepository {
  create(userId: string, data: ICreateTransactionDTO): Promise<ITransaction>;
  delete(id: string): Promise<ITransaction>;
  getRecentTransactions(
    userId: string,
    period: "week" | "month" | "year"
  ): Promise<TransactionRecentDTO[]>;
}
