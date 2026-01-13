import * as React from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";

export const careerRoute: RouteObject = {
  path: "career",
  element: (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
  children: [{
            index: true,
            lazy: async () => {
                const { Page } = await import("@/pages/main/career/details");
                return { Component: Page };
            },
        },

  ],
};
