/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

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
} from "lucide-react";
import { useTheme } from "@/context/theme.context";
import { addTransaction } from "@/services/api.service";
import { toast } from "react-toastify";

const FinancialView = () => {
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "income",
      description: "Salário",
      amount: 5500,
      date: "2024-05-20",
      category: "Salário",
    },
    {
      id: 2,
      type: "expense",
      description: "Aluguel",
      amount: 1200,
      date: "2024-05-18",
      category: "Moradia",
    },
    {
      id: 3,
      type: "expense",
      description: "Supermercado",
      amount: 350,
      date: "2024-05-17",
      category: "Alimentação",
    },
    {
      id: 4,
      type: "income",
      description: "Freelance",
      amount: 800,
      date: "2024-05-15",
      category: "Extra",
    },
    {
      id: 5,
      type: "expense",
      description: "Netflix",
      amount: 45,
      date: "2024-05-14",
      category: "Entretenimento",
    },
    {
      id: 6,
      type: "expense",
      description: "Gasolina",
      amount: 180,
      date: "2024-05-12",
      category: "Transporte",
    },
    {
      id: 7,
      type: "income",
      description: "Dividendos",
      amount: 120,
      date: "2024-05-10",
      category: "Investimentos",
    },
  ]);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hideValues] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "Alimentação",
    date: new Date().toISOString().split("T")[0],
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

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

  const formatCurrency = (value: number) => {
    if (hideValues) return "••••••";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
    balance > 0 ? Math.min((balance / (totalIncome || 1)) * 100, 100) : 0;

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
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-3xl p-12 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              } text-center relative overflow-hidden`}
            >
              {/* Progress Ring */}
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

                {/* Balance Display */}
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

              {/* Action Buttons */}
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

            {/* Income vs Expenses Cards */}
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
                      {formatCurrency(totalIncome)}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
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

            {/* Categories */}
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

            {/* Recent Transactions */}
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
                      key={transaction.id}
                      className={`p-3 rounded-xl ${
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
                                isDarkMode ? "text-slate-400" : "text-slate-600"
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
                    </div>
                  );
                })}
              </div>
            </div>
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
