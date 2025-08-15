import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Request, RequestsService } from "../services/requestsService";
import { ResourceField } from "../components/public/ResourceField";
import { PageLayout } from "@/features/users/components/shared/PageLayout";
import { PageTitle } from "@/features/users/components/shared/PageTitle";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";

import { useHasRole } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Notify } from "notiflix";
import { useUpload } from "@/shared/hooks/useUpload";
import { apiClient } from "@/lib/axios/client";
import { MdExpandMore } from "react-icons/md";
import { STATUS } from "@/features/auth/constants/status";

/**
 * Enum para los estados del semáforo de documentos
 */
enum SemaforoStatus {
  PENDING = "PENDING",
  CLEAR = "CLEAR",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

/**
 * Configuración de colores y etiquetas para cada estado del semáforo
 */
const semaforoConfig = {
  [SemaforoStatus.PENDING]: {
    color: "bg-gray-500",
    label: "Pendiente",
    textColor: "text-gray-700",
  },
  [SemaforoStatus.CLEAR]: {
    color: "bg-green-500",
    label: "Verde",
    textColor: "text-green-700",
  },
  [SemaforoStatus.WARNING]: {
    color: "bg-yellow-500",
    label: "Ambar",
    textColor: "text-yellow-700",
  },
  [SemaforoStatus.CRITICAL]: {
    color: "bg-red-500",
    label: "Rojo",
    textColor: "text-red-700",
  },
};

/**
 * Página de detalles de una solicitud específica
 * Muestra toda la información del request sin restricciones de rol
 * Permite edición según el tipo de usuario (USER vs ADMIN/RECRUITER)
 */
export const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isRecruiter = useHasRole(ROLES.RECRUITER);
  const isUser = useHasRole(ROLES.USER);
  const { uploadFile } = useUpload();

  const [request, setRequest] = useState<Request | null>(null);
  const [originalRequest, setOriginalRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequestDataExpanded, setIsRequestDataExpanded] = useState(true);
  const [expandedDocuments, setExpandedDocuments] = useState<{
    [key: number]: boolean;
  }>({});

  /**
   * Verifica si hay modificaciones en los recursos de un documento específico
   */
  const hasResourceModifications = (documentIndex: number) => {
    if (!request || !originalRequest) return false;

    const doc = request.documents[documentIndex];
    const originalDoc = originalRequest.documents[documentIndex];

    if (!doc || !originalDoc) return false;

    return doc.resources.some((resource, resourceIndex) => {
      const originalResource = originalDoc.resources[resourceIndex];
      if (!originalResource) return true;

      return resource.value !== originalResource.value;
    });
  };

  /**
   * Obtiene una URL firmada para subir archivos
   */
  const getSignedUrl = async (file: File) => {
    const response = await apiClient.post("/upload/-signed-url", {
      fileName: file.name,
      contentType: file.type,
    });
    return response.data.signedUrl;
  };

  /**
   * Procesa los recursos y maneja la subida de archivos
   */
  const processResources = async (resources: any[]) => {
    const processedResources = [];

    for (const resource of resources) {
      if (Array.isArray(resource.value)) {
        // Si es un array de archivos, subir cada archivo
        await Promise.all(
          resource.value.map(async (file: File) => {
            if (file instanceof File) {
              try {
                const modifiedFileName = `${file.name}-${Date.now()}`;
                const modifiedFile = new File([file], modifiedFileName, { type: file.type });
                const signedUrl = await getSignedUrl(modifiedFile);
                await uploadFile(modifiedFile, signedUrl);
                processedResources.push({
                  resourceId: resource.id,
                  value: modifiedFileName,
                });
              } catch (error) {
                console.error("Error al subir archivo:", error);
                throw new Error(`Error al subir el archivo ${file.name}`);
              }
            }
          })
        );
      } else {
        // Si no es un archivo, usar el valor directamente
        processedResources.push({
          resourceId: resource.id,
          value: resource.value,
        });
      }
    }

    return processedResources;
  };

