import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Only redirect after loading is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      navigate("/auth/signin", {
        state: { returnUrl: location?.pathname },
        replace: true,
      });
    }
  }, [loading, isAuthenticated, navigate, location?.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return <></>
  }

  return <>{children}</>;
}
