import { RequestsListBase } from "../components/shared/RequestsListBase";

/**
 * Página de solicitudes pendientes
 * Muestra solicitudes con estados OBSERVED y PENDING
 */
export function PendingRequestsListPage() {
  return (
    <RequestsListBase
      title="SOLICITUDES PENDIENTES"
      description="Visualiza tus solicitudes, su estado y los informes requeridos."
      statusFilter="OBSERVED,PENDING"
      showAddButton={true}
    />
  );
}
