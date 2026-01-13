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
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Chip,
  Typography,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import { MapPin, ArrowRight, Target } from "@phosphor-icons/react";

// Zod validation schema
export const careerProfileSchema = zod.object({
  currentJobTitle: zod.string().min(1, { message: "Current job title is required" }),
  yearsOfExperience: zod.string().min(1, { message: "Years of experience is required" }),
  managingTeamMembers: zod.string().min(1, { message: "Please select team size" }),
  scope: zod.string().min(1, { message: "Please select scope" }),
  industrySector: zod.array(zod.string()).min(1, { message: "At least one industry is required" }),
  country: zod.string().min(1, { message: "Country is required" }),
  city: zod.string().optional(),
  targetJobTitle: zod.string().min(1, { message: "Target job title is required" }),
  targetIndustrySector: zod.array(zod.string()).min(1, { message: "At least one target industry is required" }),
  languageToUse: zod.string().min(1, { message: "Language is required" }),
});

export type CareerProfileFormValues = zod.infer<typeof careerProfileSchema>;

export const defaultCareerProfileValues: CareerProfileFormValues = {
  currentJobTitle: "",
  yearsOfExperience: "",
  managingTeamMembers: "",
  scope: "",
  industrySector: [],
  country: "",
  city: "",
  targetJobTitle: "",
  targetIndustrySector: [],
  languageToUse: "",
};

// Options
export const teamSizeOptions = [
  { value: "no", label: "No" },
  { value: "1-4", label: "1-4" },
  { value: "5-10", label: "5-10" },
  { value: "10+", label: "10+" },
];

export const scopeOptions = [
  { value: "national", label: "National" },
  { value: "regional", label: "Regional" },
  { value: "global", label: "Global" },
];

export const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Real Estate",
  "Telecommunications",
];

export const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "India",
  "Singapore",
  "Japan",
  "Netherlands",
];

export const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Hindi",
  "Portuguese",
  "Russian",
  "Arabic",
];

interface CareerProfileFormProps {
  onSubmit: (values: CareerProfileFormValues) => void | Promise<void>;
  defaultValues?: Partial<CareerProfileFormValues>;
  isPending?: boolean;
  submitButtonText?: string;
}

