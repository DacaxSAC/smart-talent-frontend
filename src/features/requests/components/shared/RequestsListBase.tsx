// React imports
import { Fragment, useEffect, useState } from "react";

// Feature imports
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Request, RequestsService } from "@/features/requests/services/requestsService";

// Component imports
import { OptionsDrawer } from "../private/list/OptionsDrawer";
import { RequestsTable } from "../private/list/RequestsTable";
import { LayoutPage } from "../../../../shared/components/LayoutPage";
import { Button } from "../../../../shared/components/Button";
import { NoData } from "@/shared/components/NoData";

// Store imports
import { useModalStore } from "@/shared/store/modalStore";

interface RequestsListBaseProps {
  title: string;
  description: string;
  statusFilter?: string;
  showAddButton?: boolean;
}

/**
 * Componente base reutilizable para las páginas de listas de solicitudes
 * @param title - Título de la página
 * @param description - Descripción de la página
 * @param statusFilter - Filtro de estados para las solicitudes (ej: 'PENDING,OBSERVED')
 * @param showAddButton - Si mostrar el botón de agregar nueva solicitud
 */
export function RequestsListBase({ 
  title, 
  description, 
  statusFilter, 
  showAddButton = false 
}: RequestsListBaseProps) {
  // Hooks
  const { user } = useUser();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isUser = useHasRole(ROLES.USER);
  const { openRegisterRequestsDrawer, toggleRegisterRequestsDrawer, isActiveDrawerRegisterRequests } = useModalStore();

  // States
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /**
   * Obtiene las solicitudes con el filtro de estado especificado
   */
  const handleGetRequests = async () => {
    try {
      setLoading(true);

      const data = isAdmin
        ? await RequestsService.getAllPeople(statusFilter)
        : await RequestsService.getAllPeopleByEntityId(user?.entityId as number);
      setRequests(data.people);

      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => { handleGetRequests(); }, [statusFilter]);

  return (
    <LayoutPage
      title={title}
      description={description}
      buttonsHeader={
        showAddButton ? (
          <Fragment>
            <Button 
              type="primary" 
              show={isUser} 
              handleClick={openRegisterRequestsDrawer} 
              description="Agregar nueva solicitud" 
            />
          </Fragment>
        ) : undefined
      }
    >
      <Fragment>
        {requests.length === 0 ? (
          <NoData />
        ) : (
          <RequestsTable 
            data={requests} 
            isLoading={loading} 
            isError={error} 
            loadingText="Cargando solicitudes..."
            errorText="Error al cargar las solicitudes, por favor recargue la página."
            onRefresh={handleGetRequests}
          />
        )}
        {showAddButton && (
          <OptionsDrawer
            isActive={isActiveDrawerRegisterRequests}
            handleActive={toggleRegisterRequestsDrawer}
          />
        )}
      </Fragment>
    </LayoutPage>
  );
}