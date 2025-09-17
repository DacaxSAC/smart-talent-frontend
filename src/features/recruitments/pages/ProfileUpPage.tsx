import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RecruitmentsService } from '../services/recruitmentsService';

interface ProfileUpFormData {
  solicitadoPor: string;
  naturalezaPuesto: string;
  tipoPersonalRequerido: string;
  tipoConvocatoria: string;
  nombrePuesto: string;
  condicionesContratacion: string;
  // Especificaciones del puesto
  numeroVacantes: string;
  fechaTentativaInicio: string;
  lugarResidencia: string;
  lugarTrabajo: string;
  licenciaConducir: string;
  // Funciones del puesto
  objetivo: string;
  descripcion: string[];
  rangoSalarialMin: string;
  rangoSalarialMax: string;
  bonos: string;
  frecuenciaPago: string;
  beneficios: string[];
  // Competencias personales
  competenciasPersonales: string[];
  // Observaciones adicionales
  observacionesAdicionales: string[];
  // Formación
  gradoInstruccion: string;
  completaIncompleta: string;
  nivelAcademico: string;
  carreraProfesional: string;
  // Especializaciones y conocimientos adicionales
  especializaciones: string[];
  idioma: string;
  nivelIdioma: string;
  informatica: string;
  nivelInformatica: string;
}

