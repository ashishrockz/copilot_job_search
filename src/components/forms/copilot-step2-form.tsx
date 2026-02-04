import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Autocomplete,
  Switch,
  FormControlLabel,
  Slider,
  Paper,
  Grid,
  Collapse,
} from "@mui/material";
import {
  ArrowRightIcon as ArrowRight,
  ArrowLeftIcon as ArrowLeft,
  LightningIcon as Lightning,
  FunnelIcon as Funnel,
  ClockIcon as Clock,
  CaretDownIcon as CaretDown,
  CaretUpIcon as CaretUp,
  WarningIcon as Warning,
  SlidersIcon as Sliders,
} from "@phosphor-icons/react";
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
  { value: "director", label: "Director Level+" },
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

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Portuguese",
];

// Section Header Component
const SectionHeader = ({
  icon,
  title,
  subtitle,
  color = "#7c3aed",
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color?: string;
  action?: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3 }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1f2937",
            fontSize: { xs: "1rem", sm: "1.125rem" },
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", fontSize: "0.875rem", mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    {action}
  </Box>
);

// Form Label Component
const StyledLabel = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
  <Typography
    sx={{
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#374151",
      mb: 1,
      display: "block",
    }}
  >
    {children}
    {optional && <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>(optional)</span>}
  </Typography>
);

// Text Field Styles
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    transition: "all 0.2s ease",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#d1d5db",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#7c3aed",
        borderWidth: "2px",
      },
    },
  },
};

