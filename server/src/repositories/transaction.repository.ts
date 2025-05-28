import { ITransactionRepository } from "../interfaces/transaction.interface";
import { ICreateTransactionDTO } from "../dtos/transaction.dto";
import { TransactionModel, ITransaction } from "../models/transaction.model";
import { TransactionRecentDTO } from "../dtos/transaction-recent.dto";
import { startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

export class TransactionRepository implements ITransactionRepository {
  async create(
    userId: string,
    data: ICreateTransactionDTO
  ): Promise<ITransaction> {
    return await TransactionModel.create({
      userId,
      ...data,
    });
  }

  async getRecentTransactions(
    userId: string,
    period: "week" | "month" | "year"
  ): Promise<TransactionRecentDTO[]> {
    let startDate: Date;
    const now = new Date();

    switch (period) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(now);
        break;
      case "year":
        startDate = startOfYear(now);
        break;
      default:
        startDate = new Date(0);
    }

    // Formata para string YYYY-MM-DD
    const startDateStr = format(startDate, "yyyy-MM-dd");

    const transactions = await TransactionModel.find({
      userId,
      date: { $gte: startDateStr }, // comparando strings
    })
      .sort({ date: -1 })
      .limit(5);

    return transactions.map((t) => ({
      _id: (t._id as string | number | { toString(): string }).toString(),
      type: t.type,
      description: t.description,
      amount: t.amount,
      category: t.category,
      date: t.date,
    }));
  }
}
