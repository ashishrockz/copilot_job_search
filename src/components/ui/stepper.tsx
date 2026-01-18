import * as React from "react";
import { Box, Typography } from "@mui/material";
import { Check } from "@phosphor-icons/react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps): React.JSX.Element {
  return (
    <Box
      sx={{
        width: "100%",
        mb: { xs: 4, sm: 5, md: 6 },
      }}
    >
      {/* Mobile Stepper */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: 500,
          }}
        >
          Step {currentStep} of {steps.length}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.125rem",
            color: "#111827",
            fontWeight: 600,
            mt: 0.5,
          }}
        >
          {steps[currentStep - 1]?.label}
        </Typography>
      </Box>

      {/* Desktop Stepper */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Item */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  flex: 1,
                  zIndex: 1,
                }}
              >
                {/* Step Circle */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isCompleted ? "#7c3aed" : isCurrent ? "#7c3aed" : "#e5e7eb",
                    color: isCompleted ? "white" : isCurrent ? "white" : "#9ca3af",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    transition: "all 0.3s ease",
                    boxShadow: isCurrent ? "0 4px 12px rgba(124, 58, 237, 0.3)" : "none",
                  }}
                >
                  {isCompleted ? <Check size={24} weight="bold" /> : stepNumber}
                </Box>

                {/* Step Label */}
                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: "0.875rem",
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCompleted ? "#7c3aed" : isCurrent ? "#111827" : "#9ca3af",
                    textAlign: "center",
                    maxWidth: 150,
                    transition: "all 0.3s ease",
                  }}
                >
                  {step.label}
                </Typography>

                {step.description && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      textAlign: "center",
                      maxWidth: 150,
                    }}
                  >
                    {step.description}
                  </Typography>
                )}
              </Box>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    backgroundColor: stepNumber < currentStep ? "#7c3aed" : "#e5e7eb",
                    maxWidth: 120,
                    mx: 2,
                    transition: "all 0.3s ease",
                    mb: step.description ? 5 : 3,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Progress Bar (Mobile) */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          mt: 2,
          width: "100%",
          height: 4,
          backgroundColor: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            backgroundColor: "#7c3aed",
            width: `${(currentStep / steps.length) * 100}%`,
            transition: "width 0.3s ease",
          }}
        />
      </Box>
    </Box>
  );
}
