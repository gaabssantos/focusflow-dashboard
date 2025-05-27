import React, { useState } from "react";
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Error404Component = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigation = useNavigate();

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Oops! Página não encontrada
            </h2>
          </div>
          <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            A página que você está procurando não existe ou foi movida para
            outro local. Não se preocupe, vamos ajudá-lo a encontrar o que
            precisa!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
            onClick={() => navigation("/")}
          >
            <Home className="w-5 h-5" />
            <span>Voltar ao Dashboard</span>
          </button>

          <button
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Página Anterior</span>
          </button>

          <button
            onClick={handleRefresh}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
          >
            <RefreshCw
              className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`}
            />
            <span>Recarregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404Component;
