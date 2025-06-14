/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PlusCircle,
  Target,
  Award,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Car,
  ShoppingCart,
  Gamepad2,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Filter,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/context/theme.context";
import { addTransaction, deleteTransaction, getRecentTransactions } from "@/services/api.service";
import { toast } from "react-toastify";
import { useFinancial } from "@/context/financical.context";
import formatCurrency from "@/utils/format-currency";

const FinancialView = () => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([
    {
      _id: "",
      type: "income",
      description: "",
      amount: 0,
      date: "",
      category: "",
    },
  ]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [newTransaction, setNewTransaction] = useState({
    id: 1,
    type: "expense",
    description: "",
    amount: "",
    category: "Alimentação",
    date: new Date().toISOString().split("T")[0],
  });
  const { earns, setEarns } = useFinancial();

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = earns - totalExpenses;

  const categoryIcons: { [key: string]: React.ComponentType<any> } = {
    Salário: DollarSign,
    Extra: TrendingUp,
    Investimentos: Target,
    Moradia: Home,
    Alimentação: ShoppingCart,
    Transporte: Car,
    Entretenimento: Gamepad2,
    Saúde: Heart,
    Educação: GraduationCap,
    Outros: MoreHorizontal,
  };

  const categories = Object.keys(categoryIcons);

  const periods = [
    { key: "week", label: "Semana" },
    { key: "month", label: "Mês" },
    { key: "year", label: "Ano" },
  ];

  const getExpensesByCategory = () => {
    const expensesByCategory: { [key: string]: number } = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expensesByCategory[t.category] =
          (expensesByCategory[t.category] || 0) + t.amount;
      });
    return Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  };

  const handleAddTransaction = async () => {
    if (
      newTransaction.description &&
      newTransaction.amount &&
      newTransaction.category
    ) {
      try {
        const transactionToSend = {
          type: newTransaction.type as "income" | "expense",
          description: newTransaction.description,
          amount: parseFloat(newTransaction.amount),
          category: newTransaction.category,
          date: newTransaction.date,
        };

        const savedTransaction = await addTransaction(transactionToSend);

        if (savedTransaction) {
          setTransactions([savedTransaction, ...transactions]);

          setNewTransaction({
            id: 1,
            type: "expense",
            description: "",
            amount: "",
            category: "Alimentação",
            date: new Date().toISOString().split("T")[0],
          });

          setShowAddTransaction(false);
          toast.success("Transação adicionada com sucesso!");
        } else {
          toast.error("Erro ao adicionar transação.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Erro ao adicionar transação. Tente novamente.");
      }
    } else {
      toast.warn("Preencha todos os campos obrigatórios.");
    }
  };

  const balanceProgress =
    balance > 0 ? Math.min((balance / (earns || 1)) * 100, 100) : 0;

const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const transactionExists = transactions.find((t) => t._id === transactionId);
      if (!transactionExists) {
        throw new Error("Transação não encontrada");
      }

      // Chama a API para excluir a transação
      await deleteTransaction(transactionId);

      // Remove apenas a transação com o ID correspondente
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => t._id !== transactionId)
      );

      // Recalcula o total de receitas (earns) após a exclusão, se necessário
      const income = transactions
        .filter((t) => t.type === "income" && t._id !== transactionId)
        .reduce((sum, t) => sum + t.amount, 0);
      setEarns(income);

      toast.success("Transação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação. Tente novamente.");
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const result = await getRecentTransactions(
          selectedPeriod as "week" | "month" | "year"
        );

        // Usa result diretamente
        const income = (result ?? []).filter((t) => t.type === "income");
        setEarns(income.reduce((sum, t) => sum + t.amount, 0));

        setTransactions(result ?? []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Erro ao carregar transações.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchTransactions();
  }, [selectedPeriod, setEarns]);

  return (
    <div>
      <main className="max-w-6xl mx-auto p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Period Selector */}
            <div className="flex justify-center space-x-4">
              {periods.map((period) => (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedPeriod === period.key
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                      : `${
                          isDarkMode
                            ? "bg-slate-800/50 hover:bg-slate-700/50"
                            : "bg-white/50 hover:bg-white/80"
                        } hover:scale-105`
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>{period.label}</span>
                </button>
              ))}
            </div>

            {/* Main Balance Display */}
            {loading ? (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-3xl p-12 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                } text-center relative overflow-hidden animate-pulse`}
              >
                <div className="w-80 h-80 mx-auto mb-8">
                  <div className="w-full h-full bg-gray-300 rounded-full dark:bg-gray-600"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-300 rounded-xl dark:bg-gray-600 w-3/4 mx-auto"></div>
                  <div className="h-6 bg-gray-300 rounded-xl dark:bg-gray-600 w-1/2 mx-auto"></div>
                  <div className="h-6 bg-gray-300 rounded-full dark:bg-gray-600 w-1/4 mx-auto"></div>
                </div>
                <div className="flex justify-center space-x-4 mt-8">
                  <div className="h-12 bg-gray-300 rounded-xl dark:bg-gray-600 w-1/3"></div>
                  <div className="h-12 bg-gray-300 rounded-xl dark:bg-gray-600 w-12"></div>
                  <div className="h-12 bg-gray-300 rounded-xl dark:bg-gray-600 w-12"></div>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-3xl p-12 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                } text-center relative overflow-hidden`}
              >
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#balanceGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 45 * (1 - balanceProgress / 100)
                      }`}
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient
                        id="balanceGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold mb-2 font-mono">
                      {formatCurrency(balance)}
                    </div>
                    <div
                      className={`text-lg font-medium ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Saldo Atual
                    </div>
                    <div
                      className={`text-sm mt-2 px-4 py-2 rounded-full ${
                        isDarkMode ? "bg-slate-700" : "bg-slate-100"
                      }`}
                    >
                      💰{" "}
                      {selectedPeriod === "month"
                        ? "Este mês"
                        : selectedPeriod === "week"
                        ? "Esta semana"
                        : "Este ano"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowAddTransaction(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-3"
                  >
                    <PlusCircle className="w-6 h-6" />
                    <span>Nova Transação</span>
                  </button>
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    } px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300`}
                  >
                    <PieChart className="w-6 h-6" />
                  </button>
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    } px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300`}
                  >
                    <Filter className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Income vs Expenses Cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className={`${
                      isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                    } backdrop-blur-xl rounded-2xl p-6 border ${
                      isDarkMode ? "border-slate-700" : "border-slate-200"
                    } animate-pulse`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-24"></div>
                        <div className="h-8 bg-gray-300 rounded dark:bg-gray-600 w-32"></div>
                      </div>
                      <div className="h-12 w-12 bg-gray-300 rounded-xl dark:bg-gray-600"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`${
                    isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                  } backdrop-blur-xl rounded-2xl p-6 border ${
                    isDarkMode ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Receitas
                      </p>
                      <p className="text-3xl font-bold text-green-500">
                        {formatCurrency(earns)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-100">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                  } backdrop-blur-xl rounded-2xl p-6 border ${
                    isDarkMode ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Despesas
                      </p>
                      <p className="text-3xl font-bold text-red-500">
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-100">
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            {loading ? (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-2xl p-6 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                } animate-pulse`}
              >
                <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-1/2 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="h-5 bg-gray-300 rounded dark:bg-gray-600 w-1/3"></div>
                      <div className="h-5 bg-gray-300 rounded dark:bg-gray-600 w-1/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-2xl p-6 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-purple-500" />
                  Resumo
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Transações
                    </span>
                    <span className="text-2xl font-bold text-purple-500">
                      {transactions.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Maior Gasto
                    </span>
                    <span className="text-xl font-semibold">
                      {formatCurrency(
                        Math.max(
                          ...transactions
                            .filter((t) => t.type === "expense")
                            .map((t) => t.amount)
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Meta Mensal
                    </span>
                    <span className="text-xl font-semibold">85%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            {loading ? (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-2xl p-6 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                } animate-pulse`}
              >
                <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 bg-gray-300 rounded dark:bg-gray-600"></div>
                          <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16"></div>
                      </div>
                      <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-2xl p-6 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-500" />
                  Gastos por Categoria
                </h3>
                <div className="space-y-3">
                  {getExpensesByCategory()
                    .slice(0, 5)
                    .map(([category, amount], index) => {
                      const Icon = categoryIcons[category] || MoreHorizontal;
                      const percentage = (amount / totalExpenses) * 100;
                      const colors = [
                        "bg-blue-500",
                        "bg-purple-500",
                        "bg-green-500",
                        "bg-yellow-500",
                        "bg-red-500",
                      ];

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {category}
                              </span>
                            </div>
                            <span className="text-sm text-slate-600">
                              {formatCurrency(amount)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                colors[index % colors.length]
                              } transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {loading ? (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-2xl p-6 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                } animate-pulse`}
              >
                <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl ${
                        isDarkMode ? "bg-slate-700/50" : "bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                          <div>
                            <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-24"></div>
                            <div className="h-3 bg-gray-300 rounded dark:bg-gray-600 w-16 mt-2"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-xl rounded-2xl p-6 border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                }`}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-green-500" />
                  Transações Recentes
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {transactions.slice(0, 4).map((transaction) => {
                    return (
                      <div
                        key={transaction._id}
                        className={`p-3 rounded-xl relative group ${
                          isDarkMode
                            ? "bg-slate-700/50 hover:bg-slate-600/50"
                            : "bg-slate-100 hover:bg-slate-200"
                        } transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.type === "income"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {transaction.description}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-600"
                                }`}
                              >
                                {transaction.category}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              transaction.type === "income"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        {/* Ícone de lixeira visível no hover */}
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction._id)
                          }
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full bg-red-500 hover:bg-red-600"
                          title="Excluir transação"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-5 pt-24">
            <div
              className={`${
                isDarkMode ? "bg-slate-800" : "bg-white"
              } rounded-2xl p-8 max-w-md w-full border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nova Transação</h2>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setNewTransaction({ ...newTransaction, type: "income" })
                    }
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      newTransaction.type === "income"
                        ? "bg-green-100 text-green-700"
                        : `${
                            isDarkMode
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`
                    }`}
                  >
                    Receita
                  </button>
                  <button
                    onClick={() =>
                      setNewTransaction({ ...newTransaction, type: "expense" })
                    }
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      newTransaction.type === "expense"
                        ? "bg-red-100 text-red-700"
                        : `${
                            isDarkMode
                              ? "bg-slate-700 text-slate-300"
                              : "bg-slate-100 text-slate-600"
                          }`
                    }`}
                  >
                    Despesa
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Descrição"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                  className={`w-full p-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />

                <input
                  type="text"
                  placeholder="Valor"
                  value={new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(newTransaction.amount || 0))}
                  onChange={(e) => {
                    const raw = e.target.value
                      .replace(/\D/g, "") // remove tudo que não for número
                      .replace(/^0+/, ""); // remove zeros à esquerda
                    const formatted = (Number(raw) / 100).toFixed(2); // transforma em decimal

                    setNewTransaction({
                      ...newTransaction,
                      amount: formatted,
                    });
                  }}
                  className={`w-full p-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />

                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value,
                    })
                  }
                  className={`w-full p-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value,
                    })
                  }
                  className={`w-full p-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />

                <button
                  onClick={handleAddTransaction}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  Adicionar Transação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
              className={`${
                isDarkMode ? "bg-slate-800" : "bg-white"
              } rounded-2xl p-8 max-w-md w-full border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Configurações</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Moeda
                  </label>
                  <select
                    className={`w-full p-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meta Mensal
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    className={`w-full p-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notificações</span>
                  <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all duration-300"></div>
                  </button>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FinancialView;
