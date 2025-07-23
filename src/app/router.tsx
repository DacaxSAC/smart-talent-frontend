import App from "./App";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { authRoutes } from "../features/auth/router/authRoutes";
import { usersRoutes } from "@/features/users/router/usersRoutes";
import { requestsRoutes } from "@/features/requests/router/requestsRoutes";
import { LayoutAuth } from "../features/auth/components/shared/LayoutAuth";
import { ProtectedAuthRoutes } from "../features/auth/router/protetedRoutes";
import { ProtectedRoute } from "../shared/routes/ProtectedRoutes";
import { NotFoundPage } from "../errors/pages/NotFoundPage";
import { ROLES } from "@/features/auth/constants/roles";
import { recruitmentsRoutes } from "@/features/recruitments/router/recruitmentsRoutes";
import { billingRoutes } from "@/features/billing/router/billingRoutes";

/**
 * Configuración del router principal de la aplicación
 * 
 * Estructura:
 * 1. Rutas de autenticación (públicas) - /login, /recovery-password, /reset-password
 * 2. Rutas protegidas (requieren autenticación) - todas las demás rutas
 * 3. Ruta 404 para páginas no encontradas
 * 
 * Nota: Se usa createBrowserRouter para URLs limpias sin hash (#)
 */

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

const protectedUsersRoutes = applyRouteProtection(usersRoutes);
const protectedRequestsRoutes = applyRouteProtection(requestsRoutes);
const protectedRecruitmentsRoutes = applyRouteProtection(recruitmentsRoutes);
const protectedBillingRoutes = applyRouteProtection(billingRoutes);

export const router = createBrowserRouter([
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
      ...protectedUsersRoutes,
      ...protectedRequestsRoutes,
      ...protectedRecruitmentsRoutes,
      ...protectedBillingRoutes,
      {
        path: "/",
        element: (
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.USER, ROLES.RECRUITER]}>
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
