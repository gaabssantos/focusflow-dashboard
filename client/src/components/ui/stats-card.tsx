import { useTheme } from "../../context/theme.context";

type StatsCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
  trend?: number;
};

const StatsCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  gradient,
  trend,
}: StatsCardProps) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`${
        isDarkMode ? "bg-slate-800/50" : "bg-white/80"
      } backdrop-blur-xl rounded-2xl p-6 border ${
        isDarkMode ? "border-slate-700" : "border-slate-200"
      } hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:animate-pulse`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div
            className={`text-sm px-2 py-1 flex items-center justify-center ${
              trend > 0
                ? "bg-green-100 text-green-600 rounded-full"
                : trend < 0
                ? "bg-red-100 text-red-600 rounded-full"
                : "bg-gray-100 text-gray-600 rounded-full w-8 h-8"
            }`}
          >
            {trend === 0 ? (
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            ) : (
              <>
                {trend > 0 ? "+" : ""}
                {trend}%
              </>
            )}
          </div>
        )}
      </div>
      <h3
        className={`text-sm font-medium ${
          isDarkMode ? "text-slate-400" : "text-slate-600"
        } mb-1`}
      >
        {title}
      </h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p
        className={`text-sm ${
          isDarkMode ? "text-slate-500" : "text-slate-500"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default StatsCard;