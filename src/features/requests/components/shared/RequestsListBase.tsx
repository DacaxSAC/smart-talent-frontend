// React imports
import { Fragment, useEffect, useState } from "react";

// Feature imports
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Request, RequestsService } from "@/features/requests/services/requestsService"

// Component imports
import { OptionsDrawer } from "../private/list/OptionsDrawer";
import { RequestsTable } from "../private/list/RequestsTable";
import { LayoutPage } from "../../../../shared/components/LayoutPage";
import { Button } from "../../../../shared/components/Button";

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
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  const isUser = useHasRole(ROLES.USER);
  const { openRegisterRequestsDrawer, toggleRegisterRequestsDrawer, isActiveDrawerRegisterRequests } = useModalStore();

  // States
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilterLocal, setStatusFilterLocal] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  /**
   * Obtiene las solicitudes con el filtro de estado especificado
   */
  const handleGetRequests = async () => {
    try {
      setLoading(true);

      const data = isAdmin || isRecruiter
        ? await RequestsService.getAllPeople(statusFilter)
        : await RequestsService.getAllPeopleByEntityId(user?.entityId as number);
      setRequests(data.people);

      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  /**
   * Ordena las solicitudes por estado y fecha de creación
   */
  const sortRequests = (requestsToSort: Request[]) => {
    const statusOrder = { 'OBSERVED': 0, 'PENDING': 1, 'COMPLETED': 2, 'REJECTED': 3 };
    
    return requestsToSort.sort((a, b) => {
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 999;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 999;
      
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      
      // Ordenar por fecha de creación (más reciente primero)
      const dateA = new Date(a.createdAt || '').getTime();
      const dateB = new Date(b.createdAt || '').getTime();
      return dateB - dateA;
    });
  };

  /**
   * Aplica los filtros a las solicitudes
   */
  const applyFilters = () => {
    let filtered = [...requests];

    // Filtro por estado
    if (statusFilterLocal !== "all") {
      filtered = filtered.filter(request => request.status === statusFilterLocal);
    }

    // Filtro por búsqueda (nombre o DNI)
    if (searchFilter.trim()) {
      const searchTerm = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(request => 
        request.fullname.toLowerCase().includes(searchTerm) ||
        request.dni.includes(searchTerm)
      );
    }

    // Ordenar las solicitudes filtradas
    filtered = sortRequests(filtered);
    
    setFilteredRequests(filtered);
  };

  /**
   * Reinicia todos los filtros
   */
  const handleResetFilters = () => {
    setStatusFilterLocal("all");
    setSearchFilter("");
  };

  useEffect(() => { handleGetRequests(); }, [statusFilter]);
  useEffect(() => { applyFilters(); }, [requests, statusFilterLocal, searchFilter]);

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
      sectionFilters={
        <div className="flex flex-wrap justify-start gap-6 p-4 rounded text-[14px]">
          {/* Filtro por estado */}
          <div className="flex flex-col gap-2">
            <label htmlFor="status-filter" className="text-medium">Filtrar por estado:</label>
            <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
              <select
                id="status-filter"
                value={statusFilterLocal}
                onChange={(e) => setStatusFilterLocal(e.target.value)}
                className="w-full"
              >
                <option value="all">Todos</option>
                <option value="OBSERVED">Observado</option>
                <option value="PENDING">Pendiente</option>
                <option value="COMPLETED">Completado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
            </div>
          </div>

          {/* Búsqueda por nombre o DNI */}
          <div className="flex flex-col gap-2">
            <label htmlFor="search-filter" className="text-medium">Buscar por nombre o DNI:</label>
            <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
              <input
                id="search-filter"
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Ingrese nombre o DNI"
                className="w-full"
              />
            </div>
          </div>

          {/* Botón para reiniciar filtros */}
          <div className="flex flex-col justify-end gap-2">
            <div className="px-2 py-1 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium">
              <button onClick={handleResetFilters} className="w-full cursor-pointer">Reiniciar filtros</button>
            </div>
          </div>
        </div>
      }
    >
      <Fragment>
          <RequestsTable 
            data={filteredRequests} 
            isLoading={loading} 
            isError={error} 
            loadingText="Cargando solicitudes..."
            errorText="Error al cargar las solicitudes, por favor recargue la página."
            onRefresh={handleGetRequests}
          />
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
