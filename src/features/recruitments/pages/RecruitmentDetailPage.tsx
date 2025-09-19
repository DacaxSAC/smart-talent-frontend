import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecruitmentsService, Recruitment } from '../services/recruitmentsService';
import { Loader } from '@/shared/components/Loader';
import { Button } from '@/shared/components/Button';

interface ProfileUp {
  id: number;
  // Datos generales
  positionName: string;
  area: string;
  reportsTo: string;
  supervises: string;
  solicitadoPor: string;
  naturalezaPuesto: string;
  tipoPersonalRequerido: string;
  tipoConvocatoria: string;
  nombrePuesto: string;
  condicionesContratacion: string;
  // Especificaciones del puesto
  numeroVacantes: number;
  fechaTentativaInicio: string;
  lugarResidencia: string;
  lugarTrabajo: string;
  horarioTrabajo: string;
  modalidadTrabajo: string;
  licenciaConducir: string;
  workLocation: string;
  workSchedule: string;
  workModality: string;
  contractType: string;
  // Funciones del puesto
  objetivo: string;
  descripcion: string[];
  jobFunctions: string[];
  // Propuesta salarial y beneficios
  rangoSalarialMin: number;
  rangoSalarialMax: number;
  bonos: string;
  frecuenciaPago: string;
  beneficios: string[];
  salaryRangeFrom: number;
  salaryRangeTo: number;
  bonuses: string;
  paymentFrequency: string;
  benefits: string;
  // Experiencia laboral
  experienceTime: string;
  positionExperience: string;
  // Competencias personales
  competenciasPersonales: string[];
  personalCompetencies: string[];
  // Observaciones adicionales
  observacionesAdicionales: string[];
  additionalObservations: string[];
  // Formación
  gradoInstruccion: string;
  completaIncompleta: string;
  nivelAcademico: string;
  carreraProfesional: string;
  educationLevel: string;
  educationStatus: string;
  academicLevel: string;
  professionalCareer: string;
  // Especializaciones y conocimientos adicionales
  especializaciones: string[];
  idioma: string;
  nivelIdioma: string;
  informatica: string;
  nivelInformatica: string;
  specializations: string[];
  languages: any[];
  computerSkills: any[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RecruitmentWithProfile extends Recruitment {
  profileUps: ProfileUp[];
}

const formatCurrency = (value: number | undefined | null): string => {
  if (!value) return '';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value);
};

export function RecruitmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recruitment, setRecruitment] = useState<RecruitmentWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecruitmentDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await RecruitmentsService.getRecruitmentById(parseInt(id));
        setRecruitment(response.data);
      } catch (error) {
        console.error('Error al obtener el detalle del reclutamiento:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitmentDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader isLoading={loading} />
      </div>
    );
  }

  if (error || !recruitment) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <p className="text-red-500">Error al cargar el detalle del reclutamiento</p>
        <Button handleClick={() => navigate('/recruitments')} type="primary" show={true}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  const profile = recruitment.profileUps?.[0];

  return (
    <div className="flex flex-col h-screen mx-5 md:mx-8 py-8 gap-6 font-karla">
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Visualización de levantamiento de perfil
          </h1>
          <p className="text-gray-600">
            Revisa el levantamiento de perfil para tu proceso de reclutamiento.
          </p>
        </div>
        <Button 
          handleClick={() => navigate('/recruitments')} 
          type="secondary" 
          show={true}
        >
          Volver
        </Button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 overflow-y-auto min-h-0">
        {profile && (
          <>
            {/* Datos generales */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Datos generales</h2>
              
              <div className="space-y-6">
                {/* Solicitado por */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solicitado por</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.solicitadoPor || profile.reportsTo || ''} 
                    readOnly 
                  />
                </div>

                {/* Row with 3 selects */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Naturaleza del puesto</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                      value={profile.naturalezaPuesto || profile.area || ''} 
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo del personal requerido</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                      value={profile.tipoPersonalRequerido || profile.supervises || ''} 
                      readOnly 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de convocatoria</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                      value={profile.tipoConvocatoria || profile.contractType || ''} 
                      readOnly 
                    />
                  </div>
                </div>

                {/* Nombre del puesto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del puesto</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.positionName || ''} 
                    readOnly 
                  />
                </div>

                {/* Condiciones de contratación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones de contratación</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.condicionesContratacion || profile.contractType || ''} 
                    readOnly 
                  />
                </div>
              </div>
            </div>

            {/* Especificaciones del puesto */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Especificaciones del puesto</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de trabajo</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.workLocation || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horario de trabajo</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.horarioTrabajo || profile.workSchedule || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad de trabajo</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.modalidadTrabajo || profile.workModality || ''} 
                    readOnly 
                  />
                </div>
              </div>
            </div>

            {/* Funciones del puesto */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Funciones del puesto</h2>
              <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                   <textarea 
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-20" 
                     value={profile.objetivo || (profile.jobFunctions && typeof profile.jobFunctions === 'object' && !Array.isArray(profile.jobFunctions) && (profile.jobFunctions as any).objetivo ? (profile.jobFunctions as any).objetivo : '')} 
                     readOnly 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Descripciones</label>
                   <textarea 
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-32" 
                     value={Array.isArray(profile.descripcion) ? profile.descripcion.join('\n') : (profile.descripcion || (profile.jobFunctions && typeof profile.jobFunctions === 'object' && !Array.isArray(profile.jobFunctions) && Array.isArray((profile.jobFunctions as any).descripcion) ? (profile.jobFunctions as any).descripcion.join('\n') : ''))} 
                     readOnly 
                   />
                 </div>
              </div>
            </div>

            {/* Propuesta Salarial y Beneficios */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Propuesta Salarial y Beneficios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rango Salarial Desde</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={formatCurrency(profile.salaryRangeFrom)} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rango Salarial Hasta</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={formatCurrency(profile.salaryRangeTo)} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Pago</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.paymentFrequency || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonos</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.bonuses || ''} 
                    readOnly 
                  />
                </div>
              </div>
              <div className="mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beneficios</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-20" 
                    value={(() => {
                       // Manejar beneficios del frontend
                       if (Array.isArray(profile.beneficios)) {
                         return profile.beneficios.join('\n');
                       }
                       
                       // Manejar beneficios del backend que pueden venir como JSON string
                       const benefitsValue = profile.beneficios || profile.benefits || '';
                       const stringValue = String(benefitsValue);
                       if (stringValue && stringValue.startsWith('[')) {
                         try {
                           const parsed = JSON.parse(stringValue);
                           return Array.isArray(parsed) ? parsed.join('\n') : stringValue;
                         } catch {
                           return stringValue;
                         }
                       }
                       
                       return stringValue;
                     })()} 
                    readOnly 
                  />
                </div>
              </div>
            </div>

            {/* Experiencia Laboral */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Experiencia Laboral</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Experiencia</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.experienceTime || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia en el Puesto</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.positionExperience || ''} 
                    readOnly 
                  />
                </div>
              </div>
            </div>

            {/* Competencias Personales */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Competencias Personales</h2>
              <div>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-32" 
                  value={Array.isArray(profile.competenciasPersonales) ? profile.competenciasPersonales.join('\n') : (Array.isArray(profile.personalCompetencies) ? profile.personalCompetencies.join('\n') : (profile.personalCompetencies || ''))} 
                  readOnly 
                />
              </div>
            </div>

            {/* Formación */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Formación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grado de Instrucción</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.gradoInstruccion || profile.educationLevel || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Educación</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.completaIncompleta || profile.educationStatus || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Académico</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.nivelAcademico || profile.academicLevel || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carrera Profesional</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                    value={profile.carreraProfesional || profile.professionalCareer || ''} 
                    readOnly 
                  />
                </div>
              </div>
            </div>

            {/* Especializaciones */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Especializaciones</h2>
              <div>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-20" 
                  value={Array.isArray(profile.especializaciones) ? profile.especializaciones.join(', ') : (Array.isArray(profile.specializations) ? profile.specializations.join(', ') : (profile.specializations || ''))} 
                  readOnly 
                />
              </div>
            </div>

            {/* Idiomas */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Idiomas</h2>
              <div>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-20" 
                  value={profile.idioma && profile.nivelIdioma ? `${profile.idioma} - ${profile.nivelIdioma}` : (Array.isArray(profile.languages) ? profile.languages.map(lang => `${lang.language || ''} - ${lang.level || ''}`).join(', ') : (profile.languages || ''))} 
                  readOnly 
                />
              </div>
            </div>

            {/* Conocimientos Informáticos */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Conocimientos Informáticos</h2>
              <div>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-20" 
                  value={profile.informatica && profile.nivelInformatica ? `${profile.informatica} - ${profile.nivelInformatica}` : (Array.isArray(profile.computerSkills) ? profile.computerSkills.map(skill => `${skill.skill || ''} - ${skill.level || ''}`).join(', ') : (profile.computerSkills || ''))} 
                  readOnly 
                />
              </div>
            </div>

            {/* Observaciones Adicionales */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Observaciones Adicionales</h2>
              <div>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-24" 
                  value={Array.isArray(profile.observacionesAdicionales) ? profile.observacionesAdicionales.join('\n') : (Array.isArray(profile.additionalObservations) ? profile.additionalObservations.join('\n') : (profile.additionalObservations || ''))} 
                  readOnly 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}