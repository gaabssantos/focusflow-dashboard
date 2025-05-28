export interface ICreateTransactionDTO {
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}
