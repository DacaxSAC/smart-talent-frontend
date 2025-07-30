import { useHasRole } from "@/features/auth/hooks/useUser";
import { RequestsListBase } from "../components/shared/RequestsListBase";
import { ROLES } from "@/features/auth/constants/roles";

/**
 * Página de solicitudes en proceso
 * Muestra solicitudes con estado IN_PROGRESS
 */
export function OnProcessRequestsListPage() {
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  return (
    <RequestsListBase
      title="SOLICITUDES EN PROCESO"
      description="Visualiza las solicitudes que están siendo procesadas actualmente."
      statusFilter="IN_PROGRESS,OBSERVED"
      isOnlyUser={isRecruiter}
      showAddButton={false}
    />
  );
}