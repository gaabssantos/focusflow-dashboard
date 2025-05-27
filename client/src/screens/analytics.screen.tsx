import { useTheme } from "@/context/theme.context";

const AnalyticsView = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Produtividade Semanal</h3>
          <div className="h-64 flex items-end space-x-2">
            {[65, 78, 82, 45, 88, 92, 75].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Categorias</h3>
          <div className="space-y-4">
            {[
              {
                name: "Trabalho",
                value: 45,
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Pessoal",
                value: 30,
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Saúde",
                value: 25,
                color: "from-purple-500 to-pink-500",
              },
            ].map((category) => (
              <div key={category.name}>
                <div className="flex justify-between mb-2">
                  <span>{category.name}</span>
                  <span>{category.value}%</span>
                </div>
                <div
                  className={`h-2 ${
                    isDarkMode ? "bg-slate-700" : "bg-slate-200"
                  } rounded-full overflow-hidden`}
                >
                  <div
                    className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500`}
                    style={{ width: `${category.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
