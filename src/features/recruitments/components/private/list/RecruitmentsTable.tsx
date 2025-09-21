// React imports
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

// Feature imports
import { Recruitment, RecruitmentsService } from "@/features/recruitments/services/recruitmentsService";
import { useHasRole } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";

// Component imports
import { Loader } from "@/shared/components/Loader";
import { NoData } from "@/shared/components/NoData";
import { Button } from "@/shared/components/Button";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";

interface RecruitmentsTableProps {
  recruitments: Recruitment[];
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
}

/**
 * Componente tabla para mostrar la lista de reclutamientos
 */
export function RecruitmentsTable({ recruitments, loading, error, onRefresh }: RecruitmentsTableProps) {
  const navigate = useNavigate();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  const isUser = useHasRole(ROLES.USER);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recruitmentToDelete, setRecruitmentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Navega a la página de visualización del levantamiento del perfil
   */
  const handleViewDetails = (recruitmentId: number) => {
    navigate(`/recruitments/${recruitmentId}`);
  };

  /**
   * Maneja el clic en el botón eliminar
   */
  const handleDeleteClick = (id: number) => {
    setRecruitmentToDelete(id);
    setShowDeleteModal(true);
  };

  /**
   * Confirma la eliminación del reclutamiento
   */
  const handleConfirmDelete = async () => {
    if (!recruitmentToDelete) return;
    
    setIsDeleting(true);
    try {
      await RecruitmentsService.deleteRecruitment(recruitmentToDelete);
      setShowDeleteModal(false);
      setRecruitmentToDelete(null);
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar reclutamiento:', error);
      alert('Error al eliminar el reclutamiento');
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Cancela la eliminación
   */
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRecruitmentToDelete(null);
  };



  /**
   * Formatea la fecha para mostrar
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  /**
   * Obtiene el nombre de la entidad
   */
  const getEntityName = (recruitment: Recruitment) => {
    if (!recruitment.entity) return '-';
    
    if (recruitment.entity.businessName) {
      return recruitment.entity.businessName;
    }
    
    const { firstName, paternalSurname, maternalSurname } = recruitment.entity;
    return `${firstName || ''} ${paternalSurname || ''} ${maternalSurname || ''}`.trim() || '-';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader isLoading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <p className="text-red-500">Error al cargar los reclutamientos</p>
        <Button handleClick={onRefresh} type="primary" show={true}>
           Reintentar
         </Button>
      </div>
    );
  }

  if (recruitments.length === 0) {
    return <NoData />;
  }

  /**
   * Obtiene las opciones según el estado del reclutamiento
   */
  const getOptionsForState = (recruitment: Recruitment) => {
    switch (recruitment.state) {
      case 'PENDIENTE':
        return (
          <div className="flex gap-2">
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => handleViewDetails(recruitment.id)}
            >
              Ver
            </button>
            {isUser && (
              <button 
                className="text-red-600 hover:text-red-800 text-sm"
                onClick={() => handleDeleteClick(recruitment.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        );
      case 'OBSERVACIÓN':
        return (
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => handleViewDetails(recruitment.id)}
          >
            Ver observaciones
          </button>
        );
      case 'EN PROCESO':
        return (
          <div className="flex items-center gap-2">
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => handleViewDetails(recruitment.id)}
            >
              Ver detalles de proceso
            </button>
            <span className="text-yellow-600">📋</span>
          </div>
        );
      case 'VERIFICACIÓN':
        return (
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => handleViewDetails(recruitment.id)}
          >
            Ver detalles de verificación
          </button>
        );
      case 'TERMINADO':
        return (
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => handleViewDetails(recruitment.id)}
          >
            Ver detalles
          </button>
        );
      default:
        return (
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => handleViewDetails(recruitment.id)}
          >
            Ver
          </button>
        );
    }
  };

  /**
   * Obtiene el color de la barra de progreso según el estado
   */
  const getProgressBarColor = (state: string) => {
    switch (state) {
      case 'EN PROCESO':
        return 'bg-yellow-500';
      case 'VERIFICACIÓN':
        return 'bg-red-500';
      case 'TERMINADO':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="w-full text-[12px] font-light">
      {/* Header */}
      <div className="px-2 grid grid-cols-30 gap-0 bg-table-head dark:bg-main-1plus text-black dark:text-white rounded-sidebar mb-4">
        <div className="col-span-5 p-2">Fecha</div>
        <div className="col-span-7 p-2">Tipo de reclutamiento</div>
        <div className="col-span-5 p-2">Estado</div>
        <div className="col-span-7 p-2">Progreso</div>
        <div className="col-span-6 p-2">Opciones</div>
      </div>

      {/* Rows */}
      <div className="text-black dark:text-white flex flex-col gap-2">
        {recruitments.map((recruitment) => (
          <div key={recruitment.id} className="px-2 grid grid-cols-30 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
            <div className="col-span-5 p-2">
              {formatDate(recruitment.date)}
            </div>
            <div className="col-span-7 p-2">
              {recruitment.type || recruitment.recruitmentType || 'Reclutamiento regular'}
            </div>
            <div className="col-span-5 p-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                recruitment.state === 'TERMINADO' ? 'bg-green-100 text-green-800' :
                recruitment.state === 'EN PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                recruitment.state === 'VERIFICACIÓN' ? 'bg-red-100 text-red-800' :
                recruitment.state === 'PENDIENTE' ? 'bg-gray-100 text-gray-800' :
                recruitment.state === 'OBSERVACIÓN' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {recruitment.state}
              </span>
            </div>
            <div className="col-span-7 p-2">
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getProgressBarColor(recruitment.state)}`}
                    style={{ width: `${recruitment.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 p-2">
              {getOptionsForState(recruitment)}
            </div>
          </div>
        ))}
      </div>
      
      <ConfirmationModal
         isOpen={showDeleteModal}
         title="¿Estás seguro de eliminar?"
         confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
         cancelText="Cancelar"
         onConfirm={handleConfirmDelete}
         onCancel={handleCancelDelete}
         confirmButtonColor="orange"
       />
    </div>
  );
}