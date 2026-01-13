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
} from "@mui/material";
import { MapPin, ArrowRight } from "@phosphor-icons/react";

/* ---------------- SCHEMA ---------------- */

const schema = zod.object({
  currentJobTitle: zod.string().min(1, "Current job title is required"),
  yearsOfExperience: zod.string().min(1, "Years of experience is required"),
  managingTeamMembers: zod.string().min(1, "Select team size"),
  scope: zod.string().min(1, "Select scope"),
  industrySector: zod.array(zod.string()).min(1, "Select at least one industry"),
  country: zod.string().min(1, "Country is required"),
  city: zod.string().optional(),
  targetJobTitle: zod.string().min(1, "Target job title is required"),
  targetIndustrySector: zod.array(zod.string()).min(1, "Select target industry"),
  languageToUse: zod.string().min(1, "Language is required"),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
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

/* ---------------- OPTIONS ---------------- */

const teamSizeOptions = ["no", "1-4", "5-10", "10+"];
const scopeOptions = ["national", "regional", "global"];
const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Consulting",
];
const countryOptions = ["United States", "India", "Germany", "UK", "Canada"];
const languageOptions = ["English", "Spanish", "German", "French", "Hindi"];

/* ---------------- PAGE ---------------- */

export function Page(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (values: Values) => {
    setIsPending(true);
    try {
      console.log("Career Profile:", values);
      // await api.saveCareerProfile(values)
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* CURRENT JOB */}
      <FormControl fullWidth error={!!errors.currentJobTitle}>
        <FormLabel>Current job title</FormLabel>
        <Controller
          name="currentJobTitle"
          control={control}
          render={({ field }) => (
            <TextField {...field} helperText={errors.currentJobTitle?.message} />
          )}
        />
      </FormControl>

      {/* EXPERIENCE */}
      <FormControl fullWidth error={!!errors.yearsOfExperience}>
        <FormLabel>Years of experience</FormLabel>
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <TextField {...field} helperText={errors.yearsOfExperience?.message} />
          )}
        />
      </FormControl>

      {/* TEAM SIZE */}
      <FormControl error={!!errors.managingTeamMembers}>
        <FormLabel>Managing team members</FormLabel>
        <Controller
          name="managingTeamMembers"
          control={control}
          render={({ field }) => (
            <>
              <ToggleButtonGroup
                {...field}
                exclusive
                onChange={(_, v) => v && field.onChange(v)}
              >
                {teamSizeOptions.map((v) => (
                  <ToggleButton key={v} value={v}>
                    {v}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <FormHelperText>{errors.managingTeamMembers?.message}</FormHelperText>
            </>
          )}
        />
      </FormControl>

      {/* SCOPE */}
      <FormControl error={!!errors.scope}>
        <FormLabel>Scope</FormLabel>
        <Controller
          name="scope"
          control={control}
          render={({ field }) => (
            <>
              <ToggleButtonGroup
                {...field}
                exclusive
                onChange={(_, v) => v && field.onChange(v)}
              >
                {scopeOptions.map((v) => (
                  <ToggleButton key={v} value={v}>
                    {v}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <FormHelperText>{errors.scope?.message}</FormHelperText>
            </>
          )}
        />
      </FormControl>

      {/* CURRENT INDUSTRY */}
      <FormControl error={!!errors.industrySector}>
        <FormLabel>Industry / Sector</FormLabel>
        <Controller
          name="industrySector"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={industryOptions}
              value={field.value}
              onChange={(_, v) => field.onChange(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={errors.industrySector?.message}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
            />
          )}
        />
      </FormControl>

      {/* LOCATION */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormControl error={!!errors.country}>
          <FormLabel>Country</FormLabel>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={countryOptions}
                value={field.value || null}
                onChange={(_, v) => field.onChange(v || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errors.country?.message}
                  />
                )}
              />
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel>City</FormLabel>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                InputProps={{
                  endAdornment: <MapPin size={18} />,
                }}
              />
            )}
          />
        </FormControl>
      </Box>

      {/* TARGET JOB */}
      <FormControl error={!!errors.targetJobTitle}>
        <FormLabel>Target job title</FormLabel>
        <Controller
          name="targetJobTitle"
          control={control}
          render={({ field }) => (
            <TextField {...field} helperText={errors.targetJobTitle?.message} />
          )}
        />
      </FormControl>

      {/* TARGET INDUSTRY */}
      <FormControl error={!!errors.targetIndustrySector}>
        <FormLabel>Target industry / sector</FormLabel>
        <Controller
          name="targetIndustrySector"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={industryOptions}
              value={field.value}
              onChange={(_, v) => field.onChange(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={errors.targetIndustrySector?.message}
                />
              )}
            />
          )}
        />
      </FormControl>

      {/* LANGUAGE */}
      <FormControl error={!!errors.languageToUse}>
        <FormLabel>Language to use</FormLabel>
        <Controller
          name="languageToUse"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={languageOptions}
              value={field.value || null}
              onChange={(_, v) => field.onChange(v || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={errors.languageToUse?.message}
                />
              )}
            />
          )}
        />
      </FormControl>

      {/* SUBMIT */}
      <Button
        type="submit"
        size="large"
        variant="contained"
        disabled={!isValid || isPending}
        endIcon={<ArrowRight size={20} />}
      >
        {isPending ? "Processing..." : "Continue"}
      </Button>
    </Box>
  );
}
