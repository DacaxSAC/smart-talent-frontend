import { ROLES } from "@/features/auth/constants/roles";
import { ListUsersPage } from "../pages/ListUsersPage";

export const billingRoutes = [
  {
    path: '/billing-history',
    element: <ListUsersPage />,
    roles: [ROLES.ADMIN]
  }
];