export function CareerProfileForm({
  onSubmit,
  defaultValues,
  isPending = false,
  submitButtonText = "Generate Salary Benchmark Report",
}: CareerProfileFormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerProfileFormValues>({
    defaultValues: { ...defaultCareerProfileValues, ...defaultValues },
    resolver: zodResolver(careerProfileSchema),
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
      }}
    >
      {/* Current Profile Section */}
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        {/* Current Job Title */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Current job title:
          </FormLabel>
          <Controller
            name="currentJobTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. Digital Marketing Manager"
                variant="outlined"
                fullWidth
                error={Boolean(errors.currentJobTitle)}
                helperText={errors.currentJobTitle?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "0.9375rem", sm: "1rem" },
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Years of Experience */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Years of experience:
          </FormLabel>
          <Controller
            name="yearsOfExperience"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. 5"
                type="text"
                variant="outlined"
                fullWidth
                error={Boolean(errors.yearsOfExperience)}
                helperText={errors.yearsOfExperience?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "0.9375rem", sm: "1rem" },
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Managing Team Members */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Managing team members:
          </FormLabel>
          <Controller
            name="managingTeamMembers"
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
                    flexWrap: "wrap",
                    gap: { xs: 1, sm: 1.5 },
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "1px solid #e5e7eb",
                      borderRadius: "24px !important",
                      margin: 0,
                    },
                    "& .MuiToggleButton-root": {
                      borderRadius: "24px",
                      border: "1px solid #e5e7eb",
                      padding: { xs: "6px 16px", sm: "8px 24px" },
                      textTransform: "none",
                      color: "#374151",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                      "&.Mui-selected": {
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "1px solid #3b82f6",
                        "&:hover": {
                          backgroundColor: "#2563eb",
                        },
                      },
                    },
                  }}
                >
                  {teamSizeOptions.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {errors.managingTeamMembers && (
                  <FormHelperText error sx={{ ml: 1.75, mt: 0.75 }}>
                    {errors.managingTeamMembers.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </FormControl>

        {/* Scope */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Scope:
          </FormLabel>
          <Controller
            name="scope"
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
                    flexWrap: "wrap",
                    gap: { xs: 1, sm: 1.5 },
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "1px solid #e5e7eb",
                      borderRadius: "24px !important",
                      margin: 0,
                    },
                    "& .MuiToggleButton-root": {
                      borderRadius: "24px",
                      border: "1px solid #e5e7eb",
                      padding: { xs: "6px 16px", sm: "8px 24px" },
                      textTransform: "none",
                      color: "#374151",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                      "&.Mui-selected": {
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "1px solid #3b82f6",
                        "&:hover": {
                          backgroundColor: "#2563eb",
                        },
                      },
                    },
                  }}
                >
                  {scopeOptions.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                {errors.scope && (
                  <FormHelperText error sx={{ ml: 1.75, mt: 0.75 }}>
                    {errors.scope.message}
                  </FormHelperText>
                )}
              </Box>
            )}
          />
        </FormControl>

        {/* Industry / Sector */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Industry / Sector:
          </FormLabel>
          <Controller
            name="industrySector"
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
                    error={Boolean(errors.industrySector)}
                    helperText={errors.industrySector?.message}
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

        {/* Location */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
              display: "block",
            }}
          >
            Location:
          </FormLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 2.5, sm: 3 },
            }}
          >
            {/* Country */}
            <FormControl fullWidth>
              <Typography
                variant="caption"
                sx={{
                  mb: 1,
                  display: "block",
                  color: "#6b7280",
                  fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                }}
              >
                Country
              </Typography>
              <Controller
                name="country"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={countryOptions}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type or select"
                        error={Boolean(errors.country)}
                        helperText={errors.country?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            fontSize: { xs: "0.9375rem", sm: "1rem" },
                          },
                        }}
                      />
                    )}
                  />
                )}
              />
            </FormControl>

            {/* City */}
            <FormControl fullWidth>
              <Typography
                variant="caption"
                sx={{
                  mb: 1,
                  display: "block",
                  color: "#6b7280",
                  fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                }}
              >
                City
              </Typography>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="e.g. Los Angeles, California"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: <MapPin size={20} className="text-gray-400" />,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: { xs: "0.9375rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: { xs: 4, sm: 5, md: 6 } }} />

      {/* Target Profile Section */}
      <Box sx={{ mb: { xs: 4, sm: 5 } }}>
        {/* Target Job Title */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: { xs: 24, sm: 28 },
                height: { xs: 24, sm: 28 },
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Target size={16} weight="fill" color="white" />
            </Box>
            <FormLabel
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "#374151",
              }}
            >
              Target job title:
            </FormLabel>
          </Box>
          <Controller
            name="targetJobTitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. Senior Digital Marketing Manager"
                variant="outlined"
                fullWidth
                error={Boolean(errors.targetJobTitle)}
                helperText={errors.targetJobTitle?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "0.9375rem", sm: "1rem" },
                  },
                }}
              />
            )}
          />
        </FormControl>

        {/* Target Industry / Sector */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: { xs: 24, sm: 28 },
                height: { xs: 24, sm: 28 },
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Target size={16} weight="fill" color="white" />
            </Box>
            <FormLabel
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                color: "#374151",
              }}
            >
              Target industry / sector:
            </FormLabel>
          </Box>
          <Controller
            name="targetIndustrySector"
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
                    error={Boolean(errors.targetIndustrySector)}
                    helperText={errors.targetIndustrySector?.message}
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
                        backgroundColor: "#fae8ff",
                        color: "#7e22ce",
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      }}
                    />
                  ))
                }
              />
            )}
          />
        </FormControl>

        {/* Language to Use */}
        <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            Language to use
          </FormLabel>
          <Controller
            name="languageToUse"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={languageOptions}
                value={value || null}
                onChange={(_, newValue) => onChange(newValue || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select language"
                    error={Boolean(errors.languageToUse)}
                    helperText={errors.languageToUse?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        fontSize: { xs: "0.9375rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isPending}
        endIcon={<ArrowRight size={20} weight="bold" />}
        sx={{
          borderRadius: "12px",
          padding: { xs: "12px 24px", sm: "14px 32px" },
          textTransform: "none",
          fontSize: { xs: "0.9375rem", sm: "1rem" },
          fontWeight: 600,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            boxShadow: "0 6px 16px rgba(99, 102, 241, 0.4)",
          },
          "&:disabled": {
            background: "#e5e7eb",
            color: "#9ca3af",
            boxShadow: "none",
          },
        }}
      >
        {isPending ? "Processing..." : submitButtonText}
      </Button>
    </Box>
  );
}