import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import { route as authRoute } from "@/routes/auth/auth";
import { route as copilotRoute } from "@/routes/copilot";
import { NotFoundPage } from "@/pages/not-found";
import { applicationRoute } from "@/routes/application";
import { toolsRoute } from "@/routes/tools";
import { careerRoute } from "@/routes/careet";
import { supportRoute } from "@/routes/support";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  authRoute,
  applicationRoute,
  toolsRoute,
  careerRoute,
  supportRoute,
  copilotRoute,
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
