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
  IconButton,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { 
  ArrowRight, 
  ArrowLeft,
  UploadSimple,
  X,
  FilePdf,
  FileDoc,
  CheckCircle,
  Plus,
  Info
} from "@phosphor-icons/react";
import { Step3Data } from "@/context/copilot-form-context";

// Zod validation schema
const step3Schema = zod.object({
  cvFile: zod.instanceof(File, { message: "Please upload your CV/Resume" }),
  cvLink: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  coverLetter: zod.string().optional(),
  coverLetterType: zod.enum(["generate", "upload"]).default("generate"),
  currentLocation: zod.string().min(1, { message: "Current location is required" }),
  stateRegion: zod.string().optional(),
  postCode: zod.string().optional(),
  currentJobTitle: zod.string().optional(),
  availability: zod.string().min(1, { message: "Please select your availability" }),
  eligibleCountries: zod.array(zod.string()),
  requireSponsorship: zod.enum(["yes", "no"]).optional(),
  nationality: zod.array(zod.string()),
  currentSalary: zod.string().optional(),
  expectedSalary: zod.string().optional(),
  linkedInProfile: zod.string().optional(),
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
  "Belgium",
];

export function CopilotStep3Form({ defaultValues, onNext, onBack }: CopilotStep3FormProps): React.JSX.Element {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<Step3FormValues>({
    defaultValues: {
      coverLetterType: "generate",
      phoneNumber: defaultValues?.phoneNumber || "",
      coverLetter: defaultValues?.coverLetter || "",
      currentLocation: defaultValues?.currentLocation || "",
      stateRegion: defaultValues?.stateRegion || "",
      postCode: defaultValues?.postCode || "",
      currentJobTitle: defaultValues?.currentJobTitle || "",
      availability: defaultValues?.availability || "",
      eligibleCountries: defaultValues?.eligibleCountries || [],
      requireSponsorship: undefined,
      nationality: defaultValues?.nationality || [],
      currentSalary: defaultValues?.currentSalary || "",
      expectedSalary: defaultValues?.expectedSalary || "",
      linkedInProfile: defaultValues?.linkedInProfile || "",
      experienceSummary: defaultValues?.experienceSummary || "",
      screeningQuestions: defaultValues?.screeningQuestions || "",
    },
    resolver: zodResolver(step3Schema),
  });

  const coverLetterType = watch("coverLetterType");
  const experienceSummary = watch("experienceSummary");

  const uploadResumeToAPI = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      // const response = await fetch('https://api.jobcopilot.com/api/v1/resumes', {
      //   method: 'POST',
      //   body: formData,
      //   // Add authorization header if needed
      //   // headers: {
      //   //   'Authorization': `Bearer ${yourAuthToken}`,
      //   // },
      // });

      // if (!response.ok) {
      //   throw new Error(`Upload failed: ${response.statusText}`);
      // }

      // const data = await response.json();
      // return data.url || data.resumeUrl || data.fileUrl || '';
      return " "
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setFileError('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    setFileError("");
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      const resumeUrl = await uploadResumeToAPI(file);
      setValue("cvFile", file);
      setValue("cvLink", resumeUrl);
      setUploadSuccess(true);
      trigger("cvFile");
    } catch (error) {
      setFileError('Failed to upload resume. Please try again.');
      setUploadedFile(null);
      setValue("cvFile", undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadSuccess(false);
    setValue("cvFile", undefined);
    setValue("cvLink", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <FilePdf size={24} weight="fill" style={{ color: "#ef4444" }} />;
    }
    return <FileDoc size={24} weight="fill" style={{ color: "#2563eb" }} />;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ width: "100%", maxWidth: "600px", mx: "auto" }}>
      {/* CV/Resume Upload */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Confirm the CV/Resume you would like to use
        </Typography>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          disabled={isUploading}
        />

        {!uploadedFile ? (
          <Button
            variant="outlined"
            onClick={triggerFileInput}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={18} /> : <UploadSimple size={18} weight="bold" />}
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              py: 1.25,
              px: 2,
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              color: "#6b7280",
              textTransform: "none",
              fontSize: "0.9375rem",
              fontWeight: 400,
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "transparent",
              },
            }}
          >
            {isUploading ? "Uploading..." : "Upload CV/PDF or Word"}
          </Button>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
            }}
          >
            {getFileIcon(uploadedFile.name)}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {uploadedFile.name}
              </Typography>
            </Box>
            {uploadSuccess && <CheckCircle size={20} weight="fill" style={{ color: "#10b981" }} />}
            <IconButton size="small" onClick={handleRemoveFile} sx={{ p: 0.5 }}>
              <X size={18} />
            </IconButton>
          </Box>
        )}
        {(fileError || errors.cvFile) && (
          <Typography sx={{ fontSize: "0.75rem", color: "#ef4444", mt: 0.5 }}>
            {fileError || errors.cvFile?.message}
          </Typography>
        )}
      </Box>

      {/* Cover Letter */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Cover Letter
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant={coverLetterType === "generate" ? "contained" : "outlined"}
            onClick={() => setValue("coverLetterType", "generate")}
            startIcon={<Plus size={18} weight="bold" />}
            sx={{
              flex: 1,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              ...(coverLetterType === "generate" ? {
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                color: "white",
                border: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                },
              } : {
                border: "1px solid #d1d5db",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "transparent",
                },
              }),
            }}
          >
            Generate a tailored cover letter
          </Button>
          <Button
            variant={coverLetterType === "upload" ? "contained" : "outlined"}
            onClick={() => setValue("coverLetterType", "upload")}
            startIcon={<UploadSimple size={18} weight="bold" />}
            sx={{
              flex: 1,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              ...(coverLetterType === "upload" ? {
                backgroundColor: "#f3f4f6",
                color: "#1f2937",
                border: "1px solid #d1d5db",
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                },
              } : {
                border: "1px solid #d1d5db",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "transparent",
                },
              }),
            }}
          >
            Upload my own Cover Letter
          </Button>
        </Box>
      </Box>

      {/* Phone Number */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Please enter your mobile number for employers to contact you
        </Typography>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                select
                defaultValue="+91"
                SelectProps={{ native: true }}
                sx={{
                  width: 100,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.9375rem",
                  },
                }}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </TextField>
              <TextField
                {...field}
                placeholder="9391754584"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.9375rem",
                  },
                }}
              />
            </Box>
          )}
        />
      </Box>

      {/* Current Location */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Where are you currently based?
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
          <Controller
            name="currentLocation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Country"
                variant="outlined"
                fullWidth
                error={Boolean(errors.currentLocation)}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.9375rem",
                  },
                }}
              />
            )}
          />
          <IconButton
            sx={{
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              width: 42,
              height: 42,
            }}
          >
            <Info size={20} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Controller
            name="stateRegion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="State of Region (Hyderabad, Telangana, etc.)"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.9375rem",
                  },
                }}
              />
            )}
          />
          <Controller
            name="postCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Post code"
                variant="outlined"
                sx={{
                  width: 120,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.9375rem",
                  },
                }}
              />
            )}
          />
        </Box>
        {errors.currentLocation && (
          <Typography sx={{ fontSize: "0.75rem", color: "#ef4444", mt: 0.5 }}>
            {errors.currentLocation.message}
          </Typography>
        )}
      </Box>

      {/* Current Job Title */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          What is your current (or previous) job title?
        </Typography>
        <Controller
          name="currentJobTitle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="<Not selected>"
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                },
              }}
            />
          )}
        />
      </Box>

      {/* Availability */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          What is your availability / notice period?
        </Typography>
        <Controller
          name="availability"
          control={control}
          render={({ field }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {availabilityOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  onClick={() => field.onChange(option.value)}
                  sx={{
                    px: 1.5,
                    py: 2.5,
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    ...(field.value === option.value ? {
                      backgroundColor: "#7c3aed",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#6d28d9",
                      },
                    } : {
                      backgroundColor: "transparent",
                      border: "1px solid #d1d5db",
                      color: "#374151",
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
        {errors.availability && (
          <Typography sx={{ fontSize: "0.75rem", color: "#ef4444", mt: 0.5 }}>
            {errors.availability.message}
          </Typography>
        )}
      </Box>

      {/* Eligible Countries */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937" }}>
            In which countries are you eligible to work in?
          </Typography>
          <IconButton size="small" sx={{ p: 0 }}>
            <Info size={16} color="#9ca3af" />
          </IconButton>
        </Box>
        <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 2 }}>
          You can select multiple countries you have the legal right to work in
        </Typography>
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
                  placeholder="Select countries"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.9375rem",
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
                    deleteIcon={<X size={14} weight="bold" />}
                    sx={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      borderRadius: "12px",
                      "& .MuiChip-deleteIcon": {
                        color: "#1e40af",
                      },
                    }}
                  />
                ))
              }
            />
          )}
        />
      </Box>

      {/* Sponsorship */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Will you now or in the future require sponsorship for an employment visa?
        </Typography>
        <Controller
          name="requireSponsorship"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row>
              <FormControlLabel
                value="yes"
                control={<Radio sx={{ color: "#7c3aed", "&.Mui-checked": { color: "#7c3aed" } }} />}
                label="Yes"
                sx={{ mr: 4 }}
              />
              <FormControlLabel
                value="no"
                control={<Radio sx={{ color: "#7c3aed", "&.Mui-checked": { color: "#7c3aed" } }} />}
                label="No"
              />
            </RadioGroup>
          )}
        />
      </Box>

      {/* Nationality */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          What is your nationality?
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 2 }}>
          You can select up to 3
        </Typography>
        <Controller
          name="nationality"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={countryOptions}
              value={value || []}
              onChange={(_, newValue) => onChange(newValue.slice(0, 3))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: "0.9375rem",
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
                    deleteIcon={<X size={14} weight="bold" />}
                    sx={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      borderRadius: "12px",
                      "& .MuiChip-deleteIcon": {
                        color: "#1e40af",
                      },
                    }}
                  />
                ))
              }
            />
          )}
        />
      </Box>

      {/* Salary */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937" }}>
            What is your current (or previous) <span style={{ fontStyle: "italic" }}>yearly</span> salary?
          </Typography>
          <IconButton size="small" sx={{ p: 0 }}>
            <Info size={16} color="#9ca3af" />
          </IconButton>
        </Box>
        <Controller
          name="currentSalary"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="$"
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                },
              }}
            />
          )}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937" }}>
            What is your expected <span style={{ fontStyle: "italic" }}>yearly</span> salary for a fulltime position?
          </Typography>
          <IconButton size="small" sx={{ p: 0 }}>
            <Info size={16} color="#9ca3af" />
          </IconButton>
        </Box>
        <Controller
          name="expectedSalary"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="$"
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                },
              }}
            />
          )}
        />
      </Box>

      {/* LinkedIn */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Enter your LinkedIn profile link
        </Typography>
        <Controller
          name="linkedInProfile"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="https://linkedin.com"
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                },
              }}
            />
          )}
        />
        <Button
          variant="text"
          sx={{
            color: "#7c3aed",
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            mt: 0.5,
            p: 0,
            minWidth: "auto",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          + I don't use linkedin
        </Button>
      </Box>

      {/* Experience Summary */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Experience Summary
        </Typography>
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
              rows={5}
              error={Boolean(errors.experienceSummary)}
              helperText={errors.experienceSummary?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                },
              }}
            />
          )}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            {experienceSummary?.length || 0}/500
          </Typography>
        </Box>
      </Box>

      {/* Additional Screening Questions */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
          Additional Screening Questions
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 2 }}>
          Add any other relevant context that would help answer employer questions or anything additional relevant information that can help your applications to be more complete
        </Typography>
        <Controller
          name="screeningQuestions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder=""
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                },
              }}
            />
          )}
        />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={onBack}
          disabled={isUploading}
          startIcon={<ArrowLeft size={20} weight="bold" />}
          sx={{
            borderRadius: "8px",
            py: 1.5,
            px: 3,
            textTransform: "none",
            fontSize: "0.9375rem",
            fontWeight: 600,
            border: "1px solid #d1d5db",
            color: "#374151",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "transparent",
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
          disabled={isUploading}
          endIcon={<ArrowRight size={20} weight="bold" />}
          sx={{
            borderRadius: "8px",
            py: 1.5,
            px: 3,
            textTransform: "none",
            fontSize: "0.9375rem",
            fontWeight: 600,
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            boxShadow: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
              boxShadow: "none",
              },
        "&:disabled": {
          background: "#d1d5db",
        },
      }}
    >
      Next: Field Configuration
    </Button>
  </Box>
</Box>
  )
}