import { useHasRole } from "@/features/auth/hooks/useUser";
import { RequestsListBase } from "../components/shared/RequestsListBase";
import { ROLES } from "@/features/auth/constants/roles";

/**
 * Página de solicitudes terminadas
 * Muestra solicitudes con estados COMPLETED y REJECTED
 */
export function TerminatedRequestsListPage() {
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  return (
    <RequestsListBase
      title="SOLICITUDES TERMINADAS"
      description="Visualiza las solicitudes que han sido completadas o rechazadas."
      statusFilter="COMPLETED,REJECTED"
      isOnlyUser={isRecruiter}
      showAddButton={false}
    />
  );
}