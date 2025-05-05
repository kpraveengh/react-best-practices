import {
  Architecture,
  AutoAwesome,
  Code,
  GitHub,
  Home,
  LibraryBooks,
  NewReleases,
  Speed,
  Storage,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Sidebar navigation component with responsive design
 */
interface SideNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SideNav: React.FC<SideNavProps> = ({
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
}) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  // Define sections for navigation
  const sections: NavSection[] = [
    {
      id: "modern-react",
      label: "Modern React",
      icon: <Home />,
      description: "Explore the latest features in React 18 and beyond",
    },
    {
      id: "react19-features",
      label: "React 19 Features",
      icon: <NewReleases />,
      description: "In-depth exploration of the latest React 19 features",
    },
    {
      id: "typescript-best-practices",
      label: "TypeScript",
      icon: <Code />,
      description: "TypeScript patterns and best practices for React",
    },
    {
      id: "performance-optimization",
      label: "Performance",
      icon: <Speed />,
      description: "Techniques for optimizing React application performance",
    },
    {
      id: "custom-hooks",
      label: "Custom Hooks",
      icon: <AutoAwesome />,
      description: "Creating reusable and composable custom React hooks",
    },
    {
      id: "react-hook-form",
      label: "React Hook Form",
      icon: <LibraryBooks />,
      description: "Building performant forms with React Hook Form",
    },
    {
      id: "react-query",
      label: "TanStack Query",
      icon: <Storage />,
      description: "Data fetching and state management with React Query",
    },
    {
      id: "component-patterns",
      label: "Design Patterns",
      icon: <Architecture />,
      description: "Common React design patterns and implementation examples",
    },
    {
      id: "copilot-integration",
      label: "Copilot Integration",
      icon: <GitHub />,
      description: "Leveraging GitHub Copilot in React development",
    },
  ];

  // Calculate drawer width based on screen size
  const drawerWidth = isMobile ? 240 : 280;

  // For mobile: use temporary drawer
  // For desktop: use permanent drawer
  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          height: 64,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
          }}
        >
          React TS Best Practices
        </Typography>
      </Box>

      <Divider />

      <List sx={{ pt: 2 }}>
        {sections.map((section) => (
          <ListItem key={section.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeSection === section.id}
              onClick={() => {
                onSectionChange(section.id);
                if (isMobile) {
                  onToggle();
                }
              }}
              sx={{
                borderRadius: 1,
                mx: 1,
                position: "relative",
                "&.Mui-selected": {
                  bgcolor:
                    theme === "dark"
                      ? "rgba(144, 202, 249, 0.16)"
                      : "rgba(25, 118, 210, 0.08)",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: 4,
                    backgroundColor: muiTheme.palette.primary.main,
                    borderRadius: 2,
                  },
                },
                "&:hover": {
                  bgcolor:
                    theme === "dark"
                      ? "rgba(144, 202, 249, 0.08)"
                      : "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color:
                    activeSection === section.id
                      ? muiTheme.palette.primary.main
                      : "inherit",
                }}
              >
                {section.icon}
              </ListItemIcon>
              <ListItemText
                primary={section.label}
                secondary={isMobile ? undefined : section.description}
                primaryTypographyProps={{
                  fontWeight: activeSection === section.id ? "bold" : "normal",
                }}
                secondaryTypographyProps={{
                  fontSize: "0.75rem",
                  noWrap: true,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2, mt: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          sx={{ textAlign: "center" }}
        >
          © 2025 React TypeScript Best Practices
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={onToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${muiTheme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default SideNav;
