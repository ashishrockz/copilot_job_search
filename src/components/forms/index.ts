/**
 * Form Components Export
 *
 * This file exports all reusable form components, schemas, and types
 * for easy importing across the application.
 */

// Complete Form Component
export {
  CareerProfileForm,
  type CareerProfileFormValues,
  defaultCareerProfileValues,
  careerProfileSchema,
  teamSizeOptions,
  scopeOptions,
  industryOptions,
  countryOptions,
  languageOptions,
} from "./career-profile-form";

// Individual Form Field Components
export {
  TextFieldController,
  ToggleButtonField,
  AutocompleteSingleField,
  AutocompleteMultipleField,
  LocationFields,
} from "./form-fields";

// Types and Constants
export {
  type CareerProfileFormValues as CareerFormValues,
  TEAM_SIZE_OPTIONS,
  SCOPE_OPTIONS,
  INDUSTRY_OPTIONS,
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/types/forms";
