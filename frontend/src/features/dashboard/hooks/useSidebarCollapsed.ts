import { useState } from "react";
import { useMediaQuery } from "@mui/material";

// Icon rail or full sidebar – the last choice is remembered in this browser
const COLLAPSED_KEY = "probucket.sidebarCollapsed";

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
};

// Below 1024px the sidebar is a drawer, which is never collapsed
const useSidebarCollapsed = () => {
  const [preference, setPreference] = useState(readCollapsed);
  const isDesktop = useMediaQuery("(min-width:1024px)");

  const toggleCollapsed = () => {
    const next = !preference;
    setPreference(next);
    try {
      localStorage.setItem(COLLAPSED_KEY, String(next));
    } catch {
      // Not remembered, e.g. in a private window
    }
  };

  return [preference && isDesktop, toggleCollapsed] as const;
};

export default useSidebarCollapsed;
