import { ROLES } from "@/features/auth/constants/roles";
import { CreateUserPage } from "../pages/CreateUserPage";
import { ListUsersPage } from "../pages/ListUsersPage";
import { UpdateUserPage } from "../pages/UpdateUserPage";

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
    path: '/users/edit/:id',
    element: <UpdateUserPage />,
    roles: [ROLES.ADMIN]
  }
];