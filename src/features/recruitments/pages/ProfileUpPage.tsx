import React from 'react';

export function ProfileUpPage() {
  return (
    <div className="flex flex-col mx-5 md:mx-8 my-8 gap-6 font-karla">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Levantamiento de perfil</h1>
        <p className="text-gray-600">Registra fácilmente el levantamiento de perfil para tu proceso de reclutamiento.</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Datos generales */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Datos generales</h2>
          
          <div className="space-y-6">
            {/* Solicitado por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solicitado por</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Row with 3 selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naturaleza del puesto</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo del personal requerido</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                  <option value="">Seleccionar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de convocatoria</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                  <option value="">Seleccionar</option>
                </select>
              </div>
            </div>

            {/* Nombre del puesto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del puesto</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Condiciones de contratación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones de contratación</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Especificaciones del puesto */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Especificaciones del puesto</h2>
          
          <div className="space-y-6">
            {/* Row with multiple fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">N° vacantes</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                  <option value="">N°</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha tentativa de inicio</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de residencia</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Licencia de conducir</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                  <option value="">Seleccionar</option>
                </select>
              </div>
            </div>

            {/* Lugar de trabajo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de trabajo</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Describe el objetivo del puesto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
                    <span className="text-gray-500 text-lg">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propuesta salarial y beneficios */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Propuesta salarial y beneficios</h2>
          
          <div className="space-y-6">
            {/* Rango salarial, Bonos, Frecuencia */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rango salarial</label>
                <div className="flex gap-2 items-center">
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                    <option value="">N°</option>
                  </select>
                  <span className="text-gray-500">-</span>
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                    <option value="">N°</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bonos</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de pago</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                  <option value="">Seleccionar</option>
                </select>
              </div>
            </div>

            {/* Beneficios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios</label>
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
                    <span className="text-gray-500 text-lg">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experiencia laboral */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Experiencia laboral</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia en el puesto</label>
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
                    <span className="text-gray-500 text-lg">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
         </div>

         {/* Competencias personales */}
         <div className="mb-8">
           <h2 className="text-lg font-medium text-gray-900 mb-6">Competencias personales</h2>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
             <div className="space-y-3">
               <input 
                 type="text" 
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               />
               <div className="flex gap-3">
                 <input 
                   type="text" 
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                 />
                 <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
                   <span className="text-gray-500 text-lg">+</span>
                 </button>
               </div>
             </div>
           </div>
         </div>

         {/* Observaciones adicionales */}
         <div className="mb-8">
           <h2 className="text-lg font-medium text-gray-900 mb-6">Observaciones adicionales</h2>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
             <div className="space-y-3">
               <input 
                 type="text" 
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               />
               <div className="flex gap-3">
                 <input 
                   type="text" 
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                 />
                 <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
                   <span className="text-gray-500 text-lg">+</span>
                 </button>
               </div>
             </div>
           </div>
         </div>

         {/* Formación */}
         <div className="mb-8">
           <h2 className="text-lg font-medium text-gray-900 mb-6">Formación</h2>
           
           <div className="space-y-6">
             {/* Grado de instrucción, Completa o incompleta, Nivel académico */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Grado de instrucción</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                   <option value="">Seleccionar</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Completa o incompleta</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                   <option value="">Seleccionar</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Nivel académico</label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                   <option value="">Seleccionar</option>
                 </select>
               </div>
             </div>

             {/* Carrera profesional */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Carrera profesional</label>
               <input 
                 type="text" 
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               />
             </div>
           </div>
          </div>

          {/* Especializaciones y conocimientos adicionales */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Especializaciones y conocimientos adicionales</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50">
                      <span className="text-gray-500 text-lg">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Idioma e Informática */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                        <option value="">Seleccionar</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                        <option value="">Seleccionar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Confirmar */}
          <div className="flex justify-center mt-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }
