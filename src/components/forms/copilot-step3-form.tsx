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
} from "@mui/material";
import { ArrowRight, ArrowLeft, Link as LinkIcon } from "@phosphor-icons/react";
import { Step3Data } from "@/context/copilot-form-context";

// Zod validation schema
const step3Schema = zod.object({
  cvLink: zod.string().url({ message: "Please enter a valid URL" }).optional().or(zod.literal("")),
  phoneNumber: zod.string().optional(),
  coverLetter: zod.string().min(1, { message: "Cover letter is required" }),
  currentLocation: zod.string().min(1, { message: "Current location is required" }),
  currentJobTitle: zod.string().optional(),
  availability: zod.string().min(1, { message: "Please select your availability" }),
  eligibleCountries: zod.array(zod.string()),
  futureLanguages: zod.array(zod.string()),
  nationality: zod.array(zod.string()),
  currentSalary: zod.string().optional(),
  expectedSalary: zod.string().optional(),
  expectedSalaryFullTime: zod.string().optional(),
  expectedSalaryPartTime: zod.string().optional(),
  linkedInProfile: zod.string().url({ message: "Please enter a valid URL" }).optional().or(zod.literal("")),
  experienceSummary: zod.string().min(1, { message: "Experience summary is required" }),
  screeningQuestions: zod.string().optional(),
});

type Step3FormValues = zod.infer<typeof step3Schema>;

interface CopilotStep3FormProps {
  defaultValues?: Partial<Step3Data>;
  onNext: (values: Step3FormValues) => void;
  onBack: () => void;
}

const availabilityOptions = [
  { value: "immediate", label: "Immediately" },
  { value: "2weeks", label: "2 Weeks" },
  { value: "1month", label: "1 Month" },
  { value: "2months", label: "2+ Months" },
];

const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Netherlands",
  "India",
  "Singapore",
];

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Hindi",
  "Portuguese",
  "Russian",
];

