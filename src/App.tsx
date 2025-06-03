import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import React, { useState } from "react";

import BackToTopButton from "./components/BackToTopButton";
import MobileAppBar from "./components/MobileAppBar";
import SideNav from "./components/SideNav";
import ComponentPatternsSection from "./components/examples/ComponentPatternsSection";
import CopilotIntegrationSection from "./components/examples/CopilotIntegrationSection";
import CustomHooksSection from "./components/examples/CustomHooksSection";
import ModernReactSection from "./components/examples/ModernReactSection";
import PerformanceOptimizationSection from "./components/examples/PerformanceOptimizationSection";
import React19FeaturesSection from "./components/examples/React19FeaturesSection";
import ReactHookFormSection from "./components/examples/ReactHookFormSection";
import ReactQuerySection from "./components/examples/ReactQuerySection";
import TypeScriptBestPracticesSection from "./components/examples/TypeScriptBestPracticesSection";
import Chatbot from "./components/examples/Chatbot";
import { ThemeProvider } from "./context/ThemeContext";
import { ViewModeProvider, useViewMode } from "./context/ViewModeContext";

const AppContent: React.FC = () => {
  const { activeSection, setActiveSection } = useViewMode();
  const muiTheme = useMuiTheme();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileDrawerOpen((prev) => !prev);
  };

  // Get section title for the current active section
  const getSectionTitle = (): string => {
    switch (activeSection) {
      case "modern-react":
        return "Modern React Features";
      case "react19-features":
        return "React 19 Features";
      case "typescript-best-practices":
        return "TypeScript Best Practices";
      case "component-patterns":
        return "React Design Patterns";
      case "copilot-integration":
        return "GitHub Copilot Integration";
      case "performance-optimization":
        return "Performance Optimization";
      case "custom-hooks":
        return "Custom React Hooks";
      case "react-hook-form":
        return "React Hook Form";
      case "react-query":
        return "TanStack Query";
      default:
        return "React TypeScript Best Practices";
    }
  };

  // Render the active section based on the current selection
  const renderActiveSection = (section: string) => {
    switch (section) {
      case "modern-react":
        return <ModernReactSection />;
      case "react19-features":
        return <React19FeaturesSection />;
      case "typescript-best-practices":
        return <TypeScriptBestPracticesSection />;
      case "component-patterns":
        return <ComponentPatternsSection />;
      case "copilot-integration":
        return <CopilotIntegrationSection />;
      case "performance-optimization":
        return <PerformanceOptimizationSection />;
      case "custom-hooks":
        return <CustomHooksSection />;
      case "react-hook-form":
        return <ReactHookFormSection />;
      case "react-query":
        return <ReactQuerySection />;
      default:
        return <ModernReactSection />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile AppBar */}
      <MobileAppBar
        title={getSectionTitle()}
        onMenuToggle={handleDrawerToggle}
      />

      {/* Sidebar Navigation */}
      <SideNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={mobileDrawerOpen}
        onToggle={handleDrawerToggle}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: "100%", md: `calc(100% - 280px)` },
          ml: { xs: 0, md: "280px" },
          pt: { xs: "64px", md: 2 },
        }}
      >
        {/* Content Area */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            minHeight: "calc(100vh - 150px)",
            borderRadius: 2,
            overflow: "auto",
            bgcolor: muiTheme.palette.background.paper,
          }}
        >
          {renderActiveSection(activeSection)}
        </Paper>

        {/* Footer */}
        <Box component="footer" sx={{ py: 2, textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 React TypeScript Best Practices Workshop
          </Typography>
        </Box>
      </Box>

      {/* Back to Top Button */}
      <BackToTopButton />
    </Box>
  );
};

const App = () => {
  return (
    <div>
      <h1>React Best Practices</h1>
      <Chatbot />
      <ThemeProvider>
        <ViewModeProvider initialSection="modern-react">
          <AppContent />
        </ViewModeProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
