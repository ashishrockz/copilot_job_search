import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Chip,
  Autocomplete,
  FormLabel,
  CircularProgress,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
} from "@mui/material";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckCircleIcon as CheckCircle,
  BriefcaseIcon as Briefcase,
  MagnifyingGlassIcon as MagnifyingGlass,
  GlobeIcon as Globe,
  BuildingsIcon as Buildings,
  UserIcon as User,
  ClockIcon as Clock,
  TranslateIcon as Translate,
  CaretDownIcon as CaretDown,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { createCopilot } from "@/lib/copilot.service";
import {
  getCountries,
  getJobTitles,
  getTimezones,
  getLanguages,
} from "@/lib/reference-data.service";
import { LocationSelectorModal } from "@/components/modals/location-selector-modal";
import { OnsiteLocationSelectorModal } from "@/components/modals/onsite-location-selector-modal";

// Combined Zod schema for all fields
const createCopilotSchema = zod.object({
  // Work Location
  enableRemote: zod.boolean(),
  enableOnsite: zod.boolean(),
  remoteLocations: zod.array(zod.string()).optional(),
  onsiteLocations: zod.array(zod.string()).optional(),

  // Job Types & Search
  jobTypes: zod.array(zod.string()).min(1, { message: "Select at least one job type" }),
  searchMethod: zod.enum(["keywords", "favorite", "applied"]),
  jobTitles: zod.array(zod.string()).optional(),

  // Filters
  jobMatchEnabled: zod.boolean().optional(),
  jobMatchLevel: zod.enum(["high", "higher", "highest"]).optional(),
  seniority: zod.array(zod.string()).optional(),
  timeZones: zod.array(zod.string()).optional(),
  includeFlexibleTimeZone: zod.boolean().optional(),
  industries: zod.array(zod.string()).optional(),
  jobDescriptionLanguages: zod.array(zod.string()).optional(),
  locationRadius: zod.string().optional(),
  includeKeywords: zod.array(zod.string()).optional(),
  excludeKeywords: zod.array(zod.string()).optional(),
  excludeCompanies: zod.array(zod.string()).optional(),

  // Profile
  cvLink: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  coverLetter: zod.string().optional(),
  currentLocation: zod.string().optional(),
  currentJobTitle: zod.string().optional(),
  availability: zod.string().optional(),
  eligibleCountries: zod.array(zod.string()).optional(),
  futureLanguages: zod.array(zod.string()).optional(),
  nationality: zod.array(zod.string()).optional(),
  currentSalary: zod.string().optional(),
  expectedSalary: zod.string().optional(),
  expectedSalaryFullTime: zod.string().optional(),
  expectedSalaryPartTime: zod.string().optional(),
  linkedInProfile: zod.string().optional(),
  experienceSummary: zod.string().optional(),
  screeningQuestions: zod.string().optional(),
  stateRegion: zod.string().optional(),
  postCode: zod.string().optional(),

  // Configuration
  applicationMode: zod.enum(["auto-save", "full-auto"]),
  writingStyle: zod.string().optional(),
}).refine(
  (data) => data.enableRemote || data.enableOnsite,
  {
    message: "Please enable at least one work location type",
    path: ["enableRemote"],
  }
).refine(
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

type CreateCopilotFormValues = zod.infer<typeof createCopilotSchema>;

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
    "&.Mui-focused fieldset": { borderColor: "#7c3aed", borderWidth: "1px" },
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
    fontSize: "0.875rem",
    "&.Mui-focused": { color: "#7c3aed" },
  },
};

const jobTypeOptions = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contractor", label: "Contractor" },
  { value: "internship", label: "Internship" },
];

const seniorityOptions = ["Entry Level", "Associate", "Mid-Senior", "Director+"];
const industryOptions = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail"];

