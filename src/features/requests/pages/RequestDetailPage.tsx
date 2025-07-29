import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Request, RequestsService } from "../services/requestsService";
import { ResourceField } from "../components/public/ResourceField";
import { PageLayout } from "@/features/users/components/shared/PageLayout";
import { PageTitle } from "@/features/users/components/shared/PageTitle";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Notify } from "notiflix";
import { useUpload } from "@/shared/hooks/useUpload";
import { MdExpandMore } from "react-icons/md";
import { STATUS } from "@/features/auth/constants/status";

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
  const [isRequestDataExpanded, setIsRequestDataExpanded] = useState(true);

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
      console.log("Response from API:", response);

      // El servicio devuelve un objeto Request directamente
      if (response && response.person) {
        console.log("Setting request data:", response.person);
        setRequest(response.person);
      } else {
        console.log("No person data found in response:", response);
        throw new Error("No se encontró la solicitud");
      }
    } catch (err) {
      console.error("Error al cargar los detalles de la solicitud:", err);
      setError("Error al cargar los detalles de la solicitud");
      Notify.failure("Error al cargar los detalles de la solicitud");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja los cambios en los campos de recursos
   */
  const handleResourceChange = (
    documentIndex: number,
    resourceIndex: number,
    value: string | File[] | null
  ) => {
    if (!request) return;

    const updatedRequest = { ...request };
    if (Array.isArray(value) && value.length > 0) {
      // Para archivos, guardamos el nombre del archivo como string
      updatedRequest.documents[documentIndex].resources[resourceIndex].value =
        value[0].name;
    } else {
      updatedRequest.documents[documentIndex].resources[resourceIndex].value =
        value as string;
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
      const updates = request.documents.map((doc) => ({
        id: doc.id,
        result: doc.result || "",
        filename:
          typeof doc.filename === "string"
            ? doc.filename
            : doc.filename?.name || "",
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

  /**
   * Alterna la visibilidad de los datos de solicitud
   */
  const toggleRequestDataExpansion = () => {
    setIsRequestDataExpanded(!isRequestDataExpanded);
  };

  useEffect(() => {
    loadRequestData();
  }, [id]);

  if (loading) {
    return <Loader isLoading={true} />;
  }

  if (error || !request) {
    console.log(
      "Showing error state - error:",
      error,
      "request exists:",
      !!request
    );
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
    <PageLayout>
      {/** Encabezado de la página */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between">
        <PageTitle
          title="DETALLES DE SOLICITUD"
          description="Visualiza los detalles de una solicitud específica."
        />
        <div className="flex items-start gap-3">
          <Button
            type="secondary"
            handleClick={handleGoBack}
            description="Regresar a la lista de solicitudes"
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

      <div className="overflow-y-auto flex flex-col gap-4">
        {/* Información del solicitante */}
        <div className="text-[12px] flex flex-col gap-4">
          <div 
            className="p-2 flex items-center justify-between cursor-pointer bg-white-2 border border-medium rounded-[12px]"
            onClick={toggleRequestDataExpansion}
          >
            <h2 className="text-[16px]">
              Información principal
            </h2>
            <div className={`transition-all duration-300 transform ${isRequestDataExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <MdExpandMore className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
            </div>
          </div>
          {isRequestDataExpanded && (
            <div className="flex flex-col px-3">
              <div className="px-2 grid grid-cols-25 gap-0 bg-table-head dark:bg-main-1plus text-black dark:text-white rounded-sidebar mb-4">
                 <div className="col-span-5 p-2">DNI</div>
                <div className="col-span-10 p-2">Nombre Completo</div>
                <div className="col-span-5 p-2">Estado</div>
                <div className="col-span-5 p-2">Telefono</div>
              </div>
              <div className="grid grid-cols-25 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
                <div className="col-span-5 p-2 ">{request.dni}</div>
                <div className="col-span-10 p-2 ">{request.fullname}</div>
                <div className="col-span-5 p-2 "><span>{STATUS[request.status as keyof typeof STATUS]}</span></div>
                <div className="col-span-5 p-2 ">{request.phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Documentos y Recursos */}
        <div className="">
          <h2 className="p-2 flex items-center justify-between cursor-pointer bg-white-2 border border-medium rounded-[12px]">
            Listado de documentos solicitados
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
                    onChange={(value) =>
                      handleResultChange(docIndex, value as string)
                    }
                  />
                  <ResourceField
                    name="Documento"
                    allowedFileTypes={[
                      ".pdf",
                      ".doc",
                      ".docx",
                      ".jpg",
                      ".jpeg",
                      ".png",
                    ]}
                    value={document.filename as string}
                    isEditable={document.status === "Pendiente"}
                    onChange={(value) =>
                      handleFileChange(docIndex, value as File[])
                    }
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
                  <div
                    key={resourceIndex}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <ResourceField
                      name={resource.name}
                      value={resource.value}
                      allowedFileTypes={resource.allowedFileTypes || []}
                      isEditable={isUser && document.status === "Pendiente"}
                      onChange={(value) =>
                        handleResourceChange(docIndex, resourceIndex, value)
                      }
                    />
                    {resource.value && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Valor actual:{" "}
                        {typeof resource.value === "string"
                          ? resource.value
                          : "Archivo cargado"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