export function ProfileUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recruitmentType = searchParams.get('type');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProfileUpFormData>({
    solicitadoPor: '',
    naturalezaPuesto: '',
    tipoPersonalRequerido: '',
    tipoConvocatoria: '',
    nombrePuesto: '',
    condicionesContratacion: '',
    // Especificaciones del puesto
    numeroVacantes: '',
    fechaTentativaInicio: '',
    lugarResidencia: '',
    lugarTrabajo: '',
    licenciaConducir: '',
    objetivo: '',
    descripcion: [''],
    rangoSalarialMin: '',
    rangoSalarialMax: '',
    bonos: '',
    frecuenciaPago: '',
    beneficios: [''],
    // Competencias personales
    competenciasPersonales: [''],
    // Observaciones adicionales
    observacionesAdicionales: [''],
    // Formación
    gradoInstruccion: '',
    completaIncompleta: '',
    nivelAcademico: '',
    carreraProfesional: '',
    // Especializaciones y conocimientos adicionales
    especializaciones: [''],
    idioma: '',
    nivelIdioma: '',
    informatica: '',
    nivelInformatica: ''
  });

  useEffect(() => {
    if (!recruitmentType) {
      navigate('/recruitments');
    }
  }, [recruitmentType, navigate]);

  const handleInputChange = (field: keyof ProfileUpFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'descripcion' | 'beneficios' | 'competenciasPersonales' | 'observacionesAdicionales' | 'especializaciones', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'descripcion' | 'beneficios' | 'competenciasPersonales' | 'observacionesAdicionales' | 'especializaciones') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleSubmit = async () => {
    if (!recruitmentType) return;
    
    setIsLoading(true);
    try {
      await RecruitmentsService.createRecruitmentWithProfile({
        type: recruitmentType,
        profileUp: formData
      });
      
      // Redirigir a la lista de reclutamientos después del éxito
      navigate('/recruitments');
    } catch (error) {
      console.error('Error creating recruitment:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen mx-5 md:mx-8 py-8 gap-6 font-karla">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Levantamiento de perfil</h1>
        <p className="text-gray-600">Registra fácilmente el levantamiento de perfil para tu proceso de reclutamiento.</p>
        {recruitmentType && (
          <p className="text-sm text-orange-600 mt-2">Tipo de reclutamiento: {recruitmentType}</p>
        )}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 overflow-y-auto min-h-0">
        {/* Datos generales */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Datos generales</h2>
          
          <div className="space-y-6">
            {/* Solicitado por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solicitado por</label>
              <input 
                type="text" 
                value={formData.solicitadoPor}
                onChange={(e) => handleInputChange('solicitadoPor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Row with 3 selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naturaleza del puesto</label>
                <select 
                  value={formData.naturalezaPuesto}
                  onChange={(e) => handleInputChange('naturalezaPuesto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="operativo">Operativo</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="gerencial">Gerencial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo del personal requerido</label>
                <select 
                  value={formData.tipoPersonalRequerido}
                  onChange={(e) => handleInputChange('tipoPersonalRequerido', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="tiempo-completo">Tiempo completo</option>
                  <option value="medio-tiempo">Medio tiempo</option>
                  <option value="temporal">Temporal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de convocatoria</label>
                <select 
                  value={formData.tipoConvocatoria}
                  onChange={(e) => handleInputChange('tipoConvocatoria', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="interna">Interna</option>
                  <option value="externa">Externa</option>
                  <option value="mixta">Mixta</option>
                </select>
              </div>
            </div>

            {/* Nombre del puesto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del puesto</label>
              <input 
                type="text" 
                value={formData.nombrePuesto}
                onChange={(e) => handleInputChange('nombrePuesto', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Condiciones de contratación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones de contratación</label>
              <input 
                type="text" 
                value={formData.condicionesContratacion}
                onChange={(e) => handleInputChange('condicionesContratacion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Especificaciones del puesto */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Especificaciones del puesto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* N° vacantes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">N° vacantes</label>
              <input 
                type="number" 
                value={formData.numeroVacantes}
                onChange={(e) => handleInputChange('numeroVacantes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="N°"
              />
            </div>

            {/* Fecha tentativa de inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha tentativa de inicio</label>
              <input 
                type="date" 
                value={formData.fechaTentativaInicio}
                onChange={(e) => handleInputChange('fechaTentativaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Lugar de residencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de residencia</label>
              <input 
                type="text" 
                value={formData.lugarResidencia}
                onChange={(e) => handleInputChange('lugarResidencia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Lugar de trabajo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de trabajo</label>
              <input 
                type="text" 
                value={formData.lugarTrabajo}
                onChange={(e) => handleInputChange('lugarTrabajo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Licencia de conducir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Licencia de conducir</label>
              <select 
                value={formData.licenciaConducir}
                onChange={(e) => handleInputChange('licenciaConducir', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="deseable">Deseable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Funciones del puesto */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Funciones del puesto</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo</label>
              <textarea 
                rows={4}
                value={formData.objetivo}
                onChange={(e) => handleInputChange('objetivo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Describe el objetivo del puesto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <div className="space-y-3">
                {formData.descripcion.map((desc, index) => (
                  <div key={index} className={index === formData.descripcion.length - 1 ? "flex gap-3" : ""}>
                    <input 
                      type="text" 
                      value={desc}
                      onChange={(e) => handleArrayChange('descripcion', index, e.target.value)}
                      className={`${index === formData.descripcion.length - 1 ? 'flex-1' : 'w-full'} px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    />
                    {index === formData.descripcion.length - 1 && (
                      <button 
                        type="button"
                        onClick={() => addArrayItem('descripcion')}
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      >
                        <span className="text-gray-500 text-lg">+</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Propuesta salarial y beneficios */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Propuesta salarial y beneficios</h2>
          
          <div className="space-y-6">
            {/* Rango salarial, Bonos, Frecuencia */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango salarial</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={formData.rangoSalarialMin}
                    onChange={(e) => handleInputChange('rangoSalarialMin', e.target.value)}
                    placeholder="Mín"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="text-gray-500 px-1">-</span>
                  <input
                    type="number"
                    value={formData.rangoSalarialMax}
                    onChange={(e) => handleInputChange('rangoSalarialMax', e.target.value)}
                    placeholder="Máx"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bonos</label>
                <input 
                  type="text" 
                  value={formData.bonos}
                  onChange={(e) => handleInputChange('bonos', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de pago</label>
                <select 
                  value={formData.frecuenciaPago}
                  onChange={(e) => handleInputChange('frecuenciaPago', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
            </div>

            {/* Beneficios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios</label>
              <div className="space-y-3">
                {formData.beneficios.map((beneficio, index) => (
                  <div key={index} className={index === formData.beneficios.length - 1 ? "flex gap-3" : ""}>
                    <input 
                      type="text" 
                      value={beneficio}
                      onChange={(e) => handleArrayChange('beneficios', index, e.target.value)}
                      className={`${index === formData.beneficios.length - 1 ? 'flex-1' : 'w-full'} px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    />
                    {index === formData.beneficios.length - 1 && (
                      <button 
                        type="button"
                        onClick={() => addArrayItem('beneficios')}
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      >
                        <span className="text-gray-500 text-lg">+</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competencias personales */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Competencias personales</h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            {formData.competenciasPersonales.map((competencia, index) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={competencia}
                  onChange={(e) => handleArrayChange('competenciasPersonales', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ingrese competencia personal"
                />
                {index === formData.competenciasPersonales.length - 1 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('competenciasPersonales')}
                    className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones adicionales */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Observaciones adicionales</h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            {formData.observacionesAdicionales.map((observacion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={observacion}
                  onChange={(e) => handleArrayChange('observacionesAdicionales', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ingrese observación adicional"
                />
                {index === formData.observacionesAdicionales.length - 1 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('observacionesAdicionales')}
                    className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formación */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Formación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grado de instrucción</label>
              <select 
                value={formData.gradoInstruccion}
                onChange={(e) => handleInputChange('gradoInstruccion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="tecnico">Técnico</option>
                <option value="universitario">Universitario</option>
                <option value="postgrado">Postgrado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Completa o incompleta</label>
              <select 
                value={formData.completaIncompleta}
                onChange={(e) => handleInputChange('completaIncompleta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="completa">Completa</option>
                <option value="incompleta">Incompleta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nivel académico</label>
              <select 
                value={formData.nivelAcademico}
                onChange={(e) => handleInputChange('nivelAcademico', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="bachiller">Bachiller</option>
                <option value="licenciado">Licenciado</option>
                <option value="magister">Magíster</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Carrera profesional</label>
            <input 
              type="text" 
              value={formData.carreraProfesional}
              onChange={(e) => handleInputChange('carreraProfesional', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ingrese carrera profesional"
            />
          </div>
        </div>

        {/* Especializaciones y conocimientos adicionales */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Especializaciones y conocimientos adicionales</h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            {formData.especializaciones.map((especializacion, index) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={especializacion}
                  onChange={(e) => handleArrayChange('especializaciones', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ingrese especialización o conocimiento adicional"
                />
                {index === formData.especializaciones.length - 1 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('especializaciones')}
                    className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Idioma e Informática */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                  <input 
                    type="text" 
                    value={formData.idioma}
                    onChange={(e) => handleInputChange('idioma', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                  <select 
                    value={formData.nivelIdioma}
                    onChange={(e) => handleInputChange('nivelIdioma', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="nativo">Nativo</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Informática</label>
                  <input 
                    type="text" 
                    value={formData.informatica}
                    onChange={(e) => handleInputChange('informatica', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                  <select 
                    value={formData.nivelInformatica}
                    onChange={(e) => handleInputChange('nivelInformatica', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="basico">Básico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Confirmar */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            {isLoading ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