export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const [isPending, setIsPending] = React.useState(false);

  // Modal state
  const [locationModalOpen, setLocationModalOpen] = React.useState<"remote" | "onsite" | null>(null);

  // API data state
  const [countries, setCountries] = React.useState<string[]>([]);
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = React.useState<string[]>([]);
  const [loadingData, setLoadingData] = React.useState({
    countries: false,
    timezones: false,
    languages: false,
    jobTitles: false,
  });

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateCopilotFormValues>({
    defaultValues: {
      enableRemote: false,
      enableOnsite: false,
      remoteLocations: [],
      onsiteLocations: [],
      jobTypes: [],
      searchMethod: "keywords",
      jobTitles: [],
      jobMatchEnabled: true,
      jobMatchLevel: "high",
      seniority: [],
      timeZones: [],
      includeFlexibleTimeZone: true,
      industries: [],
      jobDescriptionLanguages: [],
      locationRadius: "",
      includeKeywords: [],
      excludeKeywords: [],
      excludeCompanies: [],
      cvLink: "",
      phoneNumber: "",
      coverLetter: "",
      currentLocation: "",
      currentJobTitle: "",
      availability: "",
      eligibleCountries: [],
      futureLanguages: [],
      nationality: [],
      currentSalary: "",
      expectedSalary: "",
      expectedSalaryFullTime: "",
      expectedSalaryPartTime: "",
      linkedInProfile: "",
      experienceSummary: "",
      screeningQuestions: "",
      stateRegion: "",
      postCode: "",
      applicationMode: "auto-save",
      writingStyle: "",
    },
    resolver: zodResolver(createCopilotSchema),
  });

  const enableRemote = watch("enableRemote");
  const enableOnsite = watch("enableOnsite");
  const searchMethod = watch("searchMethod");
  const remoteLocations = watch("remoteLocations");
  const onsiteLocations = watch("onsiteLocations");

  // Auto-add "Worldwide" when remote is enabled
  React.useEffect(() => {
    if (enableRemote && (!remoteLocations || remoteLocations.length === 0)) {
      setValue("remoteLocations", ["Worldwide"]);
    }
  }, [enableRemote, remoteLocations, setValue]);

  // Load data on mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(prev => ({ ...prev, countries: true }));
        const countriesRes = await getCountries();
        if (countriesRes.success && countriesRes.data) {
          setCountries(["Worldwide", ...countriesRes.data.map(c => c.name)]);
        }
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoadingData(prev => ({ ...prev, countries: false }));
      }

      try {
        setLoadingData(prev => ({ ...prev, timezones: true }));
        const timezonesRes = await getTimezones();
        if (timezonesRes.success && timezonesRes.data) {
          setTimezones(timezonesRes.data.map(tz => tz.display_name || tz.name));
        }
      } catch (error) {
        console.error("Error loading timezones:", error);
      } finally {
        setLoadingData(prev => ({ ...prev, timezones: false }));
      }

      try {
        setLoadingData(prev => ({ ...prev, languages: true }));
        const languagesRes = await getLanguages();
        if (languagesRes.success && languagesRes.data) {
          setLanguages(languagesRes.data.map(lang => lang.name));
        }
      } catch (error) {
        console.error("Error loading languages:", error);
      } finally {
        setLoadingData(prev => ({ ...prev, languages: false }));
      }

      try {
        setLoadingData(prev => ({ ...prev, jobTitles: true }));
        const jobTitlesRes = await getJobTitles();
        if (jobTitlesRes.success && jobTitlesRes.data) {
          setJobTitleOptions(jobTitlesRes.data.map(jt => jt.title));
        }
      } catch (error) {
        console.error("Error loading job titles:", error);
      } finally {
        setLoadingData(prev => ({ ...prev, jobTitles: false }));
      }
    };

    loadData();
  }, []);

  const handleLocationModalSave = (locations: string[]) => {
    if (locationModalOpen === "remote") {
      setValue("remoteLocations", locations);
    } else if (locationModalOpen === "onsite") {
      setValue("onsiteLocations", locations);
    }
    setLocationModalOpen(null);
  };

  const onSubmit = async (data: CreateCopilotFormValues) => {
    setIsPending(true);

    try {
      // Transform data to match CopilotFormData structure
      const formData = {
        step1: {
          enableRemote: data.enableRemote,
          enableOnsite: data.enableOnsite,
          remoteLocations: data.remoteLocations || [],
          onsiteLocations: data.onsiteLocations || [],
          jobTypes: data.jobTypes,
          searchMethod: data.searchMethod,
          jobTitles: data.jobTitles || [],
        },
        step2: {
          jobMatchEnabled: data.jobMatchEnabled ?? true,
          jobMatchLevel: data.jobMatchLevel || "high",
          seniority: data.seniority || [],
          timeZones: data.timeZones || [],
          includeFlexibleTimeZone: data.includeFlexibleTimeZone ?? true,
          industries: data.industries || [],
          jobDescriptionLanguages: data.jobDescriptionLanguages || [],
          locationRadius: data.locationRadius || "",
          includeKeywords: data.includeKeywords || [],
          excludeKeywords: data.excludeKeywords || [],
          excludeCompanies: data.excludeCompanies || [],
        },
        step3: {
          cvLink: data.cvLink || "",
          phoneNumber: data.phoneNumber || "",
          coverLetter: data.coverLetter || "",
          currentLocation: data.currentLocation || "",
          currentJobTitle: data.currentJobTitle || "",
          availability: data.availability || "",
          eligibleCountries: data.eligibleCountries || [],
          futureLanguages: data.futureLanguages || [],
          nationality: data.nationality || [],
          currentSalary: data.currentSalary || "",
          expectedSalary: data.expectedSalary || "",
          expectedSalaryFullTime: data.expectedSalaryFullTime || "",
          expectedSalaryPartTime: data.expectedSalaryPartTime || "",
          linkedInProfile: data.linkedInProfile || "",
          experienceSummary: data.experienceSummary || "",
          screeningQuestions: data.screeningQuestions || "",
          stateRegion: data.stateRegion || "",
          postCode: data.postCode || "",
        },
        step4: {
          applicationMode: data.applicationMode,
          writingStyle: data.writingStyle || "",
        },
      };

      const result = await createCopilot(formData);

      if (result.success) {
        toast.success("Copilot created successfully!");
        navigate("/copilot");
      } else {
        toast.error(result.message || "Failed to create copilot");
      }
    } catch (error: any) {
      console.error("Error creating copilot:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate("/copilot")}
            startIcon={<ArrowLeft size={18} />}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              mb: 2,
              "&:hover": { backgroundColor: "transparent", color: "#475569" },
            }}
          >
            Back to Copilots
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 600, color: "#0f172a", mb: 1 }}>
            Add a new copilot
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Configure your AI-powered job search assistant
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
            {/* Left Column: Main Form */}
            <Box>
              {/* Work Location Section */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a", mb: 3 }}>
                  Work Location
                </Typography>

                {/* Remote Jobs Toggle */}
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="enableRemote"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#7c3aed" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#7c3aed",
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Globe size={20} style={{ color: "#7c3aed" }} />
                            <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                              Remote Jobs
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                  />

                  {enableRemote && (
                    <Box sx={{ mt: 2, ml: 5 }}>
                      <FormLabel sx={{ display: "block", mb: 1, fontSize: "0.8125rem", fontWeight: 500, color: "#475569" }}>
                        Preferred Regions
                      </FormLabel>
                      <Controller
                        name="remoteLocations"
                        control={control}
                        render={({ field: { value } }) => (
                          <Box
                            onClick={() => setLocationModalOpen("remote")}
                            sx={{
                              minHeight: 40,
                              p: 1,
                              pr: 1.5,
                              border: "1px solid #e2e8f0",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: "#fff",
                              "&:hover": {
                                borderColor: "#cbd5e1",
                                backgroundColor: "#f8f9fa",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flex: 1 }}>
                              {value && value.length > 0 ? (
                                value.map((location: string) => (
                                  <Chip
                                    key={location}
                                    label={location}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#ede9fe",
                                      color: "#7c3aed",
                                      fontWeight: 500,
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                                  Click to select locations
                                </Typography>
                              )}
                            </Box>
                            <CaretDown size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                          </Box>
                        )}
                      />
                    </Box>
                  )}
                </Box>

                {/* On-site / Hybrid Toggle */}
                <Box sx={{ mb: 2 }}>
                  <Controller
                    name="enableOnsite"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#7c3aed" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#7c3aed",
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Buildings size={20} style={{ color: "#7c3aed" }} />
                            <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                              On-site / Hybrid
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                  />

                  {enableOnsite && (
                    <Box sx={{ mt: 2, ml: 5 }}>
                      <FormLabel sx={{ display: "block", mb: 1, fontSize: "0.8125rem", fontWeight: 500, color: "#475569" }}>
                        Preferred Locations *
                      </FormLabel>
                      <Controller
                        name="onsiteLocations"
                        control={control}
                        render={({ field: { value } }) => (
                          <Box
                            onClick={() => setLocationModalOpen("onsite")}
                            sx={{
                              minHeight: 40,
                              p: 1,
                              pr: 1.5,
                              border: "1px solid #e2e8f0",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: "#fff",
                              "&:hover": {
                                borderColor: "#cbd5e1",
                                backgroundColor: "#f8f9fa",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flex: 1 }}>
                              {value && value.length > 0 ? (
                                value.map((location: string) => (
                                  <Chip
                                    key={location}
                                    label={location}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#ede9fe",
                                      color: "#7c3aed",
                                      fontWeight: 500,
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                                  Click to select locations
                                </Typography>
                              )}
                            </Box>
                            <CaretDown size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
                          </Box>
                        )}
                      />
                    </Box>
                  )}
                </Box>

                {errors.enableRemote && (
                  <FormHelperText error>{errors.enableRemote.message}</FormHelperText>
                )}
              </Paper>

              {/* Job Types & Search */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a", mb: 3 }}>
                  Job Types & Search
                </Typography>

                {/* Job Types */}
                <FormLabel required sx={{ display: "block", mb: 1.5, fontSize: "0.8125rem", fontWeight: 500, color: "#0f172a" }}>
                  Job Types
                </FormLabel>
                <Controller
                  name="jobTypes"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {jobTypeOptions.map((option) => {
                          const isSelected = value?.includes(option.value);
                          return (
                            <Chip
                              key={option.value}
                              label={option.label}
                              icon={<Briefcase size={16} />}
                              onClick={() => {
                                const newValue = isSelected
                                  ? value.filter((v) => v !== option.value)
                                  : [...(value || []), option.value];
                                onChange(newValue);
                              }}
                              sx={{
                                cursor: "pointer",
                                ...(isSelected
                                  ? {
                                      backgroundColor: "#7c3aed",
                                      color: "white",
                                      "&:hover": { backgroundColor: "#6d28d9" },
                                      "& .MuiChip-icon": { color: "white" },
                                    }
                                  : {
                                      backgroundColor: "#f1f5f9",
                                      color: "#475569",
                                      "&:hover": { backgroundColor: "#e2e8f0" },
                                    }),
                              }}
                            />
                          );
                        })}
                      </Box>
                      {errors.jobTypes && (
                        <FormHelperText error>{errors.jobTypes.message}</FormHelperText>
                      )}
                    </Box>
                  )}
                />

                {/* Search Method */}
                <FormLabel sx={{ display: "block", mb: 1.5, mt: 3, fontSize: "0.8125rem", fontWeight: 500, color: "#0f172a" }}>
                  Search Method
                </FormLabel>
                <Controller
                  name="searchMethod"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      value={field.value}
                      exclusive
                      onChange={(_, value) => value && field.onChange(value)}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    >
                      <ToggleButton value="keywords">Keywords</ToggleButton>
                      <ToggleButton value="favorite">Favorites</ToggleButton>
                      <ToggleButton value="applied">Applied</ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />

                {/* Job Titles - Show for keywords search */}
                {searchMethod === "keywords" && (
                  <Box>
                    <FormLabel sx={{ display: "block", mb: 1.5, fontSize: "0.8125rem", fontWeight: 500, color: "#0f172a" }}>
                      Job Titles (up to 5) *
                    </FormLabel>
                    <Controller
                      name="jobTitles"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        const currentCount = value?.length || 0;
                        const isMaxReached = currentCount >= 5;

                        return (
                          <Autocomplete
                            multiple
                            freeSolo
                            options={jobTitleOptions}
                            value={value || []}
                            onChange={(_, newValue) => {
                              if (newValue.length <= 5) onChange(newValue);
                            }}
                            loading={loadingData.jobTitles}
                            size="small"
                            filterOptions={(options, params) => {
                              const filtered = options.filter((option) =>
                                option.toLowerCase().includes(params.inputValue.toLowerCase())
                              );
                              return filtered;
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={isMaxReached ? "Maximum 5 titles reached - remove to add more" : "Search or type job titles (e.g., Software Engineer)"}
                                error={Boolean(errors.jobTitles)}
                                helperText={
                                  errors.jobTitles?.message ||
                                  `${currentCount}/5 selected`
                                }
                                sx={textFieldSx}
                                slotProps={{
                                  input: {
                                    ...params.InputProps,
                                    startAdornment: (
                                      <>
                                        <InputAdornment position="start">
                                          <MagnifyingGlass size={18} style={{ color: "#94a3b8" }} />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                      </>
                                    ),
                                    endAdornment: (
                                      <>
                                        {loadingData.jobTitles ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }
                                }}
                              />
                            )}
                            slotProps={{
                              chip: {
                                size: "small",
                                sx: { backgroundColor: "#fef3c7", color: "#92400e", fontWeight: 500 }
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </Box>
                )}
              </Paper>

              {/* Profile Information (Optional) */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a", mb: 3 }}>
                  Profile Information
                  <Typography component="span" sx={{ color: "#94a3b8", fontSize: "0.875rem", ml: 1 }}>
                    (Optional)
                  </Typography>
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <Controller
                    name="cvLink"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CV Link"
                        placeholder="https://..."
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <User size={18} style={{ color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        placeholder="+1234567890"
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                      />
                    )}
                  />

                  <Controller
                    name="currentJobTitle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Current Job Title"
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Briefcase size={18} style={{ color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="currentLocation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Current Location"
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Globe size={18} style={{ color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="linkedInProfile"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="LinkedIn Profile"
                      placeholder="https://linkedin.com/in/..."
                      size="small"
                      fullWidth
                      sx={{ ...textFieldSx, mt: 2 }}
                    />
                  )}
                />
              </Paper>

              {/* Additional Filters (Optional) */}
              <Paper elevation={0} sx={{ p: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a", mb: 3 }}>
                  Additional Filters
                  <Typography component="span" sx={{ color: "#94a3b8", fontSize: "0.875rem", ml: 1 }}>
                    (Optional)
                  </Typography>
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <Controller
                    name="timeZones"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={timezones}
                        value={value || []}
                        onChange={(_, newValue) => onChange(newValue)}
                        loading={loadingData.timezones}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Timezones"
                            placeholder="Select timezones"
                            sx={textFieldSx}
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <InputAdornment position="start">
                                      <Clock size={18} style={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }
                            }}
                          />
                        )}
                      />
                    )}
                  />

                  <Controller
                    name="jobDescriptionLanguages"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        multiple
                        options={languages}
                        value={value || []}
                        onChange={(_, newValue) => onChange(newValue)}
                        loading={loadingData.languages}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Job Languages"
                            placeholder="Select languages"
                            sx={textFieldSx}
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <InputAdornment position="start">
                                      <Translate size={18} style={{ color: "#94a3b8" }} />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </Box>
              </Paper>
            </Box>

            {/* Right Column: Configuration & Status */}
            <Box>
              {/* Configuration */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a", mb: 3 }}>
                  Configuration
                </Typography>

                <FormLabel required sx={{ display: "block", mb: 1.5, fontSize: "0.8125rem", fontWeight: 500, color: "#0f172a" }}>
                  Application Mode
                </FormLabel>
                <Controller
                  name="applicationMode"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      value={field.value}
                      exclusive
                      onChange={(_, value) => value && field.onChange(value)}
                      orientation="vertical"
                      fullWidth
                      size="small"
                    >
                      <ToggleButton value="auto-save" sx={{ justifyContent: "flex-start", textAlign: "left", py: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>Auto-Save</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                            Save applications for review
                          </Typography>
                        </Box>
                      </ToggleButton>
                      <ToggleButton value="full-auto" sx={{ justifyContent: "flex-start", textAlign: "left", py: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>Full Auto</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                            Apply automatically
                          </Typography>
                        </Box>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
              </Paper>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isPending}
                startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <CheckCircle size={20} weight="bold" />}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  backgroundColor: "#7c3aed",
                  "&:hover": {
                    backgroundColor: "#6d28d9",
                  },
                  "&:disabled": {
                    backgroundColor: "#cbd5e1",
                  },
                }}
              >
                {isPending ? "Creating..." : "Create Copilot"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Location Selector Modals */}
        <LocationSelectorModal
          open={locationModalOpen === "remote"}
          onClose={() => setLocationModalOpen(null)}
          onSave={handleLocationModalSave}
          initialSelections={remoteLocations || []}
          title="Filter the countries in which the remote jobs are posted"
          allowWorldwide={true}
        />

        <OnsiteLocationSelectorModal
          open={locationModalOpen === "onsite"}
          onClose={() => setLocationModalOpen(null)}
          onSave={handleLocationModalSave}
          initialSelections={onsiteLocations || []}
          title="Filter locations where you want to apply for jobs"
          availableCountries={countries.filter(c => c !== "Worldwide")}
        />
      </Container>
    </Box>
  );
}
