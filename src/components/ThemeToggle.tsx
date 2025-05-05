import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "icon-only";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  variant = "default",
}) => {
  const { theme, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  // Icon-only variant for use in app bars
  if (variant === "icon-only") {
    return (
      <Tooltip title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          className={className}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Tooltip>
    );
  }

  // Default floating button variant
  return (
    <Tooltip title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        className={className}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: muiTheme.palette.background.paper,
          boxShadow: 1,
          "&:hover": {
            bgcolor: muiTheme.palette.action.hover,
          },
        }}
      >
        {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
