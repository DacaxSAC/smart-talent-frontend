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
  isOnlyUser?: boolean;
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
  isOnlyUser = false,
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
  const [ownerFilter, setOwnerFilter] = useState<string>("");
  const [showOwnerDropdown, setShowOwnerDropdown] = useState<boolean>(false);
  const [availableOwners, setAvailableOwners] = useState<string[]>([]);

  /**
   * Obtiene las solicitudes con el filtro de estado especificado
   */
  const handleGetRequests = async () => {
    try {
      setLoading(true);

      const data = isAdmin || isRecruiter
        ? await RequestsService.getAllPeople(statusFilter, isOnlyUser ? user?.id : undefined) 
        : await RequestsService.getAllPeopleByEntityId(user?.entityId as number);
      setRequests(data.people);
      
      // Extraer owners únicos para el filtro
      if (isAdmin) {
        const uniqueOwners = [...new Set(data.people.map(request => request.owner).filter(Boolean))] as string[];
        setAvailableOwners(uniqueOwners);
      }

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
    const statusOrder = { 'OBSERVED': 0, 'PENDING': 1, 'IN_PROGRESS': 2, 'COMPLETED': 3, 'REJECTED': 4 };
    
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

    // Filtro por propietario (solo para admins)
    if (ownerFilter.trim() && isAdmin) {
      filtered = filtered.filter(request => request.owner === ownerFilter);
    }

    // Ordenar las solicitudes filtradas
    filtered = sortRequests(filtered);
    
    setFilteredRequests(filtered);
  };

  /**
   * Maneja la selección de un owner del dropdown
   */
  const handleOwnerSelect = (owner: string) => {
    setOwnerFilter(owner);
    setShowOwnerDropdown(false);
  };

  /**
   * Maneja el cambio en el input de owner
   */
  const handleOwnerInputChange = (value: string) => {
    setOwnerFilter(value);
    setShowOwnerDropdown(value.length > 0);
  };

  /**
   * Filtra los owners disponibles basado en el input
   */
  const getFilteredOwners = () => {
    if (!ownerFilter.trim()) return availableOwners;
    return availableOwners.filter(owner => 
      owner.toLowerCase().includes(ownerFilter.toLowerCase())
    );
  };

  /**
   * Reinicia todos los filtros
   */
  const handleResetFilters = () => {
    setStatusFilterLocal("all");
    setSearchFilter("");
    setOwnerFilter("");
    setShowOwnerDropdown(false);
  };

  useEffect(() => { handleGetRequests(); }, [statusFilter]);
  useEffect(() => { applyFilters(); }, [requests, statusFilterLocal, searchFilter, ownerFilter]);

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
          {isUser && <div className="flex flex-col gap-2">
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
                <option value="IN_PROGRESS">En proceso</option>
                <option value="COMPLETED">Completado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
            </div>
          </div>}

          {/* Filtro por propietario (solo para admins) */}
          {isAdmin && <div className="flex flex-col gap-2 relative">
            <label htmlFor="owner-filter" className="text-medium">Filtrar por propietario:</label>
            <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
              <input
                id="owner-filter"
                type="text"
                value={ownerFilter}
                onChange={(e) => handleOwnerInputChange(e.target.value)}
                onFocus={() => setShowOwnerDropdown(ownerFilter.length > 0)}
                onBlur={() => setTimeout(() => setShowOwnerDropdown(false), 200)}
                placeholder="Seleccione un propietario"
                className="w-full"
              />
            </div>
            {showOwnerDropdown && getFilteredOwners().length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-white-1 rounded-[8px] shadow-lg max-h-40 overflow-y-auto">
                {getFilteredOwners().map((owner, index) => (
                  <div
                    key={index}
                    onClick={() => handleOwnerSelect(owner)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-medium"
                  >
                    {owner}
                  </div>
                ))}
              </div>
            )}
          </div>}

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
