import { ROLES } from "@/features/auth/constants/roles";
import { CreateUserPage } from "../pages/CreateUserPage";
import { ListUsersPage } from "../pages/ListUsersPage";

export const recruitmentsRoutes = [
  {
    path: '/recruitments',
    element: <ListUsersPage />,
    roles: [ROLES.USER]
  },
  {
    path: '/recruitments-pending',
    element: <ListUsersPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/recruitments-on-process',
    element: <ListUsersPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/recruitments-terminated',
    element: <ListUsersPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/recruitments/create',
    element: <CreateUserPage />,
    roles: [ROLES.USER]
  }
];