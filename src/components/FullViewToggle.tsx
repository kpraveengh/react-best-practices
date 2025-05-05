import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useViewMode } from "../context/ViewModeContext";

const FullViewToggle: React.FC = () => {
  const { isFullView, toggleFullView } = useViewMode();
  const theme = useTheme();

  return (
    <Tooltip title={isFullView ? "Exit Full View" : "Enter Full View"}>
      <IconButton
        onClick={toggleFullView}
        color="inherit"
        aria-label={isFullView ? "Exit Full View" : "Enter Full View"}
        sx={{
          position: "fixed",
          top: 16,
          right: 70,
          zIndex: 1000,
          bgcolor: theme.palette.background.paper,
          boxShadow: 1,
          "&:hover": {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        {isFullView ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FullViewToggle;
