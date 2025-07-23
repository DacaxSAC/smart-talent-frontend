import { RequestsListBase } from "../components/shared/RequestsListBase";

/**
 * Página de solicitudes 
 */
export function RequestsListPage() {
  return (
    <RequestsListBase
      title="LISTA DE SOLICITUDES"
      description="Visualiza tus solicitudes, su estado y los informes requeridos."
      statusFilter=""
      showAddButton={true}
    />
  );
}