export function CopilotStep2Form({ defaultValues, onNext, onBack }: CopilotStep2FormProps): React.JSX.Element {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onNext)}
      sx={{ width: "100%", maxWidth: 700, mx: "auto" }}
    >
      {/* Page Title - Hidden on mobile */}
      <Box sx={{ display: { xs: "none", sm: "block" }, mb: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { sm: "1.25rem", md: "1.5rem" },
            color: "#111827",
            mb: 1,
          }}
        >
          Refine Your Search
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Narrow down jobs with optional filters
        </Typography>
      </Box>

      {/* Job Match Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
          background: jobMatchEnabled
            ? "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%)"
            : undefined,
        }}
      >
        <SectionHeader
          icon={<Lightning size={22} weight="duotone" />}
          title="Job Match"
          subtitle="Only apply to jobs where you meet requirements"
          color="#7c3aed"
          action={
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
          }
        />

        <Collapse in={jobMatchEnabled}>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography sx={{ fontSize: "0.875rem", color: "#6b7280", mb: 3 }}>
              Your copilot will only apply to jobs where you meet{" "}
              <strong>more than half</strong> of the key requirements.
            </Typography>

            <Controller
              name="jobMatchLevel"
              control={control}
              render={({ field }) => (
                <Box sx={{ px: 2 }}>
                  <Slider
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
                        fontSize: "0.8125rem",
                        color: "#6b7280",
                      },
                    }}
                  />
                </Box>
              )}
            />
          </Box>
        </Collapse>
      </Paper>

      {/* Seniority Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<Sliders size={22} weight="duotone" />}
          title="Seniority Level"
          subtitle="Filter jobs by experience level"
          color="#10b981"
        />

        <Controller
          name="seniority"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {seniorityOptions.map((option) => {
                const isSelected = value?.includes(option.value);
                return (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => {
                      const newValue = isSelected
                        ? value.filter((v) => v !== option.value)
                        : [...(value || []), option.value];
                      onChange(newValue);
                    }}
                    sx={{
                      padding: "8px 4px",
                      height: "auto",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      ...(isSelected
                        ? {
                            backgroundColor: "#10b981",
                            color: "white",
                            "&:hover": { backgroundColor: "#059669" },
                          }
                        : {
                            backgroundColor: "#f9fafb",
                            color: "#374151",
                            border: "1px solid #e5e7eb",
                            "&:hover": { backgroundColor: "#f3f4f6" },
                          }),
                    }}
                  />
                );
              })}
            </Box>
          )}
        />
      </Paper>

      {/* Time Zones Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<Clock size={22} weight="duotone" />}
          title="Time Zones"
          subtitle="Filter remote jobs by time zone"
          color="#f59e0b"
        />

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
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select time zones"
                    sx={textFieldSx}
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
                        backgroundColor: "#fef3c7",
                        color: "#b45309",
                        fontWeight: 500,
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
                            color: "#f59e0b",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#f59e0b",
                          },
                        }}
                      />
                    }
                    label="Include flexible time zone jobs"
                    sx={{
                      mt: 2,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.8125rem",
                        color: "#374151",
                      },
                    }}
                  />
                )}
              />

              {value && value.length < 2 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2,
                    p: 1.5,
                    backgroundColor: "#fef3c7",
                    borderRadius: "10px",
                    border: "1px solid #fde68a",
                  }}
                >
                  <Warning size={18} weight="duotone" style={{ color: "#b45309" }} />
                  <Typography sx={{ fontSize: "0.8125rem", color: "#92400e" }}>
                    Add at least 2 time zones to get more job results
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        />
      </Paper>

      {/* Advanced Filters Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 4,
        }}
      >
        <Box
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f120 0%, #6366f110 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <Funnel size={22} weight="duotone" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.125rem", color: "#1f2937" }}>
                Advanced Filters
              </Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Industry, languages, keywords, and exclusions
              </Typography>
            </Box>
          </Box>
          {showAdvanced ? (
            <CaretUp size={20} style={{ color: "#6b7280" }} />
          ) : (
            <CaretDown size={20} style={{ color: "#6b7280" }} />
          )}
        </Box>

        <Collapse in={showAdvanced}>
          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #e5e7eb" }}>
            <Grid container spacing={3}>
              {/* Industry */}
              <Grid size={12}>
                <StyledLabel optional>Industry</StyledLabel>
                <Controller
                  name="industries"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={industryOptions}
                      value={value || []}
                      onChange={(_, newValue) => onChange(newValue)}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select industries"
                          sx={textFieldSx}
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
                              backgroundColor: "#ede9fe",
                              color: "#6366f1",
                              fontWeight: 500,
                            }}
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>

              {/* Job Description Language */}
              <Grid size={12}>
                <StyledLabel optional>Job Description Language</StyledLabel>
                <Controller
                  name="jobDescriptionLanguages"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      options={languageOptions}
                      value={value || []}
                      onChange={(_, newValue) => onChange(newValue)}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select languages"
                          sx={textFieldSx}
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
                              fontWeight: 500,
                            }}
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>

              {/* Include Keywords */}
              <Grid size={12}>
                <StyledLabel>
                  Include Keywords{" "}
                  <Chip
                    label="INCLUDE"
                    size="small"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: "0.65rem",
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                      fontWeight: 600,
                    }}
                  />
                </StyledLabel>
                <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 1.5 }}>
                  Only apply to jobs containing <strong>any</strong> of these keywords
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
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Type keywords and press Enter"
                          sx={textFieldSx}
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
                              backgroundColor: "#dcfce7",
                              color: "#166534",
                              fontWeight: 500,
                            }}
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>

              {/* Exclude Keywords */}
              <Grid size={12}>
                <StyledLabel>
                  Exclude Keywords{" "}
                  <Chip
                    label="EXCLUDE"
                    size="small"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: "0.65rem",
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      fontWeight: 600,
                    }}
                  />
                </StyledLabel>
                <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 1.5 }}>
                  Exclude jobs containing <strong>any</strong> of these keywords
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
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Type keywords and press Enter"
                          sx={textFieldSx}
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
                              fontWeight: 500,
                            }}
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>

              {/* Exclude Companies */}
              <Grid size={12}>
                <StyledLabel optional>Exclude Companies</StyledLabel>
                <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 1.5 }}>
                  Your copilot won't apply to jobs at these companies
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
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Type company names and press Enter"
                          sx={textFieldSx}
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
                              fontWeight: 500,
                            }}
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
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
          endIcon={<ArrowRight size={20} weight="bold" />}
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
            transition: "all 0.2s ease",
          }}
        >
          Next: Profile Information
        </Button>
      </Box>
    </Box>
  );
}
