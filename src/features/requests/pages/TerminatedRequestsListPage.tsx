import { RequestsListBase } from "../components/shared/RequestsListBase";

/**
 * Página de solicitudes terminadas
 * Muestra solicitudes con estados COMPLETED y REJECTED
 */
export function TerminatedRequestsListPage() {
  return (
    <RequestsListBase
      title="SOLICITUDES TERMINADAS"
      description="Visualiza las solicitudes que han sido completadas o rechazadas."
      statusFilter="COMPLETED,REJECTED"
      showAddButton={false}
    />
  );
}