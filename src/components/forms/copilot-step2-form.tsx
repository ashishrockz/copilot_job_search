import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Chip,
  Autocomplete,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormHelperText,
} from "@mui/material";
import { ArrowRight, ArrowLeft, CaretDown } from "@phosphor-icons/react";
import { Step2Data } from "@/context/copilot-form-context";

// Zod validation schema
const step2Schema = zod.object({
  jobMatchEnabled: zod.boolean(),
  jobMatchLevel: zod.enum(["high", "higher", "highest"]),
  seniority: zod.array(zod.string()),
  timeZones: zod.array(zod.string()),
  includeFlexibleTimeZone: zod.boolean(),
  industries: zod.array(zod.string()),
  jobDescriptionLanguages: zod.array(zod.string()),
  locationRadius: zod.string(),
  includeKeywords: zod.array(zod.string()),
  excludeKeywords: zod.array(zod.string()),
  excludeCompanies: zod.array(zod.string()),
});

type Step2FormValues = zod.infer<typeof step2Schema>;

interface CopilotStep2FormProps {
  defaultValues?: Partial<Step2Data>;
  onNext: (values: Step2FormValues) => void;
  onBack: () => void;
}

const seniorityOptions = [
  { value: "entry", label: "Entry Level" },
  { value: "associate", label: "Associate Level" },
  { value: "mid", label: "Mid-to-Senior Level" },
  { value: "director", label: "Director Level and above" },
];

const timeZoneOptions = [
  "Americas - Central",
  "Americas - Eastern",
  "Americas - Pacific",
  "Europe - Central",
  "Europe - Eastern",
  "Asia - Pacific",
];

const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
];

const languageOptions = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Portuguese"];

