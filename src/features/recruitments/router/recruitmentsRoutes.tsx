import { ROLES } from "@/features/auth/constants/roles";
import { RecruitmentsListPage } from "../pages/RecruitmentsListPage";
import { ProfileUpPage } from "../pages/ProfileUpPage";
import { RecruitmentDetailPage } from "../pages/RecruitmentDetailPage";
import { RecruitmentsListBase } from "../components/shared/RecruitmentsListBase";

export const recruitmentsRoutes = [
  {
    path: '/recruitments',
    element: <RecruitmentsListPage />,
    roles: [ROLES.USER]
  },
  {
    path: '/recruitments-pending',
    element: <RecruitmentsListBase 
      title="Reclutamientos Pendientes" 
      description="Revisa aquí los procesos de reclutamiento pendientes." 
      statusFilter="PENDIENTE,OBSERVACIÓN" 
    />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/recruitments-on-process',
    element: <RecruitmentsListBase 
      title="Reclutamientos en Proceso" 
      description="Revisa aquí los procesos de reclutamiento en curso." 
      statusFilter="EN PROCESO,VERIFICACIÓN" 
    />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/recruitments-terminated',
    element: <RecruitmentsListBase 
      title="Reclutamientos Terminados" 
      description="Revisa aquí los procesos de reclutamiento completados." 
      statusFilter="TERMINADO" 
    />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER]
  },
  {
    path: '/recruitments/create',
    element: <RecruitmentsListPage />,
    roles: [ROLES.USER]
  },
  {
    path: '/profile-up',
    element: <ProfileUpPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.USER]
  },
  {
    path: '/recruitments/:id',
    element: <RecruitmentDetailPage />,
    roles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.USER]
  },
];