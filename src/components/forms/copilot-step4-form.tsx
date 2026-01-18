import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { Box, Button, FormControl, FormLabel, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ArrowLeft, Check, Lightning } from "@phosphor-icons/react";
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 700,
          fontSize: { xs: "1.5rem", sm: "1.75rem" },
          color: "#111827",
          textAlign: "center",
        }}
      >
        Copilot Configuration
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: 600,
          fontSize: { xs: "1rem", sm: "1.125rem" },
          color: "#111827",
          textAlign: "center",
        }}
      >
        Step 4 of 4
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 5,
          fontWeight: 600,
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
          color: "#111827",
          textAlign: "center",
        }}
      >
        Final Step!
      </Typography>

      {/* Application Mode Section */}
      <Box sx={{ mb: 5 }}>
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              color: "#374151",
              textAlign: "center",
            }}
          >
            Choose how JobCopilot works for you:
          </FormLabel>

          <Controller
            name="applicationMode"
            control={control}
            render={({ field }) => (
              <Box>
                <ToggleButtonGroup
                  {...field}
                  exclusive
                  orientation="vertical"
                  onChange={(_, value) => {
                    if (value !== null) {
                      field.onChange(value);
                    }
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "2px solid #e5e7eb",
                      borderRadius: "16px !important",
                      margin: 0,
                    },
                  }}
                >
                  {/* Auto-Save & Manual Review */}
                  <ToggleButton
                    value="auto-save"
                    sx={{
                      padding: "24px",
                      textTransform: "none",
                      textAlign: "left",
                      display: "block",
                      position: "relative",
                      "&.Mui-selected": {
                        backgroundColor: "#f3e8ff",
                        border: "2px solid #7c3aed",
                        "&:hover": {
                          backgroundColor: "#ede9fe",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.125rem" },
                            color: "#111827",
                            mb: 1,
                          }}
                        >
                          Auto-Save & Manual Review:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                            color: "#6b7280",
                            lineHeight: 1.6,
                          }}
                        >
                          your copilot auto-fills application forms but does not submit them. You can review jobs and
                          answers before submitting, this allows you to{" "}
                          <strong>
                            train your copilot <Lightning size={16} weight="fill" color="#f59e0b" />
                          </strong>
                        </Typography>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1.5,
                            px: 2,
                            py: 0.75,
                            backgroundColor: "#7c3aed",
                            borderRadius: "20px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                              color: "white",
                              fontWeight: 600,
                              fontStyle: "italic",
                            }}
                          >
                            Recommended for new users
                          </Typography>
                        </Box>
                      </Box>
                      {field.value === "auto-save" && (
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: "#7c3aed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 2,
                          }}
                        >
                          <Check size={18} weight="bold" color="white" />
                        </Box>
                      )}
                    </Box>
                  </ToggleButton>

                  {/* Full Auto-Apply */}
                  <ToggleButton
                    value="full-auto"
                    sx={{
                      padding: "24px",
                      textTransform: "none",
                      textAlign: "left",
                      display: "block",
                      position: "relative",
                      "&.Mui-selected": {
                        backgroundColor: "#f3e8ff",
                        border: "2px solid #7c3aed",
                        "&:hover": {
                          backgroundColor: "#ede9fe",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "1rem", sm: "1.125rem" },
                            color: "#111827",
                            mb: 1,
                          }}
                        >
                          Full Auto-Apply:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                            color: "#6b7280",
                            lineHeight: 1.6,
                          }}
                        >
                          your copilot auto-fills and automatically submits applications.
                        </Typography>
                      </Box>
                      {field.value === "full-auto" && (
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: "#7c3aed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 2,
                          }}
                        >
                          <Check size={18} weight="bold" color="white" />
                        </Box>
                      )}
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>

                {errors.applicationMode && (
                  <Typography color="error" sx={{ mt: 1.5, fontSize: "0.875rem", textAlign: "center" }}>
                    {errors.applicationMode.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </FormControl>
      </Box>

      {/* Information Boxes */}
      <Box sx={{ mb: 5, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 2,
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
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
          <Typography
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            Your copilot will filter live jobs that match your search criteria, then will search for new jobs every 4
            hours.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 2,
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
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
          <Typography
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            Based on the information you gave in the previous step, your copilot will answer screening questions on your
            behalf, powered by AI.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 2,
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
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
          <Typography
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: "#374151",
              lineHeight: 1.6,
            }}
          >
            Your copilot will not reapply to jobs that it previously applied to.
          </Typography>
        </Box>
      </Box>

      {/* Writing Style Section */}
      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "#fefce8",
            borderRadius: "12px",
            border: "1px solid #fde047",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#fef9c3",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "0.9375rem", sm: "1rem" },
              color: "#374151",
              mb: 1.5,
            }}
          >
            Writing Style
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            Personalize how your copilot answers application questions.
          </Typography>
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={onBack}
          startIcon={<ArrowLeft size={20} weight="bold" />}
          sx={{
            borderRadius: "12px",
            padding: { xs: "12px 24px", sm: "14px 32px" },
            textTransform: "none",
            fontSize: { xs: "0.9375rem", sm: "1rem" },
            fontWeight: 600,
            borderColor: "#e5e7eb",
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
            padding: { xs: "12px 24px", sm: "14px 32px" },
            textTransform: "none",
            fontSize: { xs: "0.9375rem", sm: "1rem" },
            fontWeight: 600,
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
              boxShadow: "0 6px 16px rgba(124, 58, 237, 0.4)",
            },
            "&:disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
              boxShadow: "none",
            },
          }}
        >
          {isPending ? "Saving Configuration..." : "Save Configuration"}
        </Button>
      </Box>
    </Box>
  );
}
