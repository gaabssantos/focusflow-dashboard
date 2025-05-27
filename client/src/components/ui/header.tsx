import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Bell, User, Settings, UserCircle, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/theme.context.js";
import { useRoute } from "@/context/route.context.js";
import { logout } from "@/utils/auth.util";
import { useProfile } from "@/context/profile.context";

const Header = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { currentRoute, setCurrentRoute } = useRoute();
  const {profile} = useProfile();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleProfile = () => {
    setCurrentRoute("settings");
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    setCurrentRoute("settings");
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-20 lg:left-64 ${
        isDarkMode ? "bg-slate-800/90" : "bg-white/90"
      } backdrop-blur-xl border-b ${
        isDarkMode ? "border-slate-700" : "border-slate-200"
      } z-30 p-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize">{currentRoute}</h2>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-slate-100 hover:bg-slate-200"
            } transition-all duration-300 hover:scale-110`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            className={`p-3 rounded-xl ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-slate-100 hover:bg-slate-200"
            } transition-all duration-300 hover:scale-110 relative`}
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleUserMenuToggle}
              className={`flex items-center space-x-2 p-2 rounded-xl ${
                isDarkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-100 hover:bg-slate-200"
              } transition-all duration-300 hover:scale-105 ${
                isUserMenuOpen ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                ref={menuRef}
                className={`absolute right-0 mt-2 w-56 ${
                  isDarkMode ? "bg-slate-800" : "bg-white"
                } rounded-xl shadow-xl border ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                } py-2 z-50 animate-in slide-in-from-top-2 duration-200`}
              >
                {/* User Info */}
                <div className={`px-4 py-3 border-b ${
                  isDarkMode ? "border-slate-700" : "border-slate-200"
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{profile.user.name}</p>
                      <p className={`text-xs ${
                        isDarkMode ? "text-slate-400" : "text-slate-600"
                      }`}>
                        {localStorage.getItem("email")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfile}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${
                      isDarkMode 
                        ? "hover:bg-slate-700 text-slate-200" 
                        : "hover:bg-slate-100 text-slate-700"
                    } transition-colors duration-200`}
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>Meu Perfil</span>
                  </button>

                  <button
                    onClick={handleSettingsClick}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${
                      isDarkMode 
                        ? "hover:bg-slate-700 text-slate-200" 
                        : "hover:bg-slate-100 text-slate-700"
                    } transition-colors duration-200`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </button>

                  {/* Divider */}
                  <div className={`my-1 h-px ${
                    isDarkMode ? "bg-slate-700" : "bg-slate-200"
                  }`}></div>

                  <button
                    onClick={logout}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${
                      isDarkMode 
                        ? "hover:bg-red-900/20 text-red-400 hover:text-red-300" 
                        : "hover:bg-red-50 text-red-600 hover:text-red-700"
                    } transition-colors duration-200`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;