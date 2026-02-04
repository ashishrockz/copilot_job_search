import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  TextField,
  Button,
  FormLabel,
  Typography,
  Chip,
  Autocomplete,
  FormHelperText,
  Paper,
  Grid,
} from "@mui/material";
import {
  MapPinIcon as MapPin,
  ArrowRightIcon as ArrowRight,
  BriefcaseIcon as Briefcase,
  MagnifyingGlassIcon as MagnifyingGlass,
  GlobeIcon as Globe,
  BuildingsIcon as Buildings,
  LightbulbIcon as Lightbulb,
  BookmarkSimpleIcon as BookmarkSimple,
  ClockCounterClockwiseIcon as ClockCounterClockwise,
} from "@phosphor-icons/react";
import { Step1Data } from "@/context/copilot-form-context";

// Zod validation schema
const step1Schema = zod.object({
  workLocationType: zod.enum(["remote", "onsite", "hybrid"], {
    message: "Please select a work location type",
  }),
  remoteLocations: zod.array(zod.string()).optional(),
  onsiteLocations: zod.array(zod.string()).optional(),
  jobTypes: zod.array(zod.string()).min(1, { message: "Select at least one job type" }),
  searchMethod: zod.enum(["keywords", "favorite", "applied"]),
  jobTitles: zod.array(zod.string()).optional(),
}).refine(
  (data) => {
    if (data.searchMethod === "keywords") {
      return data.jobTitles && data.jobTitles.length > 0;
    }
    return true;
  },
  {
    message: "Add at least one job title when using keyword search",
    path: ["jobTitles"],
  }
);

type Step1FormValues = zod.infer<typeof step1Schema>;

interface CopilotStep1FormProps {
  defaultValues?: Partial<Step1Data>;
  onNext: (values: Step1FormValues) => void;
}

const locationOptions = [
  "Worldwide",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Netherlands",
  "Singapore",
  "India",
];

const jobTypeOptions = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contractor", label: "Contractor" },
  { value: "internship", label: "Internship" },
];

const searchMethodOptions = [
  {
    value: "keywords",
    label: "Job Title Keywords",
    description: "Search by job titles",
    icon: <MagnifyingGlass size={20} weight="duotone" />,
  },
  {
    value: "favorite",
    label: "Favorite Jobs",
    description: "Use your saved jobs",
    icon: <BookmarkSimple size={20} weight="duotone" />,
  },
  {
    value: "applied",
    label: "Applied Jobs",
    description: "Similar to applied",
    icon: <ClockCounterClockwise size={20} weight="duotone" />,
  },
];

