import App from "@/App";
import ScrollToTop from "@/components/ui/scroll";
import LoginPage from "@/screens/login.screen";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./public.route";
import PrivateRoute from "./private.route";
import PomodoroView from "@/screens/pomodoro.screen";
import Error404Screen from "@/screens/error404.screen";

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<App />} />
          <Route path="/sessao" element={<PomodoroView />} />
        </Route>

        <Route path="*" element={<Error404Screen />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
