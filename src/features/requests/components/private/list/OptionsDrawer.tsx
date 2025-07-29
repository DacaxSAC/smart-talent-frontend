import { useNavigate } from 'react-router-dom';
import { useState,useRef } from 'react';
import { Button } from "@/shared/components/Button";
import { Drawer } from "@/shared/components/Drawer";
import { Notify } from 'notiflix';
import { Loader } from '@/shared/components/Loader';

interface OptionsModalProps {
  isActive: boolean;
  handleActive: () => void;
}

interface RequestData {
  dni: string;
  fullName: string;
  phone: string;
}

export const OptionsDrawer = ({ isActive, handleActive }: OptionsModalProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Navega a la página de registro manual
   */
  const handleRegisterManually = () => {
    handleActive();
    navigate("/requests/create");
  };

  /**
   * Abre el selector de archivos
   */
  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  /**
   * Descarga la plantilla CSV
   */
  const handleLoadTemplate = () => {
    try {
      // Crear el contenido del CSV
      const csvContent = 'DNI,NOMBRES COMPLETOS,TELEFONO\n12345678, Ejemplo de nombre completo, 987654321';
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'PlantillaSolicitudes.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      Notify.success('Plantilla descargada exitosamente');
    } catch (error) {
      console.error('Error al descargar la plantilla:', error);
      Notify.failure('Error al descargar la plantilla');
    }
  };

  /**
   * Valida las cabeceras del archivo CSV
   */
  const validateCSVHeaders = (headers: string[]): boolean => {
    const requiredHeaders = ['DNI', 'NOMBRES COMPLETOS', 'TELEFONO'];
    const normalizedHeaders = headers.map(h => h.trim().toUpperCase());
    
    return requiredHeaders.every(required => 
      normalizedHeaders.includes(required.toUpperCase())
    );
  };

  /**
   * Procesa el archivo CSV seleccionado
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setLoading(false);
      Notify.failure('Por favor selecciona un archivo CSV válido');
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setLoading(false);
        Notify.failure('El archivo CSV debe contener al menos una cabecera y una fila de datos'); 
        return;
      }

      // Validar cabeceras
      const headers = lines[0].split(',').map(h => h.trim());
      
      if (!validateCSVHeaders(headers)) {
        setLoading(false);
        Notify.failure('El archivo CSV debe contener las cabeceras: DNI, NOMBRES COMPLETOS, TELEFONO');
        return;
      }

      // Procesar datos
      const data = [] as RequestData[];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length !== headers.length) {
          setLoading(false);
          Notify.warning(`Fila ${i + 1}: Número de columnas no coincide con las cabeceras`);
          continue;
        }

        const rowData: RequestData = {
          dni: values[0],
          fullName: values[1],
          phone: values[2]
        };

        // Validaciones básicas
        if (!rowData.dni || !rowData.fullName || !rowData.phone) {
          setLoading(false);
          Notify.warning(`Fila ${i + 1}: Faltan datos requeridos`);
          continue;
        }

        data.push(rowData);
      }

      if (data.length === 0) {
        setLoading(false);
        Notify.failure('No se encontraron datos válidos en el archivo');
        return;
      }

      console.log('Datos procesados del CSV:', data);
      
      // Convertir RequestData a RequestsType
      const requestsForCreation = data.map(item => ({
        dni: item.dni,
        fullname: item.fullName,
        phone: item.phone,
        isConfirmed: false,
        documents: []
      }));
      
      setLoading(false);
      Notify.success(`Se procesaron ${data.length} registros exitosamente`);
      
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Cerrar el drawer y navegar a la página de creación con los datos
      handleActive();
      navigate('/requests/create', { 
        state: { 
          csvData: requestsForCreation 
        } 
      });

    } catch (error) {
      setLoading(false);
      console.error('Error al procesar el archivo:', error);
      Notify.failure('Error al procesar el archivo CSV');
    }
  };

  return (
    <>
    <Loader isLoading={loading} />

    <Drawer isActive={isActive} handleActive={handleActive}>
      <div className="flex flex-col items-center justify-center gap-5 mb-10">
        <p className="text-center text-[12px] font-light">
          SELECCIONA EL MÉTODO DE INGRESO DE DATOS
        </p>

        <div className="flex flex-col gap-3">
          <Button type='primary' handleClick={handleRegisterManually} description="Registrar manualmente" />
          <p className="text-center text-[12px] font-light">O</p>
          
          {/* Input file oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button 
            onClick={handleImportFile} 
            className='py-2 px-8 text-[14px] font-light rounded-sidebar bg-main-1plus dark:bg-main hover:bg-main dark:hover:bg-main-1plus border border-medium-1'
          >
            Importar archivo
          </button>
          
          <p className='text-center text-medium'>
            Recuerda que el archivo importado debe ser el mismo formato mostrado en el ejemplo.
          </p>
          
          <button 
            onClick={handleLoadTemplate} 
            className='border border-medium-1 rounded-[4px] text-medium hover:bg-white-1 py-2'
          >
            Descargar plantilla
          </button> 
        </div>
      </div>
    </Drawer>
    </>
  );
};


