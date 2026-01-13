import * as React from "react";
import { Controller, useForm, Control } from "react-hook-form";
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
} from "@mui/material";
import { MapPin, ArrowRight } from "@phosphor-icons/react";

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

// Sample options (you can move these to a constants file)
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
  submitButtonText = "Generate Upskilling Report",
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
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Current Job Title */}
      <FormControl fullWidth error={Boolean(errors.currentJobTitle)}>
        <FormLabel className="mb-2 font-semibold text-gray-900">
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
              error={Boolean(errors.currentJobTitle)}
              helperText={errors.currentJobTitle?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Years of Experience */}
      <FormControl fullWidth error={Boolean(errors.yearsOfExperience)}>
        <FormLabel className="mb-2 font-semibold text-gray-900">
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
              error={Boolean(errors.yearsOfExperience)}
              helperText={errors.yearsOfExperience?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Managing Team Members */}
      <FormControl fullWidth error={Boolean(errors.managingTeamMembers)}>
        <FormLabel className="mb-2 font-semibold text-gray-900">
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
                className="flex flex-wrap gap-2"
                sx={{
                  "& .MuiToggleButton-root": {
                    borderRadius: "24px",
                    border: "1px solid #e5e7eb",
                    padding: "8px 24px",
                    textTransform: "none",
                    color: "#374151",
                    "&.Mui-selected": {
                      backgroundColor: "#3b82f6",
                      color: "white",
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
                <FormHelperText error>
                  {errors.managingTeamMembers.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />
      </FormControl>

      {/* Scope */}
      <FormControl fullWidth error={Boolean(errors.scope)}>
        <FormLabel className="mb-2 font-semibold text-gray-900">
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
                className="flex flex-wrap gap-2"
                sx={{
                  "& .MuiToggleButton-root": {
                    borderRadius: "24px",
                    border: "1px solid #e5e7eb",
                    padding: "8px 24px",
                    textTransform: "none",
                    color: "#374151",
                    "&.Mui-selected": {
                      backgroundColor: "#3b82f6",
                      color: "white",
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
                <FormHelperText error>{errors.scope.message}</FormHelperText>
              )}
            </Box>
          )}
        />
      </FormControl>

      {/* Industry / Sector */}
      <FormControl fullWidth error={Boolean(errors.industrySector)}>
        <FormLabel className="mb-2 font-semibold text-gray-900">
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
                    className="bg-blue-100 text-blue-700"
                  />
                ))
              }
            />
          )}
        />
      </FormControl>

      {/* Location */}
      <Box>
        <FormLabel className="mb-2 font-semibold text-gray-900">
          Location:
        </FormLabel>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country */}
          <FormControl fullWidth error={Boolean(errors.country)}>
            <Typography variant="caption" className="mb-1 text-gray-600">
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
            <Typography variant="caption" className="mb-1 text-gray-600">
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
                  InputProps={{
                    endAdornment: <MapPin size={20} className="text-gray-400" />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Box>
      </Box>

      {/* Target Job Title */}
      <FormControl fullWidth error={Boolean(errors.targetJobTitle)}>
        <Box className="flex items-center gap-2 mb-2">
          <Box className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">🎯</span>
          </Box>
          <FormLabel className="font-semibold text-gray-900">
            Target job title:
          </FormLabel>
        </Box>
        <Controller
          name="targetJobTitle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="e.g. Digital Marketing Manager"
              variant="outlined"
              error={Boolean(errors.targetJobTitle)}
              helperText={errors.targetJobTitle?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Target Industry / Sector */}
      <FormControl fullWidth error={Boolean(errors.targetIndustrySector)}>
        <Box className="flex items-center gap-2 mb-2">
          <Box className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">🎯</span>
          </Box>
          <FormLabel className="font-semibold text-gray-900">
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
                    className="bg-purple-100 text-purple-700"
                  />
                ))
              }
            />
          )}
        />
      </FormControl>

      {/* Language to Use */}
      <FormControl fullWidth error={Boolean(errors.languageToUse)}>
        <FormLabel className="mb-2 font-semibold text-gray-900">
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
                    },
                  }}
                />
              )}
            />
          )}
        />
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isPending}
        endIcon={<ArrowRight size={20} weight="bold" />}
        sx={{
          borderRadius: "12px",
          padding: "12px 32px",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: 600,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          },
          "&:disabled": {
            background: "#e5e7eb",
            color: "#9ca3af",
          },
        }}
      >
        {isPending ? "Processing..." : submitButtonText}
      </Button>
    </Box>
  );
}
