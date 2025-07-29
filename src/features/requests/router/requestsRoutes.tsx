import { RequestsListPage, PendingRequestsListPage, OnProcessRequestsListPage, TerminatedRequestsListPage, RequestsCreationPage, RequestDetailPage } from "../pages";
import { ROLES } from "@/features/auth/constants/roles";

export const requestsRoutes = [
  {
    path: '/requests',
    element: <RequestsListPage />,
    roles: [ROLES.USER]
  },
  {
    path: '/requests-pending',
    element: <PendingRequestsListPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-on-process',
    element: <OnProcessRequestsListPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-terminated',
    element: <TerminatedRequestsListPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests/create',
    element: <RequestsCreationPage />,
    roles: [ROLES.USER]
  },
  {
    path: '/requests/detail/:id',
    element: <RequestDetailPage />,
    roles: [ROLES.USER, ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-pending/detail/:id',
    element: <RequestDetailPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-on-process/detail/:id',
    element: <RequestDetailPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/requests-terminated/detail/:id',
    element: <RequestDetailPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  }
];