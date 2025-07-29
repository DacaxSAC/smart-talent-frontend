import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Request, RequestsService } from "../services/requestsService";
import { ResourceField } from "../components/public/ResourceField";
import { LayoutPage } from "@/shared/components/LayoutPage";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Notify } from "notiflix";
import { useUpload } from "@/shared/hooks/useUpload";

/**
 * Página de detalles de una solicitud específica
 * Muestra toda la información del request sin restricciones de rol
 * Permite edición según el tipo de usuario (USER vs ADMIN/RECRUITER)
 */
export const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  const isUser = useHasRole(ROLES.USER);
  const { uploadFile } = useUpload();

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los datos del request desde el servicio API
   * Utiliza el método getRequestDetail para obtener toda la información
   */
  const loadRequestData = async () => {
    if (!id) {
      setError("ID de solicitud no válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Convertir el ID de string a number para el servicio
      const requestId = parseInt(id, 10);
      if (isNaN(requestId)) {
        throw new Error("ID de solicitud no válido");
      }

      const response = await RequestsService.getRequestDetail(requestId);
      console.log('Response from API:', response);
      
      // El servicio devuelve un objeto Request directamente
      if (response && response.person) {
        console.log('Setting request data:', response.person);
        setRequest(response.person);
      } else {
        console.log('No person data found in response:', response);
        throw new Error("No se encontró la solicitud");
      }
    } catch (err) {
      console.error('Error al cargar los detalles de la solicitud:', err);
      setError("Error al cargar los detalles de la solicitud");
      Notify.failure("Error al cargar los detalles de la solicitud");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja los cambios en los campos de recursos
   */
  const handleResourceChange = (documentIndex: number, resourceIndex: number, value: string | File[] | null) => {
    if (!request) return;

    const updatedRequest = { ...request };
    if (Array.isArray(value) && value.length > 0) {
      // Para archivos, guardamos el nombre del archivo como string
      updatedRequest.documents[documentIndex].resources[resourceIndex].value = value[0].name;
    } else {
      updatedRequest.documents[documentIndex].resources[resourceIndex].value = value as string;
    }
    setRequest(updatedRequest);
  };

  /**
   * Maneja los cambios en el resultado del documento (solo ADMIN/RECRUITER)
   */
  const handleResultChange = (documentIndex: number, value: string) => {
    if (!request) return;

    const updatedRequest = { ...request };
    updatedRequest.documents[documentIndex].result = value;
    setRequest(updatedRequest);
  };

  /**
   * Maneja los cambios en el archivo del documento (solo ADMIN/RECRUITER)
   */
  const handleFileChange = (documentIndex: number, value: File[] | null) => {
    if (!request || !value || value.length === 0) return;

    const updatedRequest = { ...request };
    // Guardamos el archivo en el campo filename
    updatedRequest.documents[documentIndex].filename = value[0];
    setRequest(updatedRequest);
  };

  /**
   * Guarda los cambios realizados en el request
   * Utiliza el método updateDocuments disponible en el servicio
   */
  const handleSave = async () => {
    if (!request || !id) return;

    try {
      setSaving(true);
      // Preparar los datos para actualizar documentos
      const updates = request.documents.map(doc => ({
        id: doc.id,
        result: doc.result || "",
        filename: typeof doc.filename === 'string' ? doc.filename : doc.filename?.name || ""
      }));
      
      await RequestsService.updateDocuments(updates);
      Notify.success("Cambios guardados exitosamente");
    } catch (err) {
      Notify.failure("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Navega de regreso a la lista de requests
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    loadRequestData();
  }, [id]);

  if (loading) {
    return (
        <Loader isLoading={true} />
    );
  }

  // Debug logs
  console.log('Current state - loading:', loading, 'error:', error, 'request:', request);

  if (error || !request) {
    console.log('Showing error state - error:', error, 'request exists:', !!request);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          {error || "Solicitud no encontrada"}
        </h2>
        <Button
          type="secondary"
          handleClick={handleGoBack}
          description="Volver"
        />
      </div>
    );
  }

  return (
    <LayoutPage 
      title="DETALLES DE SOLICITUD"
      description="Visualiza los detalles de una solicitud específica."
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Detalles de Solicitud
        </h1>
        <div className="flex gap-3">
          <Button
            type="secondary"
            handleClick={handleGoBack}
            description="Volver"
          />
          {(isAdmin || isRecruiter) && (
            <Button
              type="primary"
              handleClick={handleSave}
              disabled={saving}
              description={saving ? "Guardando..." : "Guardar cambios"}
            />
          )}
        </div>
      </div>

      {/* Información del solicitante */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Información del Solicitante
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
            <p className="text-gray-900 dark:text-white">{request.fullname}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">DNI:</span>
            <p className="text-gray-900 dark:text-white">{request.dni}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Teléfono:</span>
            <p className="text-gray-900 dark:text-white">{request.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Usuario:</span>
            <p className="text-gray-900 dark:text-white">{request.Users?.[0]?.email || 'N/A'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
            <span
              className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                request.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : request.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : request.status === "COMPLETED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : request.status === "OBSERVED"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {request.status}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Observaciones:</span>
            <p className="text-gray-900 dark:text-white">{request.observations || 'Sin observaciones'}</p>
          </div>
        </div>
      </div>

      {/* Documentos y Recursos */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Documentos y Recursos
        </h2>
        
        {request.documents.map((document, docIndex) => (
          <div
            key={docIndex}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            {/* Header del documento */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {document.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  document.status === "Pendiente"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : document.status === "Realizado"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}
              >
                {document.status}
              </span>
            </div>

            {/* Campos específicos para ADMIN/RECRUITER */}
            {(isAdmin || isRecruiter) && (
              <div className="space-y-4 mb-6">
                <ResourceField
                  name="Resultado"
                  allowedFileTypes={[]}
                  value={document.result as string}
                  isEditable={document.status === "Pendiente"}
                  onChange={(value) => handleResultChange(docIndex, value as string)}
                />
                <ResourceField
                  name="Documento"
                  allowedFileTypes={[".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]}
                  value={document.filename as string}
                  isEditable={document.status === "Pendiente"}
                  onChange={(value) => handleFileChange(docIndex, value as File[])}
                />
              </div>
            )}

            {/* Campos específicos para USER */}
            {isUser && (
              <div className="space-y-4 mb-6">
                <ResourceField
                  name="Comentarios"
                  value={document.result as string}
                  isEditable={false}
                  allowedFileTypes={[]}
                />
                <ResourceField
                  name="Documento"
                  value={document.filename as string}
                  isEditable={false}
                  allowedFileTypes={[]}
                />
              </div>
            )}

            {/* Recursos del documento */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Recursos requeridos:
              </h4>
              {document.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <ResourceField
                    name={resource.name}
                    value={resource.value}
                    allowedFileTypes={resource.allowedFileTypes || []}
                    isEditable={isUser && document.status === "Pendiente"}
                    onChange={(value) => handleResourceChange(docIndex, resourceIndex, value)}
                  />
                  {resource.value && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Valor actual: {typeof resource.value === 'string' ? resource.value : 'Archivo cargado'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutPage>
  );
};