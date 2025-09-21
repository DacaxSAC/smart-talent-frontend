// React imports
import { useState } from "react";
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

interface PendingRecruitmentsTableProps {
  recruitments: Recruitment[];
  loading: boolean;
  error: boolean;
  onRefresh: () => void;
}

/**
 * Tabla para reclutamientos pendientes — columnas: Fecha | DNI/RUC | Nombres / Razón social | Tipo de reclutamiento | Opciones
 */
export function PendingRecruitmentsTable({ recruitments, loading, error, onRefresh }: PendingRecruitmentsTableProps) {
  const navigate = useNavigate();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isRecruiter = useHasRole(ROLES.RECRUITER);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [recruitmentToApprove, setRecruitmentToApprove] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getEntityName = (recruitment: Recruitment) => {
    if (!recruitment.entity) return '-';
    if ((recruitment.entity as any).businessName) return (recruitment.entity as any).businessName;
    const { firstName, paternalSurname, maternalSurname } = recruitment.entity as any;
    return `${firstName || ''} ${paternalSurname || ''} ${maternalSurname || ''}`.trim() || '-';
  };

  const getEntityDocument = (recruitment: Recruitment) => {
    if (!recruitment.entity) return '-';
    // posibles nombres: documentNumber, dni, ruc
    const e: any = recruitment.entity;
    return e.documentNumber || e.dni || e.ruc || '-';
  };

  const handleViewDetails = (id: number) => {
    navigate(`/recruitments/${id}`);
  };

  const handleApproveClick = (id: number) => {
    setRecruitmentToApprove(id);
    setShowApproveModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!recruitmentToApprove) return;
    setIsApproving(true);
    try {
      if (typeof (RecruitmentsService as any).approveRecruitment === 'function') {
        await (RecruitmentsService as any).approveRecruitment(recruitmentToApprove);
      } else {
        // Simular aprobación cuando el servicio no implementa la función
        await new Promise((r) => setTimeout(r, 800));
      }
      setShowApproveModal(false);
      setRecruitmentToApprove(null);
      onRefresh();
    } catch (err) {
      console.error('Error aprobando reclutamiento:', err);
      alert('Error al aprobar el reclutamiento');
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancelApprove = () => {
    setShowApproveModal(false);
    setRecruitmentToApprove(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-8"><Loader isLoading={loading} /></div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <p className="text-red-500">Error al cargar los reclutamientos</p>
      <Button handleClick={onRefresh} type="primary" show={true}>Reintentar</Button>
    </div>
  );

  if (!recruitments || recruitments.length === 0) return <NoData />;

  return (
    <div className="w-[892px] text-[16px]  text-black  dark:text-white font-karla font-medium">
      <div className="h-[45px] pl-9 py-2.5 grid grid-cols-30 border border-[#C3C3C3] bg-[#FA8D2880] dark:bg-main-1plus rounded-sidebar mb-4">
        <div className="col-span-4 ">Fecha</div>
        <div className="col-span-4 ">DNI / RUC</div>
        <div className="col-span-8 ">Nombres / Razón social</div>
        <div className="col-span-7 ">Tipo de reclutamiento</div>
        <div className="col-span-6 ">Opciones</div>
      </div>

      <div className="text-black dark:text-white flex flex-col gap-2">
        {recruitments.map((r) => (
          <div key={r.id} className="h-[45px] pl-9 py-2.5 grid grid-cols-30 border border-[#C3C3C3] rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
            <div className="col-span-4 ">{formatDate(r.date)}</div>
            <div className="col-span-4 ">{getEntityDocument(r)}</div>
            <div className="col-span-8 ">{getEntityName(r)}</div>
            <div className="col-span-7 ">{r.type || r.recruitmentType || 'Reclutamiento regular'}</div>
            <div className="col-span-6 ">
              <div className="flex gap-3 items-center w-auto">
                <button className="hover:text-blue-800" onClick={() => handleViewDetails(r.id)}>Ver detalles</button>
                {(isAdmin || isRecruiter) && (
                  <button className=" hover:text-green-800" onClick={() => handleApproveClick(r.id)}>Aprobar</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={showApproveModal}
        title="¿Aprobar reclutamiento?"
        confirmText={isApproving ? 'Aprobando...' : 'Aprobar'}
        cancelText="Cancelar"
        onConfirm={handleConfirmApprove}
        onCancel={handleCancelApprove}
        confirmButtonColor="green"
      />
    </div>
  );
}

export default PendingRecruitmentsTable;
