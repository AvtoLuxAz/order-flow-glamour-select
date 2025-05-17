import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

// Lazy load components
const TemplateList = lazy(() => import("./components/TemplateList"));
const TemplateForm = lazy(() => import("./components/TemplateForm"));
const TemplateDetails = lazy(() => import("./components/TemplateDetails"));

export const templateRoutes: RouteObject[] = [
  {
    path: "templates",
    children: [
      {
        index: true,
        element: <TemplateList />,
      },
      {
        path: "new",
        element: <TemplateForm />,
      },
      {
        path: ":id",
        element: <TemplateDetails />,
      },
      {
        path: ":id/edit",
        element: <TemplateForm />,
      },
    ],
  },
];
