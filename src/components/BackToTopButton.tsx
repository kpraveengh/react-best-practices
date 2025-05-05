import { KeyboardArrowUp } from "@mui/icons-material";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { useTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";

interface BackToTopButtonProps {
  threshold?: number;
  position?: {
    bottom: number;
    right: number;
  };
  customColors?: {
    background?: string;
    hoverBackground?: string;
    icon?: string;
  };
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  threshold = 300,
  position = { bottom: 24, right: 24 },
  customColors,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const theme = useTheme();

  // Determine if the button should be visible based on scroll position
  const toggleVisibility = useCallback(() => {
    setIsVisible(window.pageYOffset > threshold);
  }, [threshold]);

  // Smooth scroll to top functionality
  const scrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Set up scroll event listener with proper cleanup
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  // Define button colors based on theme or custom colors
  const buttonColors = {
    background: customColors?.background || theme.palette.primary.main,
    hoverBackground:
      customColors?.hoverBackground || theme.palette.primary.dark,
    icon: customColors?.icon || "#ffffff",
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        color="primary"
        size="medium"
        onClick={scrollToTop}
        aria-label="Back to top"
        sx={{
          position: "fixed",
          bottom: position.bottom,
          right: position.right,
          zIndex: 1000,
          bgcolor: buttonColors.background,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            bgcolor: buttonColors.hoverBackground,
            transform: "translateY(-3px)",
            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <KeyboardArrowUp sx={{ color: buttonColors.icon }} />
      </Fab>
    </Zoom>
  );
};

export default React.memo(BackToTopButton);
