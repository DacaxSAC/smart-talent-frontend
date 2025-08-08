import { ROLES } from "@/features/auth/constants/roles";
import { ResquestsHistoryPage } from "../pages/RequestsHistoryPage";
import { RecruitmentsHistoryPage } from "../pages/RecruitmentsHistoryPage";

export const billingRoutes = [
  {
    path: '/requests-history',
    element: <ResquestsHistoryPage />,
    roles: [ROLES.ADMIN, ROLES.USER]
  },
  {
    path: '/recruitments-history',
    element: <RecruitmentsHistoryPage />,
    roles: [ROLES.ADMIN, ROLES.USER]
  }
];