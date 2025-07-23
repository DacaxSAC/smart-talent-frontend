// React imports
import { Fragment, useEffect, useState } from "react";

// Feature imports
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Request, RequestsService } from "@/features/requests/services/requestsService";

// Component imports
import { OptionsDrawer } from "../components/private/list/OptionsDrawer";
import { RequestsTable } from "../components/private/list/RequestsTable";
import { LayoutPage } from "../../../shared/components/LayoutPage";
import { Button } from "../../../shared/components/Button";
import { NoData } from "@/shared/components/NoData";

// Store imports
import { useModalStore } from "@/shared/store/modalStore";

export function RequestsListPage() {
  // Hooks
  const { user } = useUser();
  const isAdmin = useHasRole(ROLES.ADMIN)
  const isUser = useHasRole(ROLES.USER)
  const { openRegisterRequestsDrawer, toggleRegisterRequestsDrawer, isActiveDrawerRegisterRequests } = useModalStore();

  // States
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleGetRequests = async () => {
    try {
      setLoading(true)

      const data = isAdmin
        ? await RequestsService.getAllPeople()
        : await RequestsService.getAllPeopleByEntityId(user?.entityId as number)
      setRequests(data.people);

      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => { handleGetRequests() }, []);

  return (
    <LayoutPage
      title="LISTA DE SOLICITUDES"
      description="Visualiza tus solicitudes, su estado y los informes requeridos."
      buttonsHeader={
        <Fragment>
          <Button type="primary" show={isUser} handleClick={openRegisterRequestsDrawer} description="Agregar nueva solicitud" />
        </Fragment>
      }
    >
      <Fragment>
        {requests.length === 0 ?
          <NoData />
          : 
          <RequestsTable 
          data={requests} 
          isLoading={loading} 
          isError={error} 
          loadingText="Cargando solicitudes..."
          errorText="Error al cargar las solicitudes, por favor recargue la página."
          onRefresh={handleGetRequests}
        />}
        <OptionsDrawer
          isActive={isActiveDrawerRegisterRequests}
          handleActive={toggleRegisterRequestsDrawer}
        />
      </Fragment>
    </LayoutPage>
  )
}
