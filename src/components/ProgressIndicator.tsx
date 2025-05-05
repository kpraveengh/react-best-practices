import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { useTheme } from "@mui/material/styles";
import React from "react";

interface ProgressIndicatorProps {
  sections: string[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  const theme = useTheme();
  const activeStep = sections.findIndex((section) => section === activeSection);

  const formatSectionName = (section: string): string => {
    return section
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 70,
        left: 0,
        width: "100%",
        padding: 2,
        zIndex: 900,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1,
      }}
    >
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {sections.map((section, index) => (
          <Step key={section} completed={false}>
            <StepButton
              color="inherit"
              onClick={() => onSectionChange(section)}
            >
              {formatSectionName(section)}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressIndicator;
