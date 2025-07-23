import { RequestsListBase } from "../components/shared/RequestsListBase";

/**
 * Página de solicitudes en proceso
 * Muestra solicitudes con estado IN_PROGRESS
 */
export function OnProcessRequestsListPage() {
  return (
    <RequestsListBase
      title="SOLICITUDES EN PROCESO"
      description="Visualiza las solicitudes que están siendo procesadas actualmente."
      statusFilter="IN_PROGRESS,OBSERVED"
      showAddButton={false}
    />
  );
}