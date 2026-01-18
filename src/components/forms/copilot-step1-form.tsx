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
  ToggleButton,
  ToggleButtonGroup,
  FormHelperText,
} from "@mui/material";
import { MapPin, ArrowRight, Briefcase, MagnifyingGlass } from "@phosphor-icons/react";
import { Step1Data } from "@/context/copilot-form-context";

// Zod validation schema
const step1Schema = zod.object({
  workLocationType: zod.enum(["remote", "onsite", "hybrid"], { message: "Please select a work location type" }),
  remoteLocations: zod.array(zod.string()).optional(),
  onsiteLocations: zod.array(zod.string()).optional(),
  jobTypes: zod.array(zod.string()).min(1, { message: "Select at least one job type" }),
  searchMethod: zod.enum(["keywords", "favorite", "applied"]),
  jobTitles: zod.array(zod.string()).min(1, { message: "Add at least one job title" }),
});

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
  { value: "parttime", label: "Part-Time" },
  { value: "contractor", label: "Contractor / Temp" },
  { value: "internship", label: "Internship" },
];

const searchMethodOptions = [
  { value: "keywords", label: "Job Title Keywords", icon: <MagnifyingGlass size={18} /> },
  { value: "favorite", label: "Favorite Jobs", icon: <Briefcase size={18} /> },
  { value: "applied", label: "Applied Jobs", icon: <Briefcase size={18} /> },
];

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
        First, select the Work Location and Jobs you are looking for
      </Typography>

      {/* Work Location Section */}
      <Box sx={{ mb: 5 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.9375rem", sm: "1rem" },
              color: "#374151",
            }}
          >
            Work Location
          </FormLabel>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "#6b7280",
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            }}
          >
            Are you looking for jobs that are remote, have a physical location, or both?
          </Typography>

          <Controller
            name="workLocationType"
            control={control}
            render={({ field }) => (
              <Box>
                <ToggleButtonGroup
                  {...field}
                  exclusive
                  onChange={(_, value) => {
                    if (value !== null) {
                      field.onChange(value);
                    }
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px !important",
                      margin: 0,
                    },
                  }}
                >
                  <ToggleButton
                    value="remote"
                    sx={{
                      justifyContent: "flex-start",
                      padding: "16px 20px",
                      textTransform: "none",
                      color: "#374151",
                      fontSize: { xs: "0.9375rem", sm: "1rem" },
                      fontWeight: 500,
                      "&.Mui-selected": {
                        backgroundColor: "#7c3aed",
                        color: "white",
                        border: "1px solid #7c3aed",
                        "&:hover": {
                          backgroundColor: "#6d28d9",
                        },
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: field.value === "remote" ? "white" : "#d1d5db",
                        backgroundColor: field.value === "remote" ? "white" : "transparent",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {field.value === "remote" && (
                        <Box
                          component="span"
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#7c3aed",
                          }}
                        />
                      )}
                    </Box>
                    Remote Jobs
                  </ToggleButton>

                  <ToggleButton
                    value="onsite"
                    sx={{
                      justifyContent: "flex-start",
                      padding: "16px 20px",
                      textTransform: "none",
                      color: "#374151",
                      fontSize: { xs: "0.9375rem", sm: "1rem" },
                      fontWeight: 500,
                      "&.Mui-selected": {
                        backgroundColor: "#7c3aed",
                        color: "white",
                        border: "1px solid #7c3aed",
                        "&:hover": {
                          backgroundColor: "#6d28d9",
                        },
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: field.value === "onsite" ? "white" : "#d1d5db",
                        backgroundColor: field.value === "onsite" ? "white" : "transparent",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {field.value === "onsite" && (
                        <Box
                          component="span"
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#7c3aed",
                          }}
                        />
                      )}
                    </Box>
                    On-site Jobs / Hybrid
                  </ToggleButton>
                </ToggleButtonGroup>
                {errors.workLocationType && (
                  <FormHelperText error sx={{ ml: 1.75, mt: 1 }}>
                    {errors.workLocationType.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </FormControl>

        {/* Location Fields */}
        {workLocationType === "remote" && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name="remoteLocations"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={locationOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Worldwide"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <MapPin size={20} style={{ marginLeft: 12, color: "#9ca3af" }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.9375rem", sm: "1rem" },
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
        )}

        {workLocationType === "onsite" && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name="onsiteLocations"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={locationOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type and select locations on Google"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <MapPin size={20} style={{ marginLeft: 12, color: "#9ca3af" }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontSize: { xs: "0.9375rem", sm: "1rem" },
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
        )}
      </Box>

      {/* Job Types Section */}
      <Box sx={{ mb: 5 }}>
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.9375rem", sm: "1rem" },
              color: "#374151",
            }}
          >
            Job Types
          </FormLabel>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "#6b7280",
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            }}
          >
            What job types are you looking for? Select at least one.
          </Typography>

          <Controller
            name="jobTypes"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  {jobTypeOptions.map((option) => (
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
                        padding: "8px 16px",
                        height: "auto",
                        fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                        fontWeight: 500,
                        borderRadius: "24px",
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
                {errors.jobTypes && (
                  <FormHelperText error sx={{ ml: 1.75, mt: 1 }}>
                    {errors.jobTypes.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </FormControl>
      </Box>

      {/* Search Method Section */}
      <Box sx={{ mb: 5 }}>
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.9375rem", sm: "1rem" },
              color: "#374151",
            }}
          >
            Search Method
          </FormLabel>

          <Controller
            name="searchMethod"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                {...field}
                exclusive
                onChange={(_, value) => {
                  if (value !== null) {
                    field.onChange(value);
                  }
                }}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  "& .MuiToggleButtonGroup-grouped": {
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px !important",
                    margin: 0,
                    flex: { xs: "none", sm: 1 },
                  },
                }}
              >
                {searchMethodOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    sx={{
                      padding: { xs: "10px 16px", sm: "12px 20px" },
                      textTransform: "none",
                      color: "#374151",
                      fontSize: { xs: "0.8125rem", sm: "0.9375rem" },
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "center", sm: "flex-start" },
                      gap: 1,
                      "&.Mui-selected": {
                        backgroundColor: "#7c3aed",
                        color: "white",
                        border: "1px solid #7c3aed",
                        "&:hover": {
                          backgroundColor: "#6d28d9",
                        },
                      },
                    }}
                  >
                    {option.icon}
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      {option.label}
                    </Box>
                    <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                      {option.label.replace(" Jobs", "").replace("Job Title ", "")}
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />
        </FormControl>
      </Box>

      {/* Job Titles Section */}
      {searchMethod === "keywords" && (
        <Box sx={{ mb: 5 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: { xs: "0.9375rem", sm: "1rem" },
                color: "#374151",
              }}
            >
              Job Titles
            </FormLabel>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: "#6b7280",
                fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              }}
            >
              What job titles are you looking for? Type in and select up to 5
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="e.g. 3D Visualizer Engineer"
                        error={Boolean(errors.jobTitles)}
                        helperText={errors.jobTitles?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            fontSize: { xs: "0.9375rem", sm: "1rem" },
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                      p: 2,
                      backgroundColor: "#fef3c7",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.25rem",
                      }}
                    >
                      💡
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#92400e",
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      }}
                    >
                      Tip: Adding similar job titles helps to find more jobs - don't miss out!
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </FormControl>
        </Box>
      )}

      {/* Next Button */}
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
  );
}
