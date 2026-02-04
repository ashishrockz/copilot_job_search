import * as React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { CopilotFormProvider, useCopilotForm } from "@/context/copilot-form-context";
import { Stepper } from "@/components/ui/stepper";
import { CopilotStep1Form } from "@/components/forms/copilot-step1-form";
import { CopilotStep2Form } from "@/components/forms/copilot-step2-form";
import { CopilotStep3Form } from "@/components/forms/copilot-step3-form";
import { CopilotStep4Form } from "@/components/forms/copilot-step4-form";
import { RocketLaunchIcon as RocketLaunch } from "@phosphor-icons/react";

const steps = [
  { label: "Location & Jobs", shortLabel: "Jobs" },
  { label: "Filters", shortLabel: "Filters" },
  { label: "Profile", shortLabel: "Profile" },
  { label: "Config", shortLabel: "Config" },
];

function CopilotCreateForm(): React.JSX.Element {
  const { formData, currentStep, updateStep1, updateStep2, updateStep3, updateStep4, nextStep, prevStep } =
    useCopilotForm();
  const [isPending, setIsPending] = React.useState(false);

  const handleStep1Next = (values: any) => {
    updateStep1(values);
    nextStep();
  };

  const handleStep2Next = (values: any) => {
    updateStep2(values);
    nextStep();
  };

  const handleStep3Next = (values: any) => {
    updateStep3(values);
    nextStep();
  };

  const handleFinalSubmit = async (values: any) => {
    updateStep4(values);
    setIsPending(true);

    try {
      const finalData = {
        ...formData,
        step4: values,
      };

      console.log("Complete form data:", finalData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Copilot configuration saved successfully!");
    } catch (error) {
      console.error("Error saving copilot:", error);
      alert("Error saving copilot configuration. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 4, md: 6 },
        px: { xs: 0, sm: 2, md: 3 },
        minHeight: "100%",
      }}
    >
      {/* Page Header - Hidden on mobile, shown on tablet+ */}
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          mb: { sm: 4, md: 5 },
          textAlign: "center",
          maxWidth: 800,
          mx: "auto",
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 1.5,
            mb: 3,
            backgroundColor: "#f5f3ff",
            borderRadius: "24px",
            border: "1px solid #ede9fe",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RocketLaunch size={18} weight="fill" color="white" />
          </Box>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#7c3aed" }}>
            Create New Copilot
          </Typography>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "#111827",
            mb: 1.5,
            fontSize: { sm: "1.75rem", md: "2.25rem" },
            letterSpacing: "-0.02em",
          }}
        >
          Set Up Your Job Search Copilot
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#6b7280",
            fontSize: { sm: "0.9375rem", md: "1rem" },
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Configure your AI-powered assistant to find and apply to jobs automatically
        </Typography>
      </Box>

      {/* Mobile Header */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 2,
          mb: 2,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RocketLaunch size={20} weight="fill" color="white" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#111827" }}>
            Create Copilot
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
          </Typography>
        </Box>
      </Box>

      {/* Main Form Card */}
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: "auto",
          borderRadius: { xs: 0, sm: "20px" },
          border: { xs: "none", sm: "1px solid #e5e7eb" },
          overflow: "hidden",
          backgroundColor: { xs: "transparent", sm: "#fff" },
        }}
      >
        {/* Stepper Section - Desktop only */}
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            px: { sm: 4, md: 6 },
            pt: { sm: 4, md: 5 },
            pb: { sm: 3 },
            borderBottom: "1px solid #f3f4f6",
            backgroundColor: "#fafafa",
          }}
        >
          <Stepper steps={steps} currentStep={currentStep} />
        </Box>

        {/* Mobile Progress Bar */}
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            px: 2,
            pb: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {steps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  height: 4,
                  borderRadius: "2px",
                  backgroundColor: index + 1 <= currentStep ? "#7c3aed" : "#e5e7eb",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Form Content */}
        <Box
          sx={{
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 2, sm: 5, md: 6 },
            backgroundColor: { xs: "#fff", sm: "transparent" },
            borderRadius: { xs: "16px", sm: 0 },
            mx: { xs: 2, sm: 0 },
            mb: { xs: 2, sm: 0 },
            border: { xs: "1px solid #e5e7eb", sm: "none" },
          }}
        >
          {currentStep === 1 && (
            <CopilotStep1Form defaultValues={formData.step1} onNext={handleStep1Next} />
          )}

          {currentStep === 2 && (
            <CopilotStep2Form
              defaultValues={formData.step2}
              onNext={handleStep2Next}
              onBack={prevStep}
            />
          )}

          {currentStep === 3 && (
            <CopilotStep3Form
              defaultValues={formData.step3}
              onNext={handleStep3Next}
              onBack={prevStep}
            />
          )}

          {currentStep === 4 && (
            <CopilotStep4Form
              defaultValues={formData.step4}
              onSubmit={handleFinalSubmit}
              onBack={prevStep}
              isPending={isPending}
            />
          )}
        </Box>
      </Paper>

      {/* Helper Text - Desktop only */}
      <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center", mt: 4 }}>
        <Typography sx={{ fontSize: "0.8125rem", color: "#9ca3af" }}>
          Your progress is saved automatically. You can return and continue anytime.
        </Typography>
      </Box>
    </Box>
  );
}

export function Page(): React.JSX.Element {
  return (
    <CopilotFormProvider>
      <CopilotCreateForm />
    </CopilotFormProvider>
  );
}
