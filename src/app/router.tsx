import App from "./App";
import { createBrowserRouter, createHashRouter, Outlet } from "react-router-dom";
import { authRoutes } from "../features/auth/router/authRoutes";
import { userRoutes } from "@/features/users/router/userRoutes";
import { requestsRoutes } from "@/features/requests/router/requestsRoutes";
import { LayoutAuth } from "../features/auth/components/shared/LayoutAuth";
import { ProtectedAuthRoutes } from "../features/auth/router/protetedRoutes";
import { ProtectedRoute } from "../shared/routes/ProtectedRoutes";
import { NotFoundPage } from "../errors/pages/NotFoundPage";
import { ROLES } from "@/features/auth/constants/roles";

// Define proper types for route and roles
type Role = string;
type RouteConfig = {
  element: React.ReactNode;
  roles?: Role[];
  [key: string]: any;
};

const withRoleProtection = (element: React.ReactNode, roles?: Role[]) => (
  <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
);

const applyRouteProtection = (routes: RouteConfig[]) =>
  routes.map((route) => ({
    ...route,
    element: route.roles
      ? withRoleProtection(route.element, route.roles)
      : route.element,
  }));

const protectedUserRoutes = applyRouteProtection(userRoutes);
const protectedRequestsRoutes = applyRouteProtection(requestsRoutes);

export const router = createHashRouter([
  {
    element: (
      <ProtectedAuthRoutes>
        <LayoutAuth>
          <Outlet />
        </LayoutAuth>
      </ProtectedAuthRoutes>
    ),
    children: authRoutes,
  },
  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      ...protectedUserRoutes,
      ...protectedRequestsRoutes,
      {
        path: "/",
        element: (
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.USER]}>
            <></>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/*",
    element: <NotFoundPage />,
  },
]);
