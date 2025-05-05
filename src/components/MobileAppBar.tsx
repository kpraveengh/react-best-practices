import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React from "react";
import ThemeToggle from "./ThemeToggle";

/**
 * AppBar component for mobile view with menu toggle and theme switch
 */
interface MobileAppBarProps {
  title: string;
  onMenuToggle: () => void;
}

const MobileAppBar: React.FC<MobileAppBarProps> = ({ title, onMenuToggle }) => {
  const muiTheme = useMuiTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "block", md: "none" },
        bgcolor: muiTheme.palette.background.default,
        color: muiTheme.palette.text.primary,
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ ml: 1 }}>
          <ThemeToggle variant="icon-only" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MobileAppBar;
