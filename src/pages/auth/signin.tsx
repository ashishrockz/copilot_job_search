import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Fade,
  Zoom,
} from "@mui/material";
import {
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  CheckIcon as Check,
  LockKeyIcon as Lock,
  EnvelopeIcon as Envelope,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { setAccessToken, setRefreshToken } from "@/lib/local-storage";
import { login } from "@/lib/auth.service";

// Zod validation schema
const schema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),

  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must not exceed 64 characters" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" }),
});
export type Values = zod.infer<typeof schema>;

const defaultValues = { email: "", password: "" } satisfies Values;

export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<Values>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const email = watch("email");
  const password = watch("password");

  const handleGoogleSignIn = () => {
    console.log("Google sign in");
  };
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        const response = await login(values);
        console.log("response", response);
        setAccessToken(response?.data?.access_token);
        setRefreshToken(response?.data?.refresh_token);
        if (response.success) {
          navigate("/copilot");
        } else {
          switch (response?.message) {
            case "Not Found":
              setError("root", {
                type: "server",
                message: "Invalid credentials. Please try again.",
              });
              break;
            default:
              setError("root", {
                type: "server",
                message: "Invalid credentials. Please try again.",
              });
          }
        }
      } catch (error) {
        setError("root", {
          type: "server",
          message: "An error occurred. Please try again.",
        });
      } finally {
        setIsPending(false);
      }
    },
    [setError, navigate]
  );
  const benefits = [
    {
      icon: <Check size={22} weight="bold" className="text-emerald-500" />,
      text: "One click apply using job copilot profile.",
    },
    {
      icon: <Check size={22} weight="bold" className="text-emerald-500" />,
      text: "Get relevant job recommendations.",
    },
    {
      icon: <Check size={22} weight="bold" className="text-emerald-500" />,
      text: "Showcase profile to top companies and consultants.",
    },
    {
      icon: <Check size={22} weight="bold" className="text-emerald-500" />,
      text: "Know application status on applied jobs.",
    },
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-1 md:py-12">
      <Container maxWidth="lg">
        <Fade in timeout={600}>
          <Box className="flex items-center justify-center mt-8">
            {/* Left Section - Benefits Card */}
            {!isMobile && (
              <Zoom in timeout={800}>
                <Paper
                  elevation={0}
                  className="flex-1 max-w-lg p-8 rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <Lock size={24} weight="bold" className="text-white" />
                    </div>
                    <Typography
                      variant="h5"
                      className="font-bold text-gray-800"
                    >
                      New to job copilot?
                    </Typography>
                  </div>

                  <Box className="flex flex-col gap-4 mb-6">
                    {benefits.map((benefit, index) => (
                      <Fade in timeout={1000 + index * 200} key={index}>
                        <Box className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/60 transition-all duration-200 group">
                          <div className="mt-0.5 transform group-hover:scale-110 transition-transform duration-200">
                            {benefit.icon}
                          </div>
                          <Typography
                            variant="body1"
                            className="text-gray-700 leading-relaxed"
                          >
                            {benefit.text}
                          </Typography>
                        </Box>
                      </Fade>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate("/auth/signup")}
                    className="w-full py-3.5 text-base font-semibold normal-case rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5568d3 0%, #6a4193 100%)",
                      },
                    }}
                  >
                    Register for Free
                  </Button>
                </Paper>
              </Zoom>
            )}

            {/* Right Section - Login Form */}
            <Zoom in timeout={isMobile ? 600 : 1000}>
              <Paper
                elevation={0}
                className="flex-1 max-w-lg p-8 md:p-10 rounded-2xl bg-white border border-gray-200 shadow-xl w-full"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <Envelope size={20} weight="bold" className="text-white" />
                  </div>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    Login
                  </Typography>
                </div>

                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="flex flex-col gap-6"
                >
                  {/* Email Field */}
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)} fullWidth>
                        <InputLabel className="font-medium">
                          Email ID
                        </InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Email ID"
                          type="text"
                          placeholder="Enter your email"
                          className="rounded-xl transition-all duration-200"
                          sx={{
                            bgcolor: "white",
                            "& fieldset": {
                              borderColor: "#e5e7eb",
                              borderWidth: "2px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#3b82f6",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                              borderWidth: "2px",
                            },
                          }}
                        />
                        {errors.email && (
                          <FormHelperText className="ml-1 text-sm">
                            {errors.email.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

                  {/* Password Field */}
                  <Box>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <FormControl error={Boolean(errors.password)} fullWidth>
                          <InputLabel className="font-medium">
                            Password
                          </InputLabel>
                          <OutlinedInput
                            {...field}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="rounded-xl transition-all duration-200"
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                  className="hover:bg-gray-100 transition-colors duration-200"
                                >
                                  {showPassword ? (
                                    <EyeSlash
                                      size={20}
                                      className="text-gray-600"
                                    />
                                  ) : (
                                    <Eye size={20} className="text-gray-600" />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            sx={{
                              bgcolor: "white",
                              "& fieldset": {
                                borderColor: "#e5e7eb",
                                borderWidth: "2px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#3b82f6",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#3b82f6",
                                borderWidth: "2px",
                              },
                            }}
                          />
                          {errors.password && (
                            <FormHelperText className="ml-1 text-sm">
                              {errors.password.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                    <Box className="text-right mt-2">
                      <Link
                        href="#"
                        underline="hover"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        Forgot Password?
                      </Link>
                    </Box>
                  </Box>

                  {/* Server Error Alert */}
                  {errors.root && (
                    <Fade in>
                      <Alert severity="error" className="rounded-xl">
                        {errors.root.message}
                      </Alert>
                    </Fade>
                  )}

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isPending || !email || !password || !isValid}
                    className="py-4 text-base font-semibold normal-case rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                    sx={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      },
                      "&:disabled": {
                        background: "#e5e7eb",
                        color: "#9ca3af",
                      },
                    }}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <Divider className="my-2">
                    <Typography
                      variant="body2"
                      className="text-gray-500 font-medium"
                    >
                      Or continue with
                    </Typography>
                  </Divider>

                  {/* Google Sign-in Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleGoogleSignIn}
                    type="button"
                    disabled={isPending}
                    startIcon={
                      <Box
                        component="img"
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%234285F4' d='M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z'/%3E%3Cpath fill='%2334A853' d='M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z'/%3E%3Cpath fill='%23FBBC05' d='M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z'/%3E%3Cpath fill='%23EA4335' d='M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z'/%3E%3C/svg%3E"
                        alt="Google"
                        className="w-5 h-5"
                      />
                    }
                    className="py-3.5 text-base font-medium normal-case rounded-xl border-2 transition-all duration-300 hover:shadow-md"
                    sx={{
                      borderColor: "#e5e7eb",
                      color: "#374151",
                      "&:hover": {
                        borderColor: "#3b82f6",
                        bgcolor: "rgba(59, 130, 246, 0.04)",
                      },
                      "&:disabled": {
                        borderColor: "#e5e7eb",
                        color: "#9ca3af",
                      },
                    }}
                  >
                    Sign in with Google
                  </Button>

                  {/* Mobile Register Link */}
                  {isMobile && (
                    <Box className="text-center mt-4 pt-4 border-t border-gray-200">
                      <Typography variant="body2" className="text-gray-600">
                        Don't have an account?{" "}
                        <Link
                          onClick={() => navigate("/auth/signup")}
                          className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer transition-colors duration-200"
                        >
                          Register for Free
                        </Link>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Zoom>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