// Section Header Component
const SectionHeader = ({
  icon,
  title,
  subtitle,
  color = "#7c3aed",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
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

export function CopilotStep1Form({ defaultValues, onNext }: CopilotStep1FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1FormValues>({
    defaultValues: {
      workLocationType: defaultValues?.workLocationType || undefined,
      remoteLocations: defaultValues?.remoteLocations || [],
      onsiteLocations: defaultValues?.onsiteLocations || [],
      jobTypes: defaultValues?.jobTypes || [],
      searchMethod: defaultValues?.searchMethod || "keywords",
      jobTitles: defaultValues?.jobTitles || [],
    },
    resolver: zodResolver(step1Schema),
  });

  const workLocationType = watch("workLocationType");
  const searchMethod = watch("searchMethod");

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
          Set Up Your Job Search
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Tell us what kind of jobs you're looking for
        </Typography>
      </Box>

      {/* Work Location Section */}
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
          icon={<Globe size={22} weight="duotone" />}
          title="Work Location"
          subtitle="Are you looking for remote, on-site, or hybrid positions?"
          color="#7c3aed"
        />

        <Controller
          name="workLocationType"
          control={control}
          render={({ field }) => (
            <Box>
              <Grid container spacing={2}>
                {[
                  {
                    value: "remote",
                    label: "Remote Jobs",
                    description: "Work from anywhere",
                    icon: <Globe size={24} weight="duotone" />,
                  },
                  {
                    value: "onsite",
                    label: "On-site / Hybrid",
                    description: "Office-based positions",
                    icon: <Buildings size={24} weight="duotone" />,
                  },
                ].map((option) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={option.value}>
                    <Box
                      onClick={() => field.onChange(option.value)}
                      sx={{
                        p: 2.5,
                        borderRadius: "12px",
                        border: "2px solid",
                        borderColor: field.value === option.value ? "#7c3aed" : "#e5e7eb",
                        backgroundColor: field.value === option.value ? "#f5f3ff" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        "&:hover": {
                          borderColor: field.value === option.value ? "#7c3aed" : "#d1d5db",
                          backgroundColor: field.value === option.value ? "#f5f3ff" : "#f9fafb",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          backgroundColor: field.value === option.value ? "#7c3aed" : "#f3f4f6",
                          color: field.value === option.value ? "#fff" : "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            color: field.value === option.value ? "#7c3aed" : "#374151",
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            color: "#6b7280",
                          }}
                        >
                          {option.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor: field.value === option.value ? "#7c3aed" : "#d1d5db",
                          backgroundColor: field.value === option.value ? "#7c3aed" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {field.value === option.value && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {errors.workLocationType && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.workLocationType.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />

        {/* Location Autocomplete - Show based on selection */}
        {workLocationType && (
          <Box sx={{ mt: 3 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              {workLocationType === "remote" ? "Preferred Regions" : "Preferred Locations"}
            </FormLabel>
            <Controller
              name={workLocationType === "remote" ? "remoteLocations" : "onsiteLocations"}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={locationOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        workLocationType === "remote"
                          ? "Select regions (e.g., Worldwide, Europe)"
                          : "Select locations"
                      }
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <MapPin
                                size={18}
                                style={{ marginLeft: 8, marginRight: 4, color: "#9ca3af" }}
                              />
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        },
                      }}
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
                          color: "#7c3aed",
                          fontWeight: 500,
                          "& .MuiChip-deleteIcon": {
                            color: "#7c3aed",
                            "&:hover": { color: "#6d28d9" },
                          },
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </Box>
        )}
      </Paper>

      {/* Job Types Section */}
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
          icon={<Briefcase size={22} weight="duotone" />}
          title="Job Types"
          subtitle="What type of employment are you looking for?"
          color="#10b981"
        />

        <Controller
          name="jobTypes"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {jobTypeOptions.map((option) => {
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
                              "&:hover": { backgroundColor: "#f3f4f6", borderColor: "#d1d5db" },
                            }),
                      }}
                    />
                  );
                })}
              </Box>
              {errors.jobTypes && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.jobTypes.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />
      </Paper>

      {/* Search Method Section */}
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
          icon={<MagnifyingGlass size={22} weight="duotone" />}
          title="Search Method"
          subtitle="How would you like to find jobs?"
          color="#f59e0b"
        />

        <Controller
          name="searchMethod"
          control={control}
          render={({ field }) => (
            <Grid container spacing={2}>
              {searchMethodOptions.map((option) => (
                <Grid size={{ xs: 12, sm: 4 }} key={option.value}>
                  <Box
                    onClick={() => field.onChange(option.value)}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: "2px solid",
                      borderColor: field.value === option.value ? "#f59e0b" : "#e5e7eb",
                      backgroundColor: field.value === option.value ? "#fffbeb" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                      "&:hover": {
                        borderColor: field.value === option.value ? "#f59e0b" : "#d1d5db",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: field.value === option.value ? "#f59e0b" : "#f3f4f6",
                        color: field.value === option.value ? "#fff" : "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      {option.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: field.value === option.value ? "#b45309" : "#374151",
                        mb: 0.5,
                      }}
                    >
                      {option.label}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {option.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        />

        {/* Job Titles - Only show for keywords search */}
        {searchMethod === "keywords" && (
          <Box sx={{ mt: 3 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Job Titles
            </FormLabel>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, color: "#6b7280", fontSize: "0.8125rem" }}
            >
              Add up to 5 job titles you're interested in
            </Typography>

            <Controller
              name="jobTitles"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={value || []}
                    onChange={(_, newValue) => {
                      if (newValue.length <= 5) {
                        onChange(newValue);
                      }
                    }}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="e.g. Software Engineer, Product Manager"
                        error={Boolean(errors.jobTitles)}
                        helperText={errors.jobTitles?.message}
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
                            "& .MuiChip-deleteIcon": {
                              color: "#b45309",
                              "&:hover": { color: "#92400e" },
                            },
                          }}
                        />
                      ))
                    }
                  />

                  {/* Tip Box */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mt: 2,
                      p: 2,
                      backgroundColor: "#fef3c7",
                      borderRadius: "10px",
                      border: "1px solid #fde68a",
                    }}
                  >
                    <Lightbulb size={20} weight="duotone" style={{ color: "#b45309", flexShrink: 0, marginTop: 2 }} />
                    <Typography sx={{ fontSize: "0.8125rem", color: "#92400e" }}>
                      <strong>Tip:</strong> Adding similar job titles helps find more opportunities.
                      For example, "Frontend Developer" and "React Developer" will match different listings.
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Box>
        )}
      </Paper>

      {/* Next Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        endIcon={<ArrowRight size={20} weight="bold" />}
        sx={{
          borderRadius: "12px",
          padding: "14px 32px",
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
        Next: Filters & Preferences
      </Button>
    </Box>
  );
}
