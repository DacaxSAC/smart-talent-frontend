import { Fragment, useEffect, useState } from "react";
import { useModalStore } from "@/shared/store/modalStore";
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Request, requestsService } from "../services/requestsService";
import { OptionsModal } from "../components/private/list/OptionsModal";
import { RequestsTable } from "../components/private/list/RequestsTable";
import { LayoutPage } from "./LayoutPage";
import { Button } from "./Button";

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
        ? await requestsService.getAllPeople()
        : await requestsService.getAllPeopleByEntityId(user?.entityId as number)
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
          <Button show={isUser} handleClick={openRegisterRequestsDrawer} description="Agregar nueva solicitud" />
        </Fragment>
      }
    >
      <Fragment>
        <RequestsTable 
          data={requests} 
          isLoading={loading} 
          isError={error} 
          loadingText="Cargando solicitudes..."
          errorText="Error al cargar las solicitudes, por favor recargue la página."
        />
        <OptionsModal
          isActive={isActiveDrawerRegisterRequests}
          handleActive={toggleRegisterRequestsDrawer}
        />
      </Fragment>
    </LayoutPage>
  )
}
