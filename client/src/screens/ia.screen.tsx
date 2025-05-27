import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  MessageCircle,
  Activity,
  Lightbulb,
  TrendingUp,
  Brain,
  Zap,
  Star,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useTheme } from "@/context/theme.context";
import { Task } from "@/@types/Task";

type Stats = {
  tasksCompleted: number;
  streak: number;
  focusTime: number;
  totalEarnings: number;
};

interface AIViewProps {
  tasks: Task[];
  stats: Stats;
}

const AIView: React.FC<AIViewProps> = ({ tasks, stats }) => {
  const { isDarkMode } = useTheme();

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Olá! Sou FocusFlow AI, seu assistente pessoal de produtividade. Analisei seus dados e estou pronto para ajudar! Como posso auxiliá-lo hoje?",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [aiMode, setAiMode] = useState("chat");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulação de respostas inteligentes da IA
  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    const responses = {
      produtividade: [
        `Com base na sua atividade, você completou ${stats.tasksCompleted} tarefas este mês! Sua produtividade está 15% acima da média! 🚀`,
        `Identifiquei que você trabalha melhor pela manhã. Suas tarefas de alta prioridade têm 73% mais chance de serem concluídas entre 9h-11h.`,
        `Sua sequência de ${stats.streak} dias é impressionante! Estudos mostram que você está no caminho certo para formar um hábito sólido.`,
      ],
      tarefas: [
        `Você tem ${
          tasks.filter((t) => !t.completed).length
        } tarefas pendentes. Sugiro começar pela "${
          tasks.find((t) => !t.completed && t.priority === "alta")?.title
        }" por ser de alta prioridade.`,
        `Analisei seus padrões: você completa 85% mais tarefas quando as divide em subtarefas menores. Quer que eu ajude a organizar algo?`,
        `Detectei que tarefas da categoria "Trabalho" ficam pendentes por mais tempo. Que tal criar um horário específico para elas?`,
      ],
      tempo: [
        `Você focou por ${stats.focusTime}h hoje! Para otimizar, sugiro usar a técnica Pomodoro: 25min de foco + 5min de pausa.`,
        `Baseado no seu histórico, você é mais produtivo às terças e quartas. Vamos agendar suas tarefas mais importantes nesses dias?`,
        `Identifiquei que você perde cerca de 23 minutos por dia em distrações. Quer dicas para melhorar o foco?`,
      ],
      motivacao: [
        `Você já ganhou R$ ${stats.totalEarnings} este mês! Está no caminho certo para superar sua meta anterior! ⭐`,
        `Cada pequena vitória conta! Suas 3 tarefas concluídas hoje já fazem diferença no resultado final.`,
        `Lembre-se: você já superou desafios maiores. Esta sequência de ${stats.streak} dias prova sua determinação!`,
      ],
      insights: [
        `💡 Insight: Você é 40% mais eficiente em tarefas criativas após exercícios físicos. Que tal programar um treino antes das atividades importantes?`,
        `📊 Análise: Suas tarefas de "Saúde" têm 92% de conclusão! Que tal aplicar essa mesma estratégia em outras categorias?`,
        `🎯 Descoberta: Você trabalha melhor em blocos de 45 minutos. Vamos reestruturar sua agenda baseada nisso?`,
      ],
    };

    if (
      lowerMessage.includes("produtiv") ||
      lowerMessage.includes("desempenho")
    ) {
      return responses.produtividade[
        Math.floor(Math.random() * responses.produtividade.length)
      ];
    } else if (
      lowerMessage.includes("tarefa") ||
      lowerMessage.includes("todo") ||
      lowerMessage.includes("fazer")
    ) {
      return responses.tarefas[
        Math.floor(Math.random() * responses.tarefas.length)
      ];
    } else if (
      lowerMessage.includes("tempo") ||
      lowerMessage.includes("foco") ||
      lowerMessage.includes("concentr")
    ) {
      return responses.tempo[
        Math.floor(Math.random() * responses.tempo.length)
      ];
    } else if (
      lowerMessage.includes("motiv") ||
      lowerMessage.includes("ânimo") ||
      lowerMessage.includes("desanimo")
    ) {
      return responses.motivacao[
        Math.floor(Math.random() * responses.motivacao.length)
      ];
    } else if (
      lowerMessage.includes("dica") ||
      lowerMessage.includes("sugest") ||
      lowerMessage.includes("ajuda") ||
      lowerMessage.includes("insight")
    ) {
      return responses.insights[
        Math.floor(Math.random() * responses.insights.length)
      ];
    } else {
      const allResponses = [
        ...responses.produtividade,
        ...responses.tarefas,
        ...responses.tempo,
        ...responses.motivacao,
        ...responses.insights,
      ];
      return allResponses[Math.floor(Math.random() * allResponses.length)];
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simula delay de processamento da IA
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: getAIResponse(newMessage.content),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simula reconhecimento de voz
      setTimeout(() => {
        const voiceQuestions = [
          "Como está minha produtividade esta semana?",
          "Quais tarefas devo priorizar hoje?",
          "Me dê dicas para melhorar meu foco",
          "Qual meu melhor horário para trabalhar?",
        ];
        setChatInput(
          voiceQuestions[Math.floor(Math.random() * voiceQuestions.length)]
        );
        setIsListening(false);
      }, 2000);
    }
  };

  const quickActions = [
    { text: "Como está minha produtividade?", icon: TrendingUp },
    { text: "Organize minhas tarefas", icon: Target },
    { text: "Dicas de foco", icon: Brain },
    { text: "Análise de tempo", icon: Clock },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50"
            : "bg-gradient-to-r from-purple-100 to-blue-100"
        } backdrop-blur-xl rounded-2xl p-8 border ${
          isDarkMode ? "border-purple-800" : "border-purple-200"
        }`}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <Bot className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <span>FocusFlow AI</span>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Assistente inteligente de produtividade
            </p>
          </div>
        </div>

        {/* AI Mode Tabs */}
        <div className="flex space-x-2">
          {[
            { id: "chat", label: "Chat Inteligente", icon: MessageCircle },
            { id: "analysis", label: "Análise IA", icon: Activity },
            { id: "suggestions", label: "Sugestões Pro", icon: Lightbulb },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setAiMode(mode.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                aiMode === mode.id
                  ? "bg-white/20 text-white shadow-lg"
                  : `${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"}`
              }`}
            >
              <mode.icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main AI Interface */}
        <div
          className={`lg:col-span-3 ${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          } flex flex-col h-[600px]`}
        >
          {aiMode === "chat" && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      } items-end space-x-2`}
                    >
                      {message.type === "ai" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-2">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md"
                            : `${
                                isDarkMode ? "bg-slate-700" : "bg-slate-100"
                              } rounded-bl-md`
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 opacity-60`}>
                          {message.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start items-end space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-2">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div
                        className={`p-4 rounded-2xl rounded-bl-md ${
                          isDarkMode ? "bg-slate-700" : "bg-slate-100"
                        }`}
                      >
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setChatInput(action.text)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                        isDarkMode
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-slate-100 hover:bg-slate-200"
                      } transition-all hover:scale-105`}
                    >
                      <action.icon className="w-4 h-4" />
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div
                className={`p-6 border-t ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                }`}
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Pergunte qualquer coisa sobre produtividade..."
                    className={`flex-1 p-3 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-700 text-white placeholder-slate-400"
                        : "bg-slate-100 text-slate-900 placeholder-slate-500"
                    } border-none outline-none`}
                  />
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : `${
                            isDarkMode
                              ? "bg-slate-700 hover:bg-slate-600"
                              : "bg-slate-100 hover:bg-slate-200"
                          }`
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!chatInput.trim()}
                    className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {aiMode === "analysis" && (
            <div className="p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                <span>Análise Inteligente de Produtividade</span>
              </h3>

              <div className="space-y-6">
                {/* Performance Score */}
                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-800"
                      : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Score de Produtividade</span>
                    </h4>
                    <div className="text-3xl font-bold text-green-500">
                      8.7/10
                    </div>
                  </div>
                  <p
                    className={`${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Excelente desempenho! Você está no top 15% dos usuários mais
                    produtivos.
                  </p>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold">Tendência Crescente</h4>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      Produtividade aumentou 23% nas últimas 2 semanas
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold">Pico de Performance</h4>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      Melhor horário: 9h-11h (85% das tarefas concluídas)
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Target className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold">Área de Força</h4>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      Categoria "Saúde": 92% de conclusão
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <h4 className="font-semibold">Ponto de Atenção</h4>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      Tarefas de trabalho: média de 2.3 dias para conclusão
                    </p>
                  </div>
                </div>

                {/* Prediction */}
                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode
                      ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-800"
                      : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>Previsão IA</span>
                  </h4>
                  <p
                    className={`${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Com base no seu padrão atual, você tem 87% de chance de
                    atingir sua meta mensal de 50 tarefas concluídas. Continue
                    focado nas manhãs!
                  </p>
                </div>
              </div>
            </div>
          )}

          {aiMode === "suggestions" && (
            <div className="p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <span>Sugestões Personalizadas</span>
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Otimize seu horário nobre",
                    description:
                      "Agende tarefas complexas entre 9h-11h. Você é 3x mais eficiente neste período.",
                    impact: "Alto impacto",
                    color: "green",
                  },
                  {
                    title: "Técnica Pomodoro personalizada",
                    description:
                      "Seus dados mostram que você rende melhor em blocos de 35min + 10min pausa.",
                    impact: "Médio impacto",
                    color: "blue",
                  },
                  {
                    title: "Agrupe tarefas similares",
                    description:
                      "Fazer todas as tarefas de 'Trabalho' em sequência pode aumentar sua eficiência em 40%.",
                    impact: "Alto impacto",
                    color: "green",
                  },
                  {
                    title: "Ritual de preparação",
                    description:
                      "Criar uma rotina de 5min antes de iniciar pode melhorar seu foco em 65%.",
                    impact: "Médio impacto",
                    color: "blue",
                  },
                  {
                    title: "Recompensas inteligentes",
                    description:
                      "Defina micro-recompensas após cada 3 tarefas concluídas para manter a motivação.",
                    impact: "Baixo impacto",
                    color: "yellow",
                  },
                ].map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      isDarkMode
                        ? "bg-slate-700/50 hover:bg-slate-700"
                        : "bg-slate-50 hover:bg-slate-100"
                    } transition-all hover:scale-[1.02] cursor-pointer border-l-4 ${
                      suggestion.color === "green"
                        ? "border-green-500"
                        : suggestion.color === "blue"
                        ? "border-blue-500"
                        : "border-yellow-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{suggestion.title}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          suggestion.color === "green"
                            ? "bg-green-100 text-green-600"
                            : suggestion.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {suggestion.impact}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      } mb-3`}
                    >
                      {suggestion.description}
                    </p>
                    <button className="text-purple-500 text-sm font-medium hover:text-purple-400 transition-colors">
                      Aplicar sugestão →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Stats Sidebar */}
        <div className="space-y-4">
          <div
            className={`${
              isDarkMode ? "bg-slate-800/50" : "bg-white/80"
            } backdrop-blur-xl rounded-2xl p-4 border ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>IA Stats</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Precisão das previsões</span>
                <span className="text-sm font-semibold text-green-500">
                  94%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sugestões aplicadas</span>
                <span className="text-sm font-semibold">12/15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tempo economizado</span>
                <span className="text-sm font-semibold text-blue-500">
                  2.3h
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-slate-800/50" : "bg-white/80"
            } backdrop-blur-xl rounded-2xl p-4 border ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <h4 className="font-semibold mb-4">Status da IA</h4>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Online</span>
            </div>
            <div className="text-xs text-slate-500">
              Última atualização: agora mesmo
            </div>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-slate-800/50" : "bg-white/80"
            } backdrop-blur-xl rounded-2xl p-4 border ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <h4 className="font-semibold mb-4">Próximas Features</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Análise de humor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span>Previsão de burnout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span>Coach pessoal IA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIView;