export function CopilotStep2Form({ defaultValues, onNext, onBack }: CopilotStep2FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2FormValues>({
    defaultValues: {
      jobMatchEnabled: defaultValues?.jobMatchEnabled ?? true,
      jobMatchLevel: defaultValues?.jobMatchLevel || "high",
      seniority: defaultValues?.seniority || [],
      timeZones: defaultValues?.timeZones || [],
      includeFlexibleTimeZone: defaultValues?.includeFlexibleTimeZone ?? true,
      industries: defaultValues?.industries || [],
      jobDescriptionLanguages: defaultValues?.jobDescriptionLanguages || [],
      locationRadius: defaultValues?.locationRadius || "",
      includeKeywords: defaultValues?.includeKeywords || [],
      excludeKeywords: defaultValues?.excludeKeywords || [],
      excludeCompanies: defaultValues?.excludeCompanies || [],
    },
    resolver: zodResolver(step2Schema),
  });

  const jobMatchEnabled = watch("jobMatchEnabled");
  const jobMatchLevel = watch("jobMatchLevel");

  const getJobMatchLabel = (value: number) => {
    if (value === 0) return "High";
    if (value === 1) return "Higher";
    return "Highest";
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: 600,
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
          color: "#111827",
        }}
      >
        Next, narrow your search with optional filters
      </Typography>

      {/* Job Match Section */}
      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "white", fontWeight: 600 }}>⚡</Typography>
            </Box>
            <FormLabel
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                color: "#374151",
              }}
            >
              Job Match
            </FormLabel>
          </Box>
          <Controller
            name="jobMatchEnabled"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                checked={field.value}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#7c3aed",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#7c3aed",
                  },
                }}
              />
            )}
          />
        </Box>

        {jobMatchEnabled && (
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: "#6b7280",
                fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              }}
            >
              💡 Your copilot will <strong>only</strong> apply to jobs where you meet <strong>more than half</strong> of
              the key requirements.
            </Typography>

            <Controller
              name="jobMatchLevel"
              control={control}
              render={({ field }) => (
                <Box sx={{ px: 2 }}>
                  <Slider
                    {...field}
                    value={field.value === "high" ? 0 : field.value === "higher" ? 1 : 2}
                    onChange={(_, value) => {
                      const level = value === 0 ? "high" : value === 1 ? "higher" : "highest";
                      field.onChange(level);
                    }}
                    min={0}
                    max={2}
                    step={1}
                    marks={[
                      { value: 0, label: "High" },
                      { value: 1, label: "Higher" },
                      { value: 2, label: "Highest" },
                    ]}
                    valueLabelDisplay="off"
                    sx={{
                      color: "#7c3aed",
                      "& .MuiSlider-mark": {
                        backgroundColor: "#d1d5db",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                      },
                      "& .MuiSlider-markActive": {
                        backgroundColor: "#7c3aed",
                      },
                      "& .MuiSlider-markLabel": {
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        color: "#6b7280",
                      },
                    }}
                  />
                </Box>
              )}
            />
          </Box>
        )}
      </Box>

      {/* Seniority Section */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Seniority <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
          </FormLabel>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "#6b7280",
              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            }}
          >
            Filter jobs by seniority. View an explanation of each level.
          </Typography>

          <Controller
            name="seniority"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {seniorityOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => {
                      const newValue = value?.includes(option.value)
                        ? value.filter((v) => v !== option.value)
                        : [...(value || []), option.value];
                      onChange(newValue);
                    }}
                    sx={{
                      padding: "10px 16px",
                      height: "auto",
                      justifyContent: "flex-start",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                      fontWeight: 500,
                      borderRadius: "12px",
                      cursor: "pointer",
                      ...(value?.includes(option.value)
                        ? {
                            backgroundColor: "#7c3aed",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#6d28d9",
                            },
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "#374151",
                            border: "1px solid #e5e7eb",
                            "&:hover": {
                              backgroundColor: "#f3f4f6",
                            },
                          }),
                    }}
                  />
                ))}
              </Box>
            )}
          />
        </FormControl>
      </Box>

      {/* Time Zones Section */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Time Zones <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
          </FormLabel>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "#6b7280",
              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            }}
          >
            Filter remote jobs by time zone.
          </Typography>

          <Controller
            name="timeZones"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box>
                <Autocomplete
                  multiple
                  options={timeZoneOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select time zones"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        }}
                      />
                    ))
                  }
                />

                <Controller
                  name="includeFlexibleTimeZone"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value}
                          size="small"
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#7c3aed",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#7c3aed",
                            },
                          }}
                        />
                      }
                      label="Include jobs that are open to any time zone / flexible"
                      sx={{
                        mt: 1.5,
                        "& .MuiFormControlLabel-label": {
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                          color: "#374151",
                        },
                      }}
                    />
                  )}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2,
                    p: 1.5,
                    backgroundColor: "#fef3c7",
                    borderRadius: "8px",
                  }}
                >
                  <Typography sx={{ fontSize: "1rem" }}>⚠️</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#92400e",
                      fontSize: { xs: "0.6875rem", sm: "0.75rem" },
                    }}
                  >
                    Add at least 2 time zones to get more job results
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </FormControl>
      </Box>

      {/* Advanced Filters Accordion */}
      <Accordion
        sx={{
          mb: 5,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
          borderRadius: "12px !important",
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<CaretDown size={20} />}
          sx={{
            "& .MuiAccordionSummary-content": {
              my: 2,
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "0.9375rem", sm: "1rem" },
              color: "#374151",
            }}
          >
            Advanced Filters
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Industry */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "#374151",
              }}
            >
              Industry <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
            </FormLabel>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: "#6b7280",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              }}
            >
              Select your preferred industries / sectors
            </Typography>

            <Controller
              name="industries"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={industryOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type or select"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </FormControl>

          {/* Job Description Language */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "#374151",
              }}
            >
              Job Description Language <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
            </FormLabel>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: "#6b7280",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              }}
            >
              Only apply to jobs in the following languages:
            </Typography>

            <Controller
              name="jobDescriptionLanguages"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={languageOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select languages"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </FormControl>

          {/* Job Description Keywords - Include */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "#374151",
              }}
            >
              Job Description Keywords
            </FormLabel>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: "#7c3aed",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                fontWeight: 600,
              }}
            >
              INCLUDE
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: "#6b7280",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              }}
            >
              Only apply to jobs that include <strong>any</strong> of these keywords in the job description.
            </Typography>

            <Controller
              name="includeKeywords"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type in keywords separated by commas"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </FormControl>

          {/* Job Description Keywords - Exclude */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: "#ef4444",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                fontWeight: 600,
              }}
            >
              EXCLUDE
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: "#6b7280",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              }}
            >
              Exclude jobs that contain <strong>any</strong> of these keywords in the job description.
            </Typography>

            <Controller
              name="excludeKeywords"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type in keywords separated by commas"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          backgroundColor: "#fee2e2",
                          color: "#991b1b",
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </FormControl>

          {/* Exclude Companies */}
          <FormControl fullWidth>
            <FormLabel
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "#374151",
              }}
            >
              Exclude Companies <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
            </FormLabel>
            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                color: "#6b7280",
                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              }}
            >
              Select companies to exclude so that your copilot doesn't apply for any jobs at these companies.
            </Typography>

            <Controller
              name="excludeCompanies"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type in and select companies to exclude"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          backgroundColor: "#fee2e2",
                          color: "#991b1b",
                          fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>

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
          endIcon={<ArrowRight size={20} weight="bold" />}
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
          }}
        >
          Next: Profile Information
        </Button>
      </Box>
    </Box>
  );
}
