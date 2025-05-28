import { ICreateTransactionDTO } from "../dtos/transaction.dto";
import { ITransaction } from "../models/transaction.model";

export interface ITransactionRepository {
  create(userId: string, data: ICreateTransactionDTO): Promise<ITransaction>;
}
