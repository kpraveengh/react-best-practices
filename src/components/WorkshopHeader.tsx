import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useViewMode } from "../context/ViewModeContext";

interface WorkshopHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

// Section background images and gradients
const sectionBackgrounds: Record<string, { image: string; gradient: string }> =
  {
    "modern-react": {
      image:
        "url('https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(16, 185, 129, 0.6))",
    },
    "typescript-best-practices": {
      image:
        "url('https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1469&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))",
    },
    "copilot-integration": {
      image:
        "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1734&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(245, 158, 11, 0.6), rgba(239, 68, 68, 0.6))",
    },
    "performance-optimization": {
      image:
        "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1415&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(20, 184, 166, 0.6), rgba(6, 95, 70, 0.6))",
    },
  };

const WorkshopHeader: React.FC<WorkshopHeaderProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const { theme } = useTheme();
  const muiTheme = useMuiTheme();
  const { isFullView } = useViewMode();

  const sections = [
    { id: "modern-react", label: "Modern React 18+", icon: "⚛️" },
    {
      id: "typescript-best-practices",
      label: "TypeScript Best Practices",
      icon: "🔷",
    },
    {
      id: "copilot-integration",
      label: "GitHub Copilot Integration",
      icon: "🤖",
    },
    {
      id: "performance-optimization",
      label: "Performance Optimization",
      icon: "⚡",
    },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveSection(newValue);
  };

  return (
    <Box
      sx={{
        backgroundImage: `${sectionBackgrounds[activeSection].gradient}, ${sectionBackgrounds[activeSection].image}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 4,
        borderRadius: 0,
        boxShadow: 3,
        mb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ pt: 6, pb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "white",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              mb: 2,
            }}
          >
            React TypeScript Best Practices Workshop
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              mb: 4,
            }}
          >
            A comprehensive 2-hour session on frontend best practices with React
            and TypeScript
          </Typography>

          <Paper
            elevation={3}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              mt: 4,
            }}
          >
            <Tabs
              value={activeSection}
              onChange={handleChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="workshop sections"
            >
              {sections.map((section) => (
                <Tab
                  key={section.id}
                  value={section.id}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </Box>
                  }
                  sx={{
                    py: 2,
                    fontWeight:
                      activeSection === section.id ? "bold" : "normal",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Tabs>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkshopHeader;
