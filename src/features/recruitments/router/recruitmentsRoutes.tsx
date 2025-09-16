import { ROLES } from "@/features/auth/constants/roles";
import { CreateUserPage } from "../pages/CreateUserPage";
import { ListUsersPage } from "../pages/ListUsersPage";
import { ProfileUpPage } from "../pages/ProfileUpPage";

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
  },
  {
    path: '/profile-up',
    element: <ProfileUpPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.USER]
  },
];