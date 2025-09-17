// React imports
import { Fragment, useEffect, useState } from "react";

// Feature imports
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Recruitment, RecruitmentsService } from "@/features/recruitments/services/recruitmentsService";

// Component imports
import { LayoutPage } from "../../../../shared/components/LayoutPage";
import { Button } from "../../../../shared/components/Button";
import { RecruitmentsTable } from "../private/list/RecruitmentsTable";
import { RecruitmentTypeModal } from "../RecruitmentTypeModal";

// Store imports
import { useModalStore } from "@/shared/store/modalStore";

interface RecruitmentsListBaseProps {
  title: string;
  description: string;
  statusFilter?: string;
  showAddButton?: boolean;
  isOnlyUser?: boolean;
}

/**
 * Componente base reutilizable para las páginas de listas de reclutamientos
 * @param title - Título de la página
 * @param description - Descripción de la página
 * @param statusFilter - Filtro de estados para los reclutamientos (ej: 'PENDIENTE,OBSERVACIÓN')
 * @param showAddButton - Si mostrar el botón de agregar nuevo reclutamiento
 */
export function RecruitmentsListBase({ 
  title, 
  description, 
  statusFilter, 
  isOnlyUser = false,
  showAddButton = false 
}: RecruitmentsListBaseProps) {
  // Hooks
  const { user } = useUser();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  const isUser = useHasRole(ROLES.USER);
  const { setIsActiveDrawerRegisterRequests, openRecruitmentTypeModal } = useModalStore();

  // States
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [filteredRecruitments, setFilteredRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilterLocal, setStatusFilterLocal] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  /**
   * Obtiene los reclutamientos con el filtro de estado especificado
   */
  const handleGetRecruitments = async () => {
    try {
      setLoading(true);

      const data = isAdmin || isRecruiter
        ? await RecruitmentsService.getAllRecruitments(statusFilter) 
        : await RecruitmentsService.getRecruitmentsByEntityId(user?.entityId as number);
      
      setRecruitments(data.recruitments);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  /**
   * Ordena los reclutamientos por estado y fecha de creación
   */
  const sortRecruitments = (recruitmentsToSort: Recruitment[]) => {
    const statusOrder = { 'PENDIENTE': 0, 'OBSERVACIÓN': 1, 'EN PROCESO': 2, 'VERIFICACIÓN': 3, 'TERMINADO': 4 };
    
    return recruitmentsToSort.sort((a, b) => {
      const statusA = statusOrder[a.state as keyof typeof statusOrder] ?? 999;
      const statusB = statusOrder[b.state as keyof typeof statusOrder] ?? 999;
      
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
   * Aplica los filtros locales a los reclutamientos
   */
  const applyFilters = () => {
    let filtered = [...recruitments];

    // Filtro por estado
    if (statusFilterLocal !== "all") {
      filtered = filtered.filter(recruitment => recruitment.state === statusFilterLocal);
    }

    // Filtro por búsqueda (descripción o tipo)
    if (searchFilter) {
      filtered = filtered.filter(recruitment => 
        recruitment.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        recruitment.type.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter(recruitment => recruitment.type === typeFilter);
    }

    const sortedFiltered = sortRecruitments(filtered);
    setFilteredRecruitments(sortedFiltered);
  };

  /**
   * Abre el drawer para registrar nuevo reclutamiento
   */
  const openRegisterRecruitmentsDrawer = () => {
    setIsActiveDrawerRegisterRequests(true);
  };

  /**
   * Maneja la selección del tipo de reclutamiento
   */
  const handleRecruitmentTypeSelection = (type: string) => {
    console.log('Tipo de reclutamiento seleccionado:', type);
    // Aquí se puede manejar la lógica específica según el tipo
    openRegisterRecruitmentsDrawer();
  };

  // Effects
  useEffect(() => { 
    handleGetRecruitments(); 
  }, [statusFilter]);
  
  useEffect(() => { 
    applyFilters(); 
  }, [recruitments, statusFilterLocal, searchFilter, typeFilter]);

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
              handleClick={openRecruitmentTypeModal} 
              description="Agregar nuevo reclutamiento" 
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
                <option value="PENDIENTE">Pendiente</option>
                <option value="OBSERVACIÓN">Observación</option>
                <option value="EN PROCESO">En proceso</option>
                <option value="VERIFICACIÓN">Verificación</option>
                <option value="TERMINADO">Terminado</option>
              </select>
            </div>
          </div>}

          {/* Filtro por tipo */}
          <div className="flex flex-col gap-2">
            <label htmlFor="type-filter" className="text-medium">Filtrar por tipo:</label>
            <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full"
              >
                <option value="">Todos</option>
                <option value="RECLUTAMIENTO REGULAR">Reclutamiento Regular</option>
                <option value="HUNTING EJECUTIVO">Hunting Ejecutivo</option>
                <option value="RECLUTAMIENTO MASIVO">Reclutamiento Masivo</option>
              </select>
            </div>
          </div>

          {/* Filtro por búsqueda */}
          <div className="flex flex-col gap-2">
            <label htmlFor="search-filter" className="text-medium">Buscar:</label>
            <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
              <input
                id="search-filter"
                type="text"
                placeholder="Buscar por descripción o tipo..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
      }
    >
      <RecruitmentsTable 
        recruitments={filteredRecruitments}
        loading={loading}
        error={error}
        onRefresh={handleGetRecruitments}
      />
      
      {/* Modal de selección de tipo de reclutamiento */}
      <RecruitmentTypeModal 
        onSelectType={handleRecruitmentTypeSelection}
      />
    </LayoutPage>
  );
}