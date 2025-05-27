import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useTheme } from "@/context/theme.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "@/services/api.service";

const LoginPage = () => {
  const { isDarkMode } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
    : "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 text-slate-900";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  type LoginResponse = {
    token?: string;
    email?: string;
    error?: boolean;
    message?: string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(formData) as LoginResponse;

      if (data && data.error) {
        toast.error(data.message);
      } else {
        localStorage.setItem("token", data.token ?? "");
        localStorage.setItem("email", data.email ?? "");

        toast.success("Autenticado com sucesso!");
        navigation("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || "Ocorreu um erro durante o login");
      } else {
        alert("Ocorreu um erro durante o login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${themeClasses} transition-all duration-500 flex items-center justify-center p-4`}
    >
      {/* Animated Background e Theme Toggle - sem alterações */}
      {/* ... */}
      {/* Login Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
          <p className={`${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Entre na sua conta para continuar
          </p>
        </div>

        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-8 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          } shadow-2xl hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700/50 border-slate-600 focus:border-purple-500"
                      : "bg-white/50 border-slate-300 focus:border-purple-500"
                  } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:scale-[1.02]`}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-11 py-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700/50 border-slate-600 focus:border-purple-500"
                      : "bg-white/50 border-slate-300 focus:border-purple-500"
                  } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:scale-[1.02]`}
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode
                      ? "text-slate-400 hover:text-slate-300"
                      : "text-slate-500 hover:text-slate-600"
                  } transition-colors`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-purple-500 text-purple-500 focus:ring-purple-500 focus:ring-2 transition-all duration-300"
                />
                <span className="text-sm">Lembrar de mim</span>
              </label>
              <button
                type="button"
                className="text-sm text-purple-500 hover:text-purple-400 transition-colors font-medium"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