export function CopilotStep3Form({ defaultValues, onNext, onBack }: CopilotStep3FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3FormValues>({
    defaultValues: {
      cvLink: defaultValues?.cvLink || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      coverLetter: defaultValues?.coverLetter || "",
      currentLocation: defaultValues?.currentLocation || "",
      currentJobTitle: defaultValues?.currentJobTitle || "",
      availability: defaultValues?.availability || "",
      eligibleCountries: defaultValues?.eligibleCountries || [],
      futureLanguages: defaultValues?.futureLanguages || [],
      nationality: defaultValues?.nationality || [],
      currentSalary: defaultValues?.currentSalary || "",
      expectedSalary: defaultValues?.expectedSalary || "",
      expectedSalaryFullTime: defaultValues?.expectedSalaryFullTime || "",
      expectedSalaryPartTime: defaultValues?.expectedSalaryPartTime || "",
      linkedInProfile: defaultValues?.linkedInProfile || "",
      experienceSummary: defaultValues?.experienceSummary || "",
      screeningQuestions: defaultValues?.screeningQuestions || "",
    },
    resolver: zodResolver(step3Schema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
          color: "#111827",
        }}
      >
        Profile Information
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 4,
          color: "#6b7280",
          fontSize: { xs: "0.8125rem", sm: "0.875rem" },
        }}
      >
        It is very important for your resume to be up to date with your current experience to have maximum screening questions success.
      </Typography>

      {/* CV/Resume Link */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Confirm the CV/Resume you would like to use:
        </FormLabel>
        <Controller
          name="cvLink"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Upload or paste CV/PDF or link"
              variant="outlined"
              fullWidth
              error={Boolean(errors.cvLink)}
              helperText={errors.cvLink?.message}
              InputProps={{
                startAdornment: <LinkIcon size={20} style={{ marginRight: 8, color: "#9ca3af" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Phone Number */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Please enter your mobile number for employers to contact you:
        </FormLabel>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                defaultValue="+1"
                SelectProps={{ native: true }}
                sx={{
                  width: 120,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+91">🇮🇳 +91</option>
              </TextField>
              <TextField
                {...field}
                placeholder="Upload or paste phone number here"
                variant="outlined"
                fullWidth
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  },
                }}
              />
            </Box>
          )}
        />
      </FormControl>

      {/* Cover Letter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Cover Letter
        </FormLabel>
        <Controller
          name="coverLetter"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Write your cover letter here..."
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              error={Boolean(errors.coverLetter)}
              helperText={errors.coverLetter?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Current Location */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Where are you currently based?
        </FormLabel>
        <Controller
          name="currentLocation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Type and select locations on Google"
              variant="outlined"
              fullWidth
              error={Boolean(errors.currentLocation)}
              helperText={errors.currentLocation?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Current Job Title */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          What is your current (or previous) job title?
        </FormLabel>
        <Controller
          name="currentJobTitle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="e.g. Assistant"
              variant="outlined"
              fullWidth
              error={Boolean(errors.currentJobTitle)}
              helperText={errors.currentJobTitle?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Availability */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          What is your availability / notice period?
        </FormLabel>
        <Controller
          name="availability"
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
                  gap: 1.5,
                  "& .MuiToggleButtonGroup-grouped": {
                    border: "1px solid #e5e7eb",
                    borderRadius: "24px !important",
                    margin: 0,
                  },
                }}
              >
                {availabilityOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    sx={{
                      padding: "8px 20px",
                      textTransform: "none",
                      color: "#374151",
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
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
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {errors.availability && (
                <Typography color="error" sx={{ mt: 1, fontSize: "0.75rem", ml: 1.75 }}>
                  {errors.availability.message}
                </Typography>
              )}
            </Box>
          )}
        />
      </FormControl>

      {/* Eligible Countries */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          In which countries are you eligible to work?
        </FormLabel>
        <Controller
          name="eligibleCountries"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={countryOptions}
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

      {/* Future Languages */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Will you now or in the future require sponsorship for an employment visa?
        </FormLabel>
        <Controller
          name="futureLanguages"
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

      {/* Nationality */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          What is your nationality?
        </FormLabel>
        <Controller
          name="nationality"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={countryOptions}
              value={value || []}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select nationality"
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

      {/* Salary Fields */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            What is your current (or most recent) salary?
          </FormLabel>
          <Controller
            name="currentSalary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. $80,000"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  },
                }}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              color: "#374151",
            }}
          >
            What is your expected salary?
          </FormLabel>
          <Controller
            name="expectedSalary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. $100,000"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  },
                }}
              />
            )}
          />
        </FormControl>
      </Box>

      {/* LinkedIn Profile */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Enter your LinkedIn profile link:
        </FormLabel>
        <Controller
          name="linkedInProfile"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="https://linkedin.com/in/your-profile"
              variant="outlined"
              fullWidth
              error={Boolean(errors.linkedInProfile)}
              helperText={errors.linkedInProfile?.message || "Don't have LinkedIn?"}
              InputProps={{
                startAdornment: <LinkIcon size={20} style={{ marginRight: 8, color: "#9ca3af" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Experience Summary */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Experience Summary
        </FormLabel>
        <Controller
          name="experienceSummary"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Brief summary of your professional experience, skills, and relevant information about yourself. Background: technology. Experience in data apps applications like in client development etc. Well experienced with AWS, development in various cloud platforms, expert in Data architecture etc. Experienced in using tools like MS Word, MS Excel. Experienced in using tools..."
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              error={Boolean(errors.experienceSummary)}
              helperText={errors.experienceSummary?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* Additional Screening Questions */}
      <FormControl fullWidth sx={{ mb: 5 }}>
        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "#374151",
          }}
        >
          Additional Screening Questions
        </FormLabel>
        <Typography
          variant="body2"
          sx={{
            mb: 1.5,
            color: "#6b7280",
            fontSize: { xs: "0.75rem", sm: "0.8125rem" },
          }}
        >
          Add any other relevant context that would help answer employer questions
        </Typography>
        <Controller
          name="screeningQuestions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Additional information..."
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                },
              }}
            />
          )}
        />
      </FormControl>

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
          Next: Copilot Configuration
        </Button>
      </Box>
    </Box>
  );
}
