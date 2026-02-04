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
  IconButton,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Grid,
  FormHelperText,
} from "@mui/material";
import {
  ArrowRightIcon as ArrowRight,
  ArrowLeftIcon as ArrowLeft,
  UploadSimpleIcon as UploadSimple,
  XIcon as X,
  FilePdfIcon as FilePdf,
  FileDocIcon as FileDoc,
  CheckCircleIcon as CheckCircle,
  PlusIcon as Plus,
  UserIcon as User,
  MapPinIcon as MapPin,
  BriefcaseIcon as Briefcase,
  CurrencyDollarIcon as CurrencyDollar,
  LinkedinLogoIcon as LinkedinLogo,
  GlobeIcon as Globe,
  FileTextIcon as FileText,
} from "@phosphor-icons/react";
import { Step3Data } from "@/context/copilot-form-context";

// Zod validation schema - matches Step3Data interface
const step3Schema = zod.object({
  cvLink: zod.string().min(1, { message: "Please upload your CV/Resume" }),
  phoneNumber: zod.string().optional(),
  coverLetter: zod.string().optional(),
  currentLocation: zod.string().min(1, { message: "Current location is required" }),
  stateRegion: zod.string().optional(),
  postCode: zod.string().optional(),
  currentJobTitle: zod.string().optional(),
  availability: zod.string().min(1, { message: "Please select your availability" }),
  eligibleCountries: zod.array(zod.string()),
  futureLanguages: zod.array(zod.string()),
  nationality: zod.array(zod.string()),
  currentSalary: zod.string().optional(),
  expectedSalary: zod.string().optional(),
  expectedSalaryFullTime: zod.string().optional(),
  expectedSalaryPartTime: zod.string().optional(),
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

const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Hindi",
  "Portuguese",
  "Japanese",
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

// Form Label Component
const StyledLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
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
    {required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
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

export function CopilotStep3Form({ defaultValues, onNext, onBack }: CopilotStep3FormProps): React.JSX.Element {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [coverLetterType, setCoverLetterType] = React.useState<"generate" | "upload">("generate");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<Step3FormValues>({
    defaultValues: {
      cvLink: defaultValues?.cvLink || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      coverLetter: defaultValues?.coverLetter || "",
      currentLocation: defaultValues?.currentLocation || "",
      stateRegion: defaultValues?.stateRegion || "",
      postCode: defaultValues?.postCode || "",
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

  const experienceSummary = watch("experienceSummary");

  const uploadResumeToAPI = async (file: File): Promise<string> => {
    // Simulated upload - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `https://storage.example.com/resumes/${file.name}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setFileError("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    setFileError("");
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      const resumeUrl = await uploadResumeToAPI(file);
      setValue("cvLink", resumeUrl);
      setUploadSuccess(true);
      trigger("cvLink");
    } catch (error) {
      setFileError("Failed to upload resume. Please try again.");
      setUploadedFile(null);
      setValue("cvLink", "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadSuccess(false);
    setValue("cvLink", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <FilePdf size={24} weight="duotone" style={{ color: "#ef4444" }} />;
    }
    return <FileDoc size={24} weight="duotone" style={{ color: "#2563eb" }} />;
  };

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
          Your Profile Information
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Help employers learn more about you
        </Typography>
      </Box>

      {/* Resume Section */}
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
          icon={<FileText size={22} weight="duotone" />}
          title="Resume & Cover Letter"
          subtitle="Upload your CV and choose cover letter option"
          color="#7c3aed"
        />

        {/* CV Upload */}
        <Box sx={{ mb: 3 }}>
          <StyledLabel required>CV / Resume</StyledLabel>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            disabled={isUploading}
          />

          {!uploadedFile ? (
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                p: 3,
                border: "2px dashed #d1d5db",
                borderRadius: "12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#7c3aed",
                  backgroundColor: "#f5f3ff",
                },
              }}
            >
              {isUploading ? (
                <CircularProgress size={24} sx={{ color: "#7c3aed" }} />
              ) : (
                <>
                  <UploadSimple size={32} weight="duotone" style={{ color: "#7c3aed", marginBottom: 8 }} />
                  <Typography sx={{ fontWeight: 500, color: "#374151", mb: 0.5 }}>
                    Click to upload your CV
                  </Typography>
                  <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280" }}>
                    PDF or Word document (max 10MB)
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                backgroundColor: "#f9fafb",
              }}
            >
              {getFileIcon(uploadedFile.name)}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#1f2937",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {uploadedFile.name}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
              {uploadSuccess && (
                <CheckCircle size={20} weight="fill" style={{ color: "#10b981" }} />
              )}
              <IconButton size="small" onClick={handleRemoveFile} sx={{ p: 0.5 }}>
                <X size={18} />
              </IconButton>
            </Box>
          )}
          {(fileError || errors.cvLink) && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              {fileError || errors.cvLink?.message}
            </FormHelperText>
          )}
        </Box>

        {/* Cover Letter */}
        <Box>
          <StyledLabel>Cover Letter</StyledLabel>
          <Grid container spacing={2}>
            {[
              { value: "generate", label: "Generate tailored", icon: <Plus size={18} /> },
              { value: "upload", label: "Upload my own", icon: <UploadSimple size={18} /> },
            ].map((option) => (
              <Grid size={{ xs: 12, sm: 6 }} key={option.value}>
                <Box
                  onClick={() => setCoverLetterType(option.value as "generate" | "upload")}
                  sx={{
                    p: 2,
                    borderRadius: "10px",
                    border: "2px solid",
                    borderColor: coverLetterType === option.value ? "#7c3aed" : "#e5e7eb",
                    backgroundColor: coverLetterType === option.value ? "#f5f3ff" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: coverLetterType === option.value ? "#7c3aed" : "#d1d5db",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: coverLetterType === option.value ? "#7c3aed" : "#6b7280",
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: coverLetterType === option.value ? "#7c3aed" : "#374151",
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* Contact & Location Section */}
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
          icon={<MapPin size={22} weight="duotone" />}
          title="Contact & Location"
          subtitle="Your contact details and current location"
          color="#10b981"
        />

        <Grid container spacing={3}>
          {/* Phone Number */}
          <Grid size={12}>
            <StyledLabel>Phone Number</StyledLabel>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    select
                    defaultValue="+1"
                    slotProps={{ select: { native: true } }}
                    size="small"
                    sx={{
                      width: 100,
                      ...textFieldSx,
                    }}
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                    <option value="+49">+49</option>
                  </TextField>
                  <TextField
                    {...field}
                    placeholder="Enter phone number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={textFieldSx}
                  />
                </Box>
              )}
            />
          </Grid>

          {/* Current Location */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel required>Country</StyledLabel>
            <Controller
              name="currentLocation"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={countryOptions}
                  value={value || null}
                  onChange={(_, newValue) => onChange(newValue || "")}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select country"
                      error={Boolean(errors.currentLocation)}
                      helperText={errors.currentLocation?.message}
                      sx={textFieldSx}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* State/Region */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>State / Region</StyledLabel>
            <Controller
              name="stateRegion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. California"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          {/* Post Code */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Post Code</StyledLabel>
            <Controller
              name="postCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. 90210"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          {/* LinkedIn */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>LinkedIn Profile</StyledLabel>
            <Controller
              name="linkedInProfile"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="https://linkedin.com/in/..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <LinkedinLogo size={18} style={{ marginRight: 8, color: "#0a66c2" }} />
                      ),
                    },
                  }}
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Work Eligibility Section */}
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
          title="Work Eligibility"
          subtitle="Countries where you can legally work"
          color="#f59e0b"
        />

        <Grid container spacing={3}>
          {/* Eligible Countries */}
          <Grid size={12}>
            <StyledLabel>Countries you're eligible to work in</StyledLabel>
            <Controller
              name="eligibleCountries"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={countryOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select countries"
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
              )}
            />
          </Grid>

          {/* Nationality */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Nationality (up to 3)</StyledLabel>
            <Controller
              name="nationality"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={countryOptions}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue.slice(0, 3))}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select nationality"
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
                        }}
                      />
                    ))
                  }
                />
              )}
            />
          </Grid>

          {/* Languages */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Languages</StyledLabel>
            <Controller
              name="futureLanguages"
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
        </Grid>
      </Paper>

      {/* Professional Info Section */}
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
          title="Professional Information"
          subtitle="Your current role and availability"
          color="#6366f1"
        />

        <Grid container spacing={3}>
          {/* Current Job Title */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Current / Previous Job Title</StyledLabel>
            <Controller
              name="currentJobTitle"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. Software Engineer"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          {/* Availability */}
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel required>Availability / Notice Period</StyledLabel>
            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {availabilityOptions.map((option) => {
                      const isSelected = field.value === option.value;
                      return (
                        <Chip
                          key={option.value}
                          label={option.label}
                          onClick={() => field.onChange(option.value)}
                          sx={{
                            borderRadius: "16px",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            ...(isSelected
                              ? {
                                  backgroundColor: "#6366f1",
                                  color: "white",
                                  "&:hover": { backgroundColor: "#4f46e5" },
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
                  {errors.availability && (
                    <FormHelperText error sx={{ mt: 0.5 }}>
                      {errors.availability.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Salary Section */}
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
          icon={<CurrencyDollar size={22} weight="duotone" />}
          title="Salary Information"
          subtitle="Your current and expected compensation"
          color="#10b981"
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Current Yearly Salary</StyledLabel>
            <Controller
              name="currentSalary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. $80,000"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Expected Yearly Salary</StyledLabel>
            <Controller
              name="expectedSalary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. $100,000"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Expected Salary (Full-time)</StyledLabel>
            <Controller
              name="expectedSalaryFullTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. $100,000"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <StyledLabel>Expected Salary (Part-time)</StyledLabel>
            <Controller
              name="expectedSalaryPartTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g. $50/hour"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Experience Summary Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 4,
        }}
      >
        <SectionHeader
          icon={<User size={22} weight="duotone" />}
          title="About You"
          subtitle="Tell employers about your experience"
          color="#8b5cf6"
        />

        {/* Experience Summary */}
        <Box sx={{ mb: 3 }}>
          <StyledLabel required>Experience Summary</StyledLabel>
          <Controller
            name="experienceSummary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Brief summary of your professional experience, skills, and achievements..."
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={Boolean(errors.experienceSummary)}
                helperText={errors.experienceSummary?.message}
                sx={textFieldSx}
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
        <Box>
          <StyledLabel>Additional Information</StyledLabel>
          <Typography sx={{ fontSize: "0.8125rem", color: "#6b7280", mb: 1.5 }}>
            Any other relevant context to help answer employer questions
          </Typography>
          <Controller
            name="screeningQuestions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. Certifications, special skills, or preferences..."
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                sx={textFieldSx}
              />
            )}
          />
        </Box>
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={onBack}
          disabled={isUploading}
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
          disabled={isUploading}
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
            "&:disabled": {
              background: "#e5e7eb",
              color: "#9ca3af",
              boxShadow: "none",
            },
            transition: "all 0.2s ease",
          }}
        >
          Next: Configuration
        </Button>
      </Box>
    </Box>
  );
}
