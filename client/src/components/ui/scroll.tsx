import { useRoute } from "@/context/route.context";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { currentRoute } = useRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, currentRoute]);

  return null;
}
