import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects unauthenticated users to login page
 */
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated) {
    return <></>;
  }

  return <>{children}</>;
}
