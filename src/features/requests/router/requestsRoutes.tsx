import { RequestsListPage } from "../pages/RequestsListPage";
import { RequestsCreationPage } from "../pages/RequestsCreationPage";
import { ROLES } from "@/features/auth/constants/roles";

export const requestsRoutes = [
  {
    path: '/requests',
    element: <RequestsListPage />,
    roles: [ROLES.USER]
  },
  {
    path: '/requests-pending',
    element: <RequestsListPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-on-process',
    element: <RequestsListPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-terminated',
    element: <RequestsListPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests/create',
    element: <RequestsCreationPage />,
    roles: [ROLES.USER]
  }
];