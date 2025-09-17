// React imports
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

// Feature imports
import { Recruitment } from "@/features/recruitments/services/recruitmentsService";
import { useHasRole } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";

// Component imports
import { Loader } from "@/shared/components/Loader";
import { NoData } from "@/shared/components/NoData";
import { Button } from "@/shared/components/Button";

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

  /**
   * Navega a la página de detalle del reclutamiento
   */
  const handleViewDetails = (recruitmentId: number) => {
    navigate(`/recruitments/${recruitmentId}`);
  };

  /**
   * Navega a la página de edición del reclutamiento
   */
  const handleEdit = (recruitmentId: number) => {
    navigate(`/recruitments/${recruitmentId}/edit`);
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
      <div className="flex justify-center items-center h-64">
        <Loader isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">Error al cargar los reclutamientos</p>
        <Button 
          type="secondary" 
          handleClick={onRefresh}
          description="Reintentar"
        />
      </div>
    );
  }

  if (recruitments.length === 0) {
    return <NoData />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 font-medium text-gray-600">Tipo</th>
            <th className="text-left p-4 font-medium text-gray-600">Descripción</th>
            <th className="text-left p-4 font-medium text-gray-600">Estado</th>
            <th className="text-left p-4 font-medium text-gray-600">Progreso</th>
            <th className="text-left p-4 font-medium text-gray-600">Entidad</th>
            <th className="text-left p-4 font-medium text-gray-600">Fecha</th>
            <th className="text-left p-4 font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recruitments.map((recruitment) => (
            <tr key={recruitment.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-4">
                <span className="text-sm font-medium">{recruitment.type}</span>
              </td>
              <td className="p-4">
                <span className="text-sm">{recruitment.description}</span>
              </td>
              <td className="p-4">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  recruitment.state === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                  recruitment.state === 'OBSERVACIÓN' ? 'bg-red-100 text-red-800' :
                  recruitment.state === 'EN PROCESO' ? 'bg-blue-100 text-blue-800' :
                  recruitment.state === 'VERIFICACIÓN' ? 'bg-purple-100 text-purple-800' :
                  recruitment.state === 'TERMINADO' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {recruitment.state}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${recruitment.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{recruitment.progress || 0}%</span>
                </div>
              </td>
              <td className="p-4">
                <span className="text-sm">{getEntityName(recruitment)}</span>
              </td>
              <td className="p-4">
                <span className="text-sm text-gray-600">{formatDate(recruitment.date)}</span>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button
                    type="secondary"
                    handleClick={() => handleViewDetails(recruitment.id)}
                    description="Ver"
                  />
                  {(isAdmin || isRecruiter) && (
                    <Button
                      type="primary"
                      handleClick={() => handleEdit(recruitment.id)}
                      description="Editar"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}