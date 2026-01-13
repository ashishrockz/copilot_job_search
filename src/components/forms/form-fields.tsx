import * as React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Chip,
  Box,
  Typography,
} from "@mui/material";

// Text Input Field Component
interface TextFieldControllerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  error?: any;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function TextFieldController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  error,
  required = false,
  multiline = false,
  rows = 1,
  disabled = false,
  startIcon,
  endIcon,
}: TextFieldControllerProps<T>): React.JSX.Element {
  return (
    <FormControl fullWidth error={Boolean(error)}>
      <FormLabel className="mb-2 font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type={type}
            placeholder={placeholder}
            variant="outlined"
            multiline={multiline}
            rows={rows}
            disabled={disabled}
            error={Boolean(error)}
            helperText={error?.message}
            InputProps={{
              startAdornment: startIcon,
              endAdornment: endIcon,
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
  );
}

// Toggle Button Group Field Component
interface ToggleButtonOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleButtonFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: ToggleButtonOption[];
  error?: any;
  required?: boolean;
  disabled?: boolean;
}

export function ToggleButtonField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  required = false,
  disabled = false,
}: ToggleButtonFieldProps<T>): React.JSX.Element {
  return (
    <FormControl fullWidth error={Boolean(error)}>
      <FormLabel className="mb-2 font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Box>
            <ToggleButtonGroup
              {...field}
              exclusive
              disabled={disabled}
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
                  "&.Mui-disabled": {
                    border: "1px solid #f3f4f6",
                  },
                },
              }}
            >
              {options.map((option) => (
                <ToggleButton key={option.value} value={option.value}>
                  {option.icon && (
                    <Box className="mr-2 flex items-center">{option.icon}</Box>
                  )}
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {error && (
              <FormHelperText error>{error.message}</FormHelperText>
            )}
          </Box>
        )}
      />
    </FormControl>
  );
}

// Autocomplete Single Select Field Component
interface AutocompleteSingleFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: string[];
  placeholder?: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export function AutocompleteSingleField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = "Type or select",
  error,
  required = false,
  disabled = false,
  helperText,
}: AutocompleteSingleFieldProps<T>): React.JSX.Element {
  return (
    <FormControl fullWidth error={Boolean(error)}>
      <FormLabel className="mb-2 font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            options={options}
            value={value || null}
            disabled={disabled}
            onChange={(_, newValue) => onChange(newValue || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={Boolean(error)}
                helperText={error?.message || helperText}
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
  );
}

// Autocomplete Multiple Select Field Component
interface AutocompleteMultipleFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: string[];
  placeholder?: string;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  chipColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  showIcon?: React.ReactNode;
}

export function AutocompleteMultipleField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = "Type or select",
  error,
  required = false,
  disabled = false,
  chipColor = "primary",
  showIcon,
}: AutocompleteMultipleFieldProps<T>): React.JSX.Element {
  const chipColorMap = {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-purple-100 text-purple-700",
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <FormControl fullWidth error={Boolean(error)}>
      <FormLabel className="mb-2 font-semibold text-gray-900">
        {showIcon && (
          <Box className="inline-flex items-center gap-2">
            {showIcon}
            {label}
          </Box>
        )}
        {!showIcon && label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            multiple
            options={options}
            value={value || []}
            disabled={disabled}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={Boolean(error)}
                helperText={error?.message}
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
                  className={chipColorMap[chipColor]}
                />
              ))
            }
          />
        )}
      />
    </FormControl>
  );
}

// Location Fields (Country + City) Component
interface LocationFieldsProps<T extends FieldValues> {
  countryName: Path<T>;
  cityName: Path<T>;
  control: Control<T>;
  countryOptions: string[];
  countryError?: any;
  cityError?: any;
  required?: boolean;
  disabled?: boolean;
}

export function LocationFields<T extends FieldValues>({
  countryName,
  cityName,
  control,
  countryOptions,
  countryError,
  cityError,
  required = false,
  disabled = false,
}: LocationFieldsProps<T>): React.JSX.Element {
  return (
    <Box>
      <FormLabel className="mb-2 font-semibold text-gray-900">
        Location:
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <FormControl fullWidth error={Boolean(countryError)}>
          <Typography variant="caption" className="mb-1 text-gray-600">
            Country
          </Typography>
          <Controller
            name={countryName}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={countryOptions}
                value={value || null}
                disabled={disabled}
                onChange={(_, newValue) => onChange(newValue || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type or select"
                    error={Boolean(countryError)}
                    helperText={countryError?.message}
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
        <FormControl fullWidth error={Boolean(cityError)}>
          <Typography variant="caption" className="mb-1 text-gray-600">
            City
          </Typography>
          <Controller
            name={cityName}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="e.g. Los Angeles, California"
                variant="outlined"
                disabled={disabled}
                error={Boolean(cityError)}
                helperText={cityError?.message}
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
  );
}
