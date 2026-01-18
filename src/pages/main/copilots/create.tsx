import * as React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { CopilotFormProvider, useCopilotForm } from "@/context/copilot-form-context";
import { Stepper } from "@/components/ui/stepper";
import { CopilotStep1Form } from "@/components/forms/copilot-step1-form";
import { CopilotStep2Form } from "@/components/forms/copilot-step2-form";
import { CopilotStep3Form } from "@/components/forms/copilot-step3-form";
import { CopilotStep4Form } from "@/components/forms/copilot-step4-form";

const steps = [
  { label: "Work Location & Jobs" },
  { label: "Filters & Preferences" },
  { label: "Profile Information" },
  { label: "Copilot Configuration" },
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
      // Combine all form data
      const finalData = {
        ...formData,
        step4: values,
      };

      console.log("Complete form data:", finalData);

      // Add your API call here
      // Example: await createCopilot(finalData);

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
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: { xs: 4, sm: 5, md: 6 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 2,
              fontSize: { xs: "1.875rem", sm: "2.25rem", md: "3rem" },
            }}
          >
            Copilot Configuration
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              fontSize: { xs: "0.9375rem", sm: "1rem" },
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Set up your job search copilot to automatically find and apply to jobs that match your criteria
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            p: { xs: 3, sm: 4, md: 6 },
            backgroundColor: "white",
          }}
        >
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === 1 && <CopilotStep1Form defaultValues={formData.step1} onNext={handleStep1Next} />}

          {currentStep === 2 && (
            <CopilotStep2Form defaultValues={formData.step2} onNext={handleStep2Next} onBack={prevStep} />
          )}

          {currentStep === 3 && (
            <CopilotStep3Form defaultValues={formData.step3} onNext={handleStep3Next} onBack={prevStep} />
          )}

          {currentStep === 4 && (
            <CopilotStep4Form
              defaultValues={formData.step4}
              onSubmit={handleFinalSubmit}
              onBack={prevStep}
              isPending={isPending}
            />
          )}
        </Paper>
      </Container>
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