  /**
   * Envía las correcciones de recursos al backend
   */
  const handleSaveResourceCorrections = async (index: number) => {
    if (!request) return;

    try {
      const document = request.documents[index];
      const resourceCorrections = await processResources(document.resources);

      await RequestsService.sendCorrections(resourceCorrections);

      Notify.success("Correcciones enviadas correctamente");

      // Recargar los datos para reflejar los cambios
      await loadRequestData();
    } catch (error) {
      console.error("Error al enviar correcciones:", error);
      Notify.failure("Error al enviar las correcciones");
    }
  };

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
        setOriginalRequest(JSON.parse(JSON.stringify(response.person))); // Deep copy
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
   * Maneja los cambios en el estado del semáforo del documento (solo ADMIN/RECRUITER)
   */
  const handleSemaforoChange = (documentIndex: number, value: string) => {
    if (!request) return;

    const updatedRequest = { ...request };
    updatedRequest.documents[documentIndex].semaforo = value;
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
        semaforo: doc.semaforo || "",
      }));

      await RequestsService.updateDocuments(updates);
      Notify.success("Cambios guardados exitosamente");

      // Refetch de los datos para obtener la información actualizada
      await loadRequestData();
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

  /**
   * Alterna la visibilidad de un documento específico
   */
  const toggleDocumentExpansion = (docIndex: number) => {
    setExpandedDocuments((prev) => ({
      ...prev,
      [docIndex]: !prev[docIndex],
    }));
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
        </div>
      </div>

      <div className="overflow-y-auto flex flex-col gap-4">
        {/* Información del solicitante */}
        <div className="text-[12px] flex flex-col gap-4">
          <div
            className="p-2 flex items-center justify-between cursor-pointer bg-white-2 border border-medium rounded-[12px]"
            onClick={toggleRequestDataExpansion}
          >
            <h2 className="text-[16px]">Información principal</h2>
            <div
              className={`transition-all duration-300 transform ${
                isRequestDataExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              <MdExpandMore className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
            </div>
          </div>
          {isRequestDataExpanded && (
            <div className="flex flex-col px-3">
              <div className="px-2 grid grid-cols-25 gap-0 bg-table-head dark:bg-main-1plus text-black dark:text-white rounded-sidebar mb-4">
                <div className="col-span-5 p-2">DNI</div>
                <div className="col-span-10 p-2">Nombre Completo</div>
                <div className="col-span-5 p-2">Telefono</div>
                <div className="col-span-5 p-2">Estado</div>
              </div>
              <div className="grid grid-cols-25 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
                <div className="col-span-5 p-2 ">{request.dni}</div>
                <div className="col-span-10 p-2 ">{request.fullname}</div>
                <div className="col-span-5 p-2 ">{request.phone}</div>
                <div className="col-span-5 p-2 ">
                  <span>{STATUS[request.status as keyof typeof STATUS]}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documentos y Recursos */}
        <div className="flex flex-col gap-4">
          <h2 className="p-2 flex items-center justify-between bg-white-2 border border-medium rounded-[12px]">
            Listado de documentos solicitados
          </h2>

          {Object.entries(
            request.documents.reduce((acc, doc) => {
              const key = doc.documentTypeName;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(doc);
              return acc;
            }, {} as Record<string, typeof request.documents>)
          ).map(([documentTypeName, documents]) => {
            return (
            <div
                key={documentTypeName}
                className="px-3 flex flex-col gap-4 text-[14px]"
              >
                <h3 className="text-[16px] font-semibold">
                  {documentTypeName}
                </h3>
                {documents.map((document) => {
                  const docIndex = request.documents.findIndex(
                    (d) => d.id === document.id
                  );
                  const isExpanded = expandedDocuments[docIndex] ?? false;

                  return (
                    <div key={docIndex}>
                      {/* Header del documento */}
                      <div
                        className="p-2 flex justify-between items-center border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10 cursor-pointer"
                        onClick={() => toggleDocumentExpansion(docIndex)}
                      >
                        <div className="flex items-center gap-3">
                          <h3 className="">{document.name}</h3>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span
                            className={`text-[12px] px-3 py-1 rounded-full  ${
                              document.status === "Pendiente"
                                ? "bg-warning"
                                : document.status === "Realizado"
                                ? "bg-success"
                                : "bg-medium"
                            }`}
                          >
                            {document.status}
                          </span>
                          <div
                            className={`transition-all duration-300 transform ${
                              isExpanded ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            <MdExpandMore className="w-[20px] h-[20px] text-black-2 dark:text-white-1" />
                          </div>
                        </div>
                      </div>

                {isExpanded && (
                        <div className="flex flex-col gap-3">
                          {/* Recursos del documento */}
                          <div className="p-3 border border-white-1 rounded-[12px]">
                            <div className="flex justify-between items-start">
                              <p className="mb-2 font-[500] text-gray-900 dark:text-white">
                                Recursos requeridos para el informe
                                correspondiente:
                              </p>
                              {isUser &&
                                request.status === "PENDING" &&
                                hasResourceModifications(docIndex) && (
                                  <button
                                    onClick={() =>
                                      handleSaveResourceCorrections(docIndex)
                                    }
                                    className="px-3 py-0.5 border rounded-[4px] text-[12px] border-blue-500 hover:border-blue-600 hover:bg-blue-500 text-blue-500 hover:text-white cursor-pointer"
                                  >
                                    Guardar recursos
                                  </button>
                                )}
                            </div>
                            {document.resources.map(
                              (resource, resourceIndex) => (
                                <ResourceField
                                  key={resourceIndex}
                                  name={resource.name}
                                  value={resource.value}
                                  allowedFileTypes={
                                    resource.allowedFileTypes || []
                                  }
                                  isEditable={
                                    isUser && request.status === "PENDING"
                                  }
                                  onChange={(value) =>
                                    handleResourceChange(
                                      docIndex,
                                      resourceIndex,
                                      value
                                    )
                                  }
                                />
                              ))}
                    </div>
                    {/* Campos específicos para ADMIN/RECRUITER */}
                          {(isAdmin || isRecruiter) && (
                            <div className="p-3 border border-white-1 rounded-[12px]">
                              <div className="flex justify-between items-start">
                                <p className="mb-2 font-medium text-gray-900 dark:text-white">
                                  Resultados obtenidos para el informe
                                  correspondiente:
                                </p>
                                {((isAdmin || isRecruiter) &&
                                  document.status === "Pendiente") && (
                                  <button
                                    onClick={handleSave}
                                    disabled={
                                      saving ||
                                      !document.filename ||
                                      !document.result
                                    }
                                    className={`px-3 py-0.5 border rounded-[4px] text-[12px] ${
                                      saving ||
                                      !document.filename ||
                                      !document.result
                                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                        : "border-success hover:border-medium hover:bg-success text-success hover:text-white cursor-pointer"
                                    }`}
                                  >
                                    {saving
                                      ? "Guardando..."
                                      : "Guardar cambios"}
                                  </button>
                                )}
                              </div>

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
                                isResult={true}
                                value={document.filename as string}
                                isEditable={document.status === "Pendiente"}
                                onChange={(value) =>
                                  handleFileChange(
                                    docIndex,
                                    value as File[]
                                  )
                                }
                              />
                              <ResourceField
                                isResult={true}
                                name="Resultado"
                                allowedFileTypes={[]}
                                value={document.result as string}
                                isEditable={document.status === "Pendiente"}
                                onChange={(value) =>
                                  handleResultChange(
                                    docIndex,
                                    value as string
                                  )
                                }
                              />

                        {/* Campo de semáforo */}
                        <div className="mt-4 flex gap-4">
                          <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Estado del Semáforo
                          </label>
                          <select
                            value={document.semaforo || SemaforoStatus.PENDING}
                            onChange={(e) =>
                              handleSemaforoChange(docIndex, e.target.value)
                            }
                            disabled={document.status !== "Pendiente"}
                            className=" border border-white-1 dark:border-white rounded-[8px]  disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            {Object.values(SemaforoStatus).map((status) => (
                              <option key={status} value={status}>
                                {semaforoConfig[status].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                     {/* Campos específicos para USER */}
                          {isUser && (
                            <div className="p-3 border border-white-1 rounded-[12px]">
                              <p className="mb-2 font-medium text-gray-900 dark:text-white">
                                Resultados obtenidos para el informe
                                correspondiente:
                              </p>
                              <ResourceField
                                isResult={true}
                                name="Informe"
                                value={document.filename as string}
                                isEditable={false}
                                allowedFileTypes={[]}
                              />
                              <ResourceField
                                isResult={true}
                                name="Comentarios adicionales"
                                value={document.result as string}
                                isEditable={false}
                                allowedFileTypes={[]}
                              />

                        {/* Visualización del semáforo para usuarios */}
                        <div className="mt-4 flex gap-8 items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Semaforización
                            </label>
                            <div className="flex justify-around gap-3 w-[200px] px-4 py-1 border border-black dark:border-white rounded-[8px]">
                              {/* Círculo Verde - CLEAR */}
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  (document.semaforo as SemaforoStatus) === SemaforoStatus.CLEAR
                                    ? 'bg-success'
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                              {/* Círculo Amarillo - WARNING */}
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  (document.semaforo as SemaforoStatus) === SemaforoStatus.WARNING
                                    ? 'bg-warning'
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                              {/* Círculo Rojo - CRITICAL */}
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  (document.semaforo as SemaforoStatus) === SemaforoStatus.CRITICAL
                                    ? 'bg-error'
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                            </div>
                          </div>

                      </div>
                    )}
                  </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};
