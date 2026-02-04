import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  Button,
  Typography,
  Paper,
  FormHelperText,
} from "@mui/material";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckIcon as Check,
  LightningIcon as Lightning,
  RocketLaunchIcon as RocketLaunch,
  PencilSimpleIcon as PencilSimple,
  ShieldCheckIcon as ShieldCheck,
  SparkleIcon as Sparkle,
} from "@phosphor-icons/react";
import { Step4Data } from "@/context/copilot-form-context";

// Zod validation schema
const step4Schema = zod.object({
  applicationMode: zod.enum(["auto-save", "full-auto"], {
    message: "Please select an application mode",
  }),
  writingStyle: zod.string().optional(),
});

type Step4FormValues = zod.infer<typeof step4Schema>;

interface CopilotStep4FormProps {
  defaultValues?: Partial<Step4Data>;
  onSubmit: (values: Step4FormValues) => void;
  onBack: () => void;
  isPending?: boolean;
}

// Info Item Component
const InfoItem = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      p: 2,
      backgroundColor: "#f9fafb",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    }}
  >
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#7c3aed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        mt: 0.25,
      }}
    >
      <Check size={12} weight="bold" color="white" />
    </Box>
    <Typography sx={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.6 }}>
      {children}
    </Typography>
  </Box>
);

export function CopilotStep4Form({
  defaultValues,
  onSubmit,
  onBack,
  isPending = false,
}: CopilotStep4FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4FormValues>({
    defaultValues: {
      applicationMode: defaultValues?.applicationMode || "auto-save",
      writingStyle: defaultValues?.writingStyle || "",
    },
    resolver: zodResolver(step4Schema),
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", maxWidth: 700, mx: "auto" }}
    >
      {/* Page Title - Hidden on mobile */}
      <Box sx={{ display: { xs: "none", sm: "block" }, mb: 4, textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 1,
            mb: 2,
            backgroundColor: "#f5f3ff",
            borderRadius: "20px",
          }}
        >
          <Sparkle size={16} weight="fill" style={{ color: "#7c3aed" }} />
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#7c3aed" }}>
            Final Step
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { sm: "1.25rem", md: "1.5rem" },
            color: "#111827",
            mb: 1,
          }}
        >
          Configure Your Copilot
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Choose how your copilot handles applications
        </Typography>
      </Box>

      {/* Application Mode Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7c3aed20 0%, #7c3aed10 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7c3aed",
            }}
          >
            <RocketLaunch size={22} weight="duotone" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: "#1f2937" }}>
              Application Mode
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Choose how JobCopilot works for you
            </Typography>
          </Box>
        </Box>

        <Controller
          name="applicationMode"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Auto-Save Option */}
              <Box
                onClick={() => field.onChange("auto-save")}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: field.value === "auto-save" ? "#7c3aed" : "#e5e7eb",
                  backgroundColor: field.value === "auto-save" ? "#f5f3ff" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: field.value === "auto-save" ? "#7c3aed" : "#d1d5db",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <PencilSimple size={20} weight="duotone" style={{ color: "#7c3aed" }} />
                      <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#1f2937" }}>
                        Auto-Save & Manual Review
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6, mb: 2 }}>
                      Your copilot auto-fills application forms but does not submit them.
                      Review jobs and answers before submitting, allowing you to{" "}
                      <strong style={{ color: "#7c3aed" }}>
                        train your copilot <Lightning size={14} weight="fill" color="#f59e0b" />
                      </strong>
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 0.75,
                        backgroundColor: "#7c3aed",
                        borderRadius: "16px",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.75rem", color: "white", fontWeight: 600 }}>
                        Recommended for new users
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: field.value === "auto-save" ? "#7c3aed" : "#d1d5db",
                      backgroundColor: field.value === "auto-save" ? "#7c3aed" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      ml: 2,
                    }}
                  >
                    {field.value === "auto-save" && (
                      <Check size={14} weight="bold" color="white" />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Full Auto Option */}
              <Box
                onClick={() => field.onChange("full-auto")}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: field.value === "full-auto" ? "#7c3aed" : "#e5e7eb",
                  backgroundColor: field.value === "full-auto" ? "#f5f3ff" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: field.value === "full-auto" ? "#7c3aed" : "#d1d5db",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <Lightning size={20} weight="duotone" style={{ color: "#f59e0b" }} />
                      <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "#1f2937" }}>
                        Full Auto-Apply
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>
                      Your copilot auto-fills and automatically submits applications.
                      Perfect for experienced users who trust their copilot settings.
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: field.value === "full-auto" ? "#7c3aed" : "#d1d5db",
                      backgroundColor: field.value === "full-auto" ? "#7c3aed" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      ml: 2,
                    }}
                  >
                    {field.value === "full-auto" && (
                      <Check size={14} weight="bold" color="white" />
                    )}
                  </Box>
                </Box>
              </Box>

              {errors.applicationMode && (
                <FormHelperText error sx={{ textAlign: "center" }}>
                  {errors.applicationMode.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />
      </Paper>

      {/* How It Works Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b98120 0%, #10b98110 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10b981",
            }}
          >
            <ShieldCheck size={22} weight="duotone" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: "#1f2937" }}>
              How Your Copilot Works
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
              What to expect after setup
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <InfoItem>
            Your copilot will filter live jobs that match your search criteria, then search for new jobs every 4 hours.
          </InfoItem>
          <InfoItem>
            Based on your profile information, your copilot will answer screening questions on your behalf, powered by AI.
          </InfoItem>
          <InfoItem>
            Your copilot will not reapply to jobs it has previously applied to.
          </InfoItem>
        </Box>
      </Paper>

      {/* Writing Style Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #fde68a",
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          mb: 4,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#fbbf24",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: "#fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <PencilSimple size={22} weight="duotone" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#92400e" }}>
              Writing Style
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "#a16207" }}>
              Personalize how your copilot answers application questions
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 600 }}>
            OPTIONAL
          </Typography>
        </Box>
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={onBack}
          startIcon={<ArrowLeft size={20} weight="bold" />}
          sx={{
            borderRadius: "12px",
            py: 1.5,
            px: 3,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            border: "2px solid #e5e7eb",
            color: "#374151",
            "&:hover": {
              borderColor: "#d1d5db",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Back
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isPending}
          sx={{
            borderRadius: "12px",
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
              boxShadow: "0 6px 20px rgba(124, 58, 237, 0.45)",
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
              boxShadow: "none",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isPending ? "Saving Configuration..." : "Launch Copilot"}
        </Button>
      </Box>
    </Box>
  );
}
