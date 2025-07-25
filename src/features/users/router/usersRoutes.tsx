import { ROLES } from "@/features/auth/constants/roles";
import { CreateUserPage } from "../pages/CreateUserPage";
import { ListUsersPage } from "../pages/ListUsersPage";
import { DetailUserPage } from "../pages/DetailUserPage";

export const usersRoutes = [
  {
    path: '/users',
    element: <ListUsersPage />,
  },
  {
    path: '/users/create',
    element: <CreateUserPage />,
    roles: [ROLES.ADMIN]
  },{
    path: '/users/detail/:id',
    element: <DetailUserPage />,
    roles: [ROLES.ADMIN]
  }
];