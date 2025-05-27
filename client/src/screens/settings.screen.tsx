import { useProfile } from "@/context/profile.context";
import { useTheme } from "@/context/theme.context";
import { Bell, Moon, Sun, Target, User } from "lucide-react";
import { useState } from "react";

type Settings = {
  notifications: {
    taskReminders: boolean;
    dailyGoals: boolean;
    weeklyReports: boolean;
    soundEnabled: boolean;
  };
  appearance: {
    language: string;
    dateFormat: string;
    timeFormat: string;
    compactMode: boolean;
  };
  productivity: {
    focusTime: number;
    shortBreak: number;
    longBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  };
  profile: {
    name: string;
    email: string;
    timezone: string;
    dailyGoal: number;
  };
};

type Category = keyof Settings;

const SettingsView = () => {
  const { isDarkMode } = useTheme();
  const { profile } = useProfile();

  const [settings, setSettings] = useState<Settings>({
    notifications: {
      taskReminders: true,
      dailyGoals: true,
      weeklyReports: false,
      soundEnabled: true,
    },
    appearance: {
      language: "pt-BR",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      compactMode: false,
    },
    productivity: {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
    },
    profile: {
      name: profile.user.name ?? "",
      email: profile.user.email ?? "",
      timezone: "America/Sao_Paulo",
      dailyGoal: 8,
    },
  });

  const updateSetting = <C extends Category, K extends keyof Settings[C]>(
    category: C,
    key: K,
    value: Settings[C][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  type ToggleSwitchProps = {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
    label,
    description,
  }: ToggleSwitchProps) => (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-700/30 transition-colors">
      <div>
        <h4 className="font-medium">{label}</h4>
        {description && (
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled
            ? "bg-gradient-to-r from-purple-500 to-pink-500"
            : isDarkMode
            ? "bg-slate-600"
            : "bg-slate-300"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  type SelectFieldProps = {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    description?: string;
  };

  const SelectField = ({
    label,
    value,
    options,
    onChange,
    description,
  }: SelectFieldProps) => (
    <div className="p-4 rounded-xl hover:bg-slate-700/30 transition-colors">
      <label className="block font-medium mb-2">{label}</label>
      {description && (
        <p
          className={`text-sm mb-3 ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 rounded-lg border ${
          isDarkMode
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-white border-slate-300 text-slate-800"
        } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
      >
        {options.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  type NumberFieldProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    suffix?: string;
    description?: string;
  };

  const NumberField = ({
    label,
    value,
    onChange,
    min,
    max,
    suffix,
    description,
  }: NumberFieldProps) => (
    <div className="p-4 rounded-xl hover:bg-slate-700/30 transition-colors">
      <label className="block font-medium mb-2">{label}</label>
      {description && (
        <p
          className={`text-sm mb-3 ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
      <div className="flex items-center space-x-3">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`flex-1 p-3 rounded-lg border ${
            isDarkMode
              ? "bg-slate-700 border-slate-600 text-white"
              : "bg-white border-slate-300 text-slate-800"
          } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
        />
        {suffix && (
          <span
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  type InputFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    description?: string;
  };

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    description,
  }: InputFieldProps) => (
    <div className="p-4 rounded-xl hover:bg-slate-700/30 transition-colors">
      <label className="block font-medium mb-2">{label}</label>
      {description && (
        <p
          className={`text-sm mb-3 ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-3 rounded-lg border ${
          isDarkMode
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-white border-slate-300 text-slate-800"
        } focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-purple-500" />
            Perfil
          </h3>
          <div className="space-y-4">
            <InputField
              label="Nome"
              value={settings.profile.name}
              onChange={(value) => updateSetting("profile", "name", value)}
              description="Seu nome completo"
            />
            <InputField
              label="Email"
              value={settings.profile.email}
              type="email"
              onChange={(value) => updateSetting("profile", "email", value)}
              description="Endereço de email para notificações"
            />
            <SelectField
              label="Fuso Horário"
              value={settings.profile.timezone}
              options={[
                { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
                { value: "America/New_York", label: "Nova York (GMT-5)" },
                { value: "Europe/London", label: "Londres (GMT+0)" },
                { value: "Asia/Tokyo", label: "Tóquio (GMT+9)" },
              ]}
              onChange={(value: string) =>
                updateSetting("profile", "timezone", value)
              }
              description="Seu fuso horário local"
            />
            <NumberField
              label="Meta Diária"
              value={settings.profile.dailyGoal}
              min={1}
              max={24}
              suffix="horas"
              onChange={(value: number) =>
                updateSetting("profile", "dailyGoal", value)
              }
              description="Quantas horas de trabalho focado por dia"
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-blue-500" />
            Notificações
          </h3>
          <div className="space-y-2">
            <ToggleSwitch
              label="Lembretes de Tarefas"
              description="Receber notificações sobre tarefas pendentes"
              enabled={settings.notifications.taskReminders}
              onChange={(value: boolean) =>
                updateSetting("notifications", "taskReminders", value)
              }
            />
            <ToggleSwitch
              label="Metas Diárias"
              description="Notificações sobre progresso das metas diárias"
              enabled={settings.notifications.dailyGoals}
              onChange={(value: boolean) =>
                updateSetting("notifications", "dailyGoals", value)
              }
            />
            <ToggleSwitch
              label="Relatórios Semanais"
              description="Resumo semanal da sua produtividade"
              enabled={settings.notifications.weeklyReports}
              onChange={(value: boolean) =>
                updateSetting("notifications", "weeklyReports", value)
              }
            />
            <ToggleSwitch
              label="Sons Habilitados"
              description="Tocar sons para notificações e alertas"
              enabled={settings.notifications.soundEnabled}
              onChange={(value: boolean) =>
                updateSetting("notifications", "soundEnabled", value)
              }
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            {isDarkMode ? (
              <Moon className="w-6 h-6 mr-2 text-indigo-500" />
            ) : (
              <Sun className="w-6 h-6 mr-2 text-yellow-500" />
            )}
            Aparência
          </h3>
          <div className="space-y-4">
            <SelectField
              label="Idioma"
              value={settings.appearance.language}
              options={[
                { value: "pt-BR", label: "Português (Brasil)" },
                { value: "en-US", label: "English (US)" },
                { value: "es-ES", label: "Español" },
                { value: "fr-FR", label: "Français" },
              ]}
              onChange={(value: string) =>
                updateSetting("appearance", "language", value)
              }
              description="Idioma da interface"
            />
            <SelectField
              label="Formato de Data"
              value={settings.appearance.dateFormat}
              options={[
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
              ]}
              onChange={(value: string) =>
                updateSetting("appearance", "dateFormat", value)
              }
              description="Como as datas são exibidas"
            />
            <SelectField
              label="Formato de Hora"
              value={settings.appearance.timeFormat}
              options={[
                { value: "24h", label: "24 horas" },
                { value: "12h", label: "12 horas (AM/PM)" },
              ]}
              onChange={(value: string) =>
                updateSetting("appearance", "timeFormat", value)
              }
              description="Formato de exibição das horas"
            />
            <div className="pt-2">
              <ToggleSwitch
                label="Modo Compacto"
                description="Interface mais compacta com menos espaçamento"
                enabled={settings.appearance.compactMode}
                onChange={(value: boolean) =>
                  updateSetting("appearance", "compactMode", value)
                }
              />
            </div>
          </div>
        </div>

        {/* Productivity Settings */}
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-green-500" />
            Produtividade
          </h3>
          <div className="space-y-4">
            <NumberField
              label="Tempo de Foco"
              value={settings.productivity.focusTime}
              min={15}
              max={60}
              suffix="minutos"
              onChange={(value: number) =>
                updateSetting("productivity", "focusTime", value)
              }
              description="Duração das sessões de foco (Pomodoro)"
            />
            <NumberField
              label="Pausa Curta"
              value={settings.productivity.shortBreak}
              min={3}
              max={15}
              suffix="minutos"
              onChange={(value: number) =>
                updateSetting("productivity", "shortBreak", value)
              }
              description="Duração das pausas curtas"
            />
            <NumberField
              label="Pausa Longa"
              value={settings.productivity.longBreak}
              min={15}
              max={30}
              suffix="minutos"
              onChange={(value: number) =>
                updateSetting("productivity", "longBreak", value)
              }
              description="Duração das pausas longas"
            />
            <div className="space-y-2 pt-2">
              <ToggleSwitch
                label="Auto-iniciar Pausas"
                description="Iniciar pausas automaticamente após sessões de foco"
                enabled={settings.productivity.autoStartBreaks}
                onChange={(value: boolean) =>
                  updateSetting("productivity", "autoStartBreaks", value)
                }
              />
              <ToggleSwitch
                label="Auto-iniciar Pomodoros"
                description="Iniciar nova sessão automaticamente após pausas"
                enabled={settings.productivity.autoStartPomodoros}
                onChange={(value: boolean) =>
                  updateSetting("productivity", "autoStartPomodoros", value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
          Redefinir Configurações
        </button>
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
          Exportar Dados
        </button>
        <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
          Importar Dados
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
