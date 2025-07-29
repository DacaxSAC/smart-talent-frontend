// External libraries
import { Notify } from "notiflix";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NoData } from "@/shared/components/NoData";
import { MdExpandMore } from "react-icons/md";

// Internal services and utilities
import { apiClient } from "@/lib/axios/client";
import { STATUS } from "@/features/auth/constants/status";
import { ROLES } from "@/features/auth/constants/roles";
import {
  Request,
  RequestsService,
} from "@/features/requests/services/requestsService";

// Components
import { Modal } from "@/shared/components/Modal";
import { ResourceField } from "@/features/requests/components/public/ResourceField";
import { Button } from "@/shared/components/Button";

// Hooks
import { useUpload } from "@/shared/hooks/useUpload";
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";

import { Loader } from "@/shared/components/Loader";

//const processDocuments = async (
//  documents: any[],
//  uploadFile: (file: File, signedUrl: string) => Promise<any>
//) => {
//  const documentsToUpdate = [];
//
//  for (const doc of documents) {
//    if (doc.filename instanceof File) {
//      const fileKey = await handleFileUpload(doc.filename, uploadFile);
//      if (fileKey) {
//        documentsToUpdate.push({
//          id: doc.id,
//          result: doc.result || "",
//          filename: fileKey,
//        });
//      }
//    }
//  }
//
//  return documentsToUpdate;
//};

const handleFileUpload = async (
  file: File,
  uploadFile: (file: File, signedUrl: string) => Promise<any>
) => {
  try {
    const response = await apiClient.post("upload/write-signed-url", {
      fileName: file.name,
      contentType: file.type,
    });

    if (response.status !== 200) {
      throw new Error("Failed to get signed URL");
    }

    const { signedUrl, key } = response.data;
    await uploadFile(file, signedUrl);
    return key;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

interface requestsTableProps {
  data: Request[];
  isLoading: boolean;
  isError: boolean;
  loadingText: string;
  errorText: string;
  onRefresh: () => Promise<void>;
}

export const RequestsTable = ({
  data,
  isLoading,
  isError,
  loadingText,
  errorText,
  onRefresh,
}: requestsTableProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Hooks
  const isAdmin = useHasRole([ROLES.ADMIN]);
  const isUser = useHasRole([ROLES.USER]);
  const isRecruiter = useHasRole([ROLES.RECRUITER]);
  const { uploadFile } = useUpload();
  const { user } = useUser();

  // States
  //const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  //const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [requestToAccept, setRequestToAccept] = useState<number | null>(null);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [observationModalOpen, setObservationModalOpen] = useState(false);
  const [requestToObserve, setRequestToObserve] = useState<number | null>(null);
  const [observation, setObservation] = useState("");
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const [viewObservationsModalOpen, setViewObservationsModalOpen] =
    useState(false);
  const [requestToViewObservations, setRequestToViewObservations] = useState<
    number | null
  >(null);
  const [isProcessingObservation, setIsProcessingObservation] = useState(false);

  const [correctionsModalOpen, setCorrectionsModalOpen] = useState(false);
  const [requestToCorrect, setRequestToCorrect] = useState<number | null>(null);
  const [resourceCorrections, setResourceCorrections] = useState<{
    [key: number]: File[] | string | null;
  }>({});
  const [isSendingCorrections, setIsSendingCorrections] = useState(false);
  //const [isConfirmingRequest, setIsConfirmingRequest] = useState(false);
  
  // Estados para expansión de secciones
  const [isRequestDataExpanded, setIsRequestDataExpanded] = useState(true);
  const [expandedDocuments, setExpandedDocuments] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    setRequests(data);
    console.log("data", data);
  }, [data]);

  // Funciones para expansión de secciones
  const toggleRequestDataExpansion = () => {
    setIsRequestDataExpanded(!isRequestDataExpanded);
  };

  const toggleDocumentExpansion = (docIndex: number) => {
    setExpandedDocuments(prev => ({
      ...prev,
      [docIndex]: !prev[docIndex]
    }));
  };

  //const handleRequests = (newRequests: Request[]) => {
  //  setRequests(newRequests);
  //};

  /**
   * Navega a la página de detalles del request
   * Pasa los datos del request a través del state de navegación
   */
  const handleViewDetails = (request: Request) => {
    const currentPath = location.pathname;
    const detailPath = `${currentPath}/detail/${request.id}`;
    
    navigate(detailPath, {
      state: { request }
    });
  };

  //const handleConfirmRequest = async () => {
  //  if (selectedRequest === null) return;
//
  //  if (isUser) {
  //    setModalOpen(false);
  //    return;
  //  }
//
  //  try {
  //    setIsConfirmingRequest(true);
  //    Notify.info("Procesando informes...");
//
  //    const selectedRequestData = requests[selectedRequest];
  //    const documentsToUpdate = await processDocuments(
  //      selectedRequestData.documents,
  //      uploadFile
  //    );
//
  //    await RequestsService.updateDocuments(documentsToUpdate);
  //    await RequestsService.putStatusPerson(selectedRequest, "COMPLETED");
//
  //    await onRefresh();
  //    setModalOpen(false);
  //    Notify.success("Informes actualizados correctamente");
  //  } catch (error) {
  //    console.error("Error al actualizar los informes:", error);
  //    Notify.failure(
  //      "Error al actualizar los informes. Por favor, inténtelo de nuevo."
  //    );
  //  } finally {
  //    setIsConfirmingRequest(false);
  //  }
//
  //  setModalOpen(false);
  //};

  //const openResourceModal = (index: number) => {
  //  setSelectedRequest(index);
  //  setModalOpen(true);
  //};

  /**
   * Abre el modal de confirmación para aceptar una solicitud
   * @param index - Índice de la solicitud a aceptar
   */
  const handleOpenAcceptModal = (index: number) => {
    setRequestToAccept(index);
    setConfirmModalOpen(true);
  };

  /**
   * Cierra el modal de confirmación
   */
  const handleCancelAccept = () => {
    setRequestToAccept(null);
    setConfirmModalOpen(false);
  };

  /**
   * Maneja la confirmación de aceptar una solicitud
   */
  const handleConfirmAccept = async () => {
    if (requestToAccept !== null && user) {
      try {
        setIsAcceptingRequest(true);
        const personId = parseInt(requests[requestToAccept].id); // Convertir string a number
        const userId = user.id; // Convertir number a string

        await RequestsService.assignRecruiter(personId, userId);

        // Refetch de las solicitudes para actualizar el estado
        await onRefresh();

        // Cerrar el modal
        setRequestToAccept(null);
        setConfirmModalOpen(false);

        Notify.success("Solicitud aceptada exitosamente");
      } catch (error) {
        console.error("Error al aceptar la solicitud:", error);
        Notify.failure(
          "Error al aceptar la solicitud. Por favor, inténtelo de nuevo."
        );
      } finally {
        setIsAcceptingRequest(false);
      }
    }
  };

  /**
   * Abre el modal para agregar observación
   */
  const handleOpenObservationModal = (index: number) => {
    setRequestToObserve(index);
    setObservation("");
    setObservationModalOpen(true);
  };

  /**
   * Cierra el modal de observación
   */
  const handleCancelObservation = () => {
    setRequestToObserve(null);
    setObservation("");
    setObservationModalOpen(false);
  };

  /**
   * Maneja la confirmación de agregar observación
   */
  const handleConfirmObservation = async () => {
    if (requestToObserve !== null && observation.trim()) {
      try {
        setIsAddingObservation(true);
        const personId = parseInt(requests[requestToObserve].id); // Convertir string a number

        // TODO: Implementar el servicio real
        console.log("personId:", personId);
        console.log("observation:", observation);
        await RequestsService.postObservations(personId, observation);

        // Refetch de las solicitudes para actualizar el estado
        await onRefresh();

        // Cerrar el modal
        setRequestToObserve(null);
        setObservation("");
        setObservationModalOpen(false);

        Notify.success("Observación agregada exitosamente");
      } catch (error) {
        console.error("Error al agregar observación:", error);
        Notify.failure(
          "Error al agregar observación. Por favor, inténtelo de nuevo."
        );
      } finally {
        setIsAddingObservation(false);
      }
    }
  };

  /**
   * Abre el modal para ver observaciones
   */
  const handleOpenViewObservationsModal = (index: number) => {
    setRequestToViewObservations(index);
    setViewObservationsModalOpen(true);
  };

  /**
   * Cierra el modal de ver observaciones
   */
  const handleCancelViewObservations = () => {
    setRequestToViewObservations(null);
    setViewObservationsModalOpen(false);
  };

  /**
   * Maneja la acción de rechazar desde el modal de observaciones
   */
  const handleRejectFromObservations = async () => {
    if (requestToViewObservations !== null) {
      try {
        setIsProcessingObservation(true);
        const personId = parseInt(requests[requestToViewObservations].id);

        // Usar el servicio putStatusPerson para rechazar la solicitud
        await RequestsService.putStatusPerson(personId, "REJECTED");

        // Refetch de las solicitudes para actualizar el estado
        await onRefresh();

        // Cerrar el modal
        setRequestToViewObservations(null);
        setViewObservationsModalOpen(false);

        Notify.success("Solicitud rechazada exitosamente");
      } catch (error) {
        console.error("Error al rechazar la solicitud:", error);
        Notify.failure(
          "Error al rechazar la solicitud. Por favor, inténtelo de nuevo."
        );
      } finally {
        setIsProcessingObservation(false);
      }
    }
  };

  /**
   * Maneja la acción de aceptar desde el modal de observaciones
   * Abre el modal de correcciones
   */
  const handleAcceptFromObservations = () => {
    if (requestToViewObservations !== null) {
      // Cerrar el modal de observaciones
      setViewObservationsModalOpen(false);

      // Abrir el modal de correcciones con el mismo request
      setRequestToCorrect(requestToViewObservations);
      setCorrectionsModalOpen(true);

      // Inicializar las correcciones con los valores actuales
      const currentRequest = requests[requestToViewObservations];
      const initialCorrections: { [key: number]: File[] | string | null } = {};

      currentRequest.documents.forEach((doc) => {
        doc.resources.forEach((resource) => {
          initialCorrections[resource.id] = resource.value || "";
        });
      });

      setResourceCorrections(initialCorrections);

      // Limpiar el estado de observaciones
      setRequestToViewObservations(null);
    }
  };

  /**
   * Cierra el modal de correcciones
   */
  const handleCancelCorrections = () => {
    setRequestToCorrect(null);
    setCorrectionsModalOpen(false);
    setResourceCorrections({});
  };

  /**
   * Maneja el cambio de valor de un recurso (texto o archivos)
   */
  const handleResourceCorrectionChange = (
    resourceId: number,
    value: File[] | string | null
  ) => {
    setResourceCorrections((prev) => ({
      ...prev,
      [resourceId]: value,
    }));
  };

  /**
   * Maneja el envío de correcciones con el formato requerido por el API
   */
  const handleSendCorrections = async () => {
    if (requestToCorrect !== null) {
      try {
        setIsSendingCorrections(true);

        // Procesar las correcciones, subiendo archivos si es necesario
        const resources = [];

        // Obtener la solicitud actual para acceder a la estructura de recursos
        const currentRequest = requests[requestToCorrect];

        for (const [resourceId, value] of Object.entries(resourceCorrections)) {
          let processedValue = value;

          // Si el valor es un array de archivos, procesarlos
          if (Array.isArray(value) && value.length > 0) {
            const file = value[0]; // Tomar el primer archivo
            const fileKey = await handleFileUpload(file, uploadFile);
            processedValue = fileKey || file.name;
          }

          // Preparar el objeto de corrección en el formato esperado por el API
          const resource = {
            resourceId: parseInt(resourceId),
            value: processedValue as string,
          };

          resources.push(resource);
        }

        console.log("Enviando correcciones:", {
          requestId: currentRequest.id,
          resources,
        });

        // Enviar las correcciones usando el servicio
        await RequestsService.sendCorrections(resources);
        await RequestsService.putStatusPerson(
          parseInt(currentRequest.id),
          "IN_PROGRESS"
        );

        // Refetch de las solicitudes para actualizar el estado
        await onRefresh();

        // Cerrar el modal
        handleCancelCorrections();

        Notify.success("Correcciones enviadas exitosamente");
      } catch (error) {
        console.error("Error al enviar correcciones:", error);
        Notify.failure(
          "Error al enviar correcciones. Por favor, inténtelo de nuevo."
        );
      } finally {
        setIsSendingCorrections(false);
      }
    }
  };

  if (isLoading && !isError) {
    return <Header type={HeaderType.LOADING} description={loadingText} />;
  }

  if (isError) {
    return <Header type={HeaderType.ERROR} description={errorText} />;
  }

  if (requests.length === 0) {
    return <NoData />;
  }

  return (
    <div className="w-full text-[12px] font-light">
      {/* Header */}
      <div
        className={`px-2 grid ${
          isAdmin ? "grid-cols-44" : "grid-cols-38"
        } gap-0 bg-table-head dark:bg-main-1plus text-black dark:text-white rounded-sidebar mb-4`}
      >
        {isAdmin && <div className="col-span-6 p-2">Propietario</div>}
        <div className="col-span-5 p-2">DNI</div>
        <div className="col-span-6 p-2">Nombre Completo</div>
        <div className="col-span-5 p-2">Estado</div>
        <div className="col-span-16 p-2">Informes</div>
        <div className="col-span-6 p-2">Acciones</div>
      </div>

      {/* Rows */}
      <div className="text-black dark:text-white flex flex-col gap-2">
        {requests.map((request, index) => (
          <div key={index}>
            {/* Main Row */}
            <div
              className={`px-2 grid ${
                isAdmin ? "grid-cols-44" : "grid-cols-38"
              } border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10`}
            >
              {/** Propietario */}
              {isAdmin && <div className="col-span-6 p-2">{request.owner}</div>}
              {/** DNI */}
              <div className="col-span-5 p-2 ">{request.dni}</div>
              {/** Nombre Completo */}
              <div className="col-span-6 p-2 ">{request.fullname}</div>
              {/** Estado */}
              <div className="col-span-5 p-2">
                <span>{STATUS[request.status as keyof typeof STATUS]}</span>
              </div>
              {/** Lista de documentos */}
              <div className="col-span-16 p-2">
                <div className="flex flex-wrap gap-1">
                  {request.documents.map((doc, docIndex: number) => (
                    <span
                      key={docIndex}
                      className={`${
                        doc.filename
                          ? "bg-success text-white"
                          : "border border-white-1 dark:border-black-1 text-black dark:text-white"
                      } py-0.5 px-2 rounded-[5px]`}
                    >
                      {doc.name}
                    </span>
                  ))}
                </div>
              </div>
              {/** Acciones */}
              <div className="col-span-6 p-2 text-center flex flex-col justify-start items-start gap-1">
                {(isAdmin ||
                  isUser ||
                  (isRecruiter &&
                    (request.status !== "PENDING"))) && (
                  <button
                    title="Ver detalles de solicitud"
                    className="cursor-pointer text-center hover:text-table-head border border-white-1 px-1 rounded-[5px]"
                    onClick={() => handleViewDetails(request)}
                  >
                    <p>Ver detalles</p>
                  </button>
                )}
                {isRecruiter && request.status === "PENDING" && (
                  <button
                    className="cursor-pointer bg-success text-white py-0.5 px-1 rounded-[5px]"
                    onClick={() => handleOpenAcceptModal(index)}
                  >
                    Aceptar solicitud
                  </button>
                )}
                {isRecruiter && request.status === "IN_PROGRESS" && (
                  <button
                    className="cursor-pointer bg-success text-white py-0.5 px-1 rounded-[5px]"
                    onClick={() => handleOpenObservationModal(index)}
                  >
                    Agregar observación
                  </button>
                )}
                {isUser &&
                  request.status === "OBSERVED" &&
                  request.observations && (
                    <button
                      className="cursor-pointer bg-success text-white py-0.5 px-1 rounded-[5px]"
                      onClick={() => handleOpenViewObservationsModal(index)}
                    >
                      Ver observaciones
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/** Modal para ver y cargar archivos 
      <Modal
        isOpen={modalOpen}
        title={
          isUser
            ? "Visualización y descarga de archivos"
            : "Carga de informes solicitados"
        }
        onClose={
          isConfirmingRequest
            ? () => {}
            : () => {
                setModalOpen(false);
                if (
                  selectedRequest !== null &&
                  requests[selectedRequest]?.documents
                ) {
                  const newRequests = [...requests];
                  newRequests[selectedRequest].documents = newRequests[
                    selectedRequest
                  ].documents.filter(
                    (doc: any) => doc.resources && doc.resources.length > 0
                  );
                  handleRequests(newRequests);
                }
              }
        }
        position="center"
        width="800px"
        className="dark:text-white"
        footer={
          <>
            {isUser ? null : selectedRequest !== null &&
              requests[selectedRequest]?.documents.some(
                (doc: any) => doc.status === "Pendiente"
              ) ? (
              isConfirmingRequest ? (
                <div className="flex items-center gap-2">
                  <Loader isLoading={true} />
                  <span className="text-sm text-gray-600">
                    Procesando informes...
                  </span>
                </div>
              ) : (
                <button
                  className="px-4 py-2 text-sm bg-main text-white rounded-md hover:bg-opacity-90"
                  onClick={handleConfirmRequest}
                >
                  Confirmar
                </button>
              )
            ) : (
              <button
                className="px-4 py-2 text-sm bg-main text-white rounded-md hover:bg-opacity-90"
                onClick={() => setModalOpen(false)}
              >
                OK
              </button>
            )}
          </>
        }
      >
        <div className="flex flex-col">
          {selectedRequest !== null && requests[selectedRequest] && (
            <div className="text-sm">
              {requests[selectedRequest]?.documents.map((doc: any, i: any) => (
                <div
                  key={i}
                  className="gap-2 border-b border-gray-300 px-[32px] py-[15px]"
                >
                  <div className="flex w-full justify-between">
                    <h2 className="text-[24px]">{doc.name}</h2>
                    <span
                      className={
                        doc.status == "Pendiente"
                          ? "text-yellow-500 text-[16px]"
                          : "text-green-500 text-[16px]"
                      }
                    >
                      {doc.status}
                    </span>
                  </div>
                  {isAdmin || isRecruiter ? (
                    <div className="flex flex-col">
                      <ResourceField
                        name="Resultado"
                        allowedFileTypes={[]}
                        value={doc.result as string}
                        isEditable={doc.status === "Pendiente"}
                        onChange={(value) => {
                          if (selectedRequest !== null) {
                            const newRequests = [...requests];
                            newRequests[selectedRequest].documents[i].result =
                              value as string;
                            handleRequests(newRequests);
                          }
                        }}
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
                        value={doc.filename as string}
                        isEditable={doc.status === "Pendiente"}
                        onChange={(value) => {
                          if (value && selectedRequest !== null) {
                            const newRequests = [...requests];
                            if (Array.isArray(value) && value.length > 0) {
                              newRequests[selectedRequest].documents[
                                i
                              ].filename = value[0];
                            }
                            handleRequests(newRequests);
                          }
                        }}
                      />

                      {doc.resources.map((resource: any, j: any) => (
                        <ResourceField
                          key={j}
                          {...resource}
                          isEditable={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <ResourceField
                        key={Date.now() - 1}
                        name="Comentarios"
                        value={doc.result as string}
                        isEditable={false}
                        allowedFileTypes={[]}
                      />
                      <ResourceField
                        key={Date.now() - 2}
                        name="Documento"
                        value={doc.filename as string}
                        isEditable={false}
                        allowedFileTypes={[]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>*/}

      {/* Modal de confirmación para aceptar solicitud */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={isAcceptingRequest ? () => {} : handleCancelAccept}
        position="center"
        width="400px"
        title="¿Está seguro que desea aceptar esta solicitud?"
        footer={
          <div className="flex gap-4">
                <Button
                  type="secondary"
                  handleClick={handleCancelAccept}
                  description="Cancelar"
                />
                <Button
                  type="primary"
                  handleClick={handleConfirmAccept}
                  description="Confirmar"
                />
              </div>
        }
      >
        <div className="">
          {isAcceptingRequest ? (
            <Loader isLoading={true} />
          ) : (
            <>
              <div className="flex flex-col gap-2 text-[12px] text-medium">
                Al aceptar esta solicitud, usted es responsable del proceso completo de la misma.
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Modal para añadir observación */}
      <Modal
        isOpen={observationModalOpen}
        onClose={isAddingObservation ? () => {} : handleCancelObservation}
        position="center"
        width="500px"
        title="Añadir observaciones a la solicitud"
        footer={
          <div className="flex">
            <Button
              type="primary"
              handleClick={handleConfirmObservation}
              description="Enviar observaciones"
            />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {isAddingObservation ? (
            <Loader isLoading={true} />
          ) : (
            <>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Escriba su observación aquí..."
                rows={4}
                className="w-full p-4 text-[14px] border border-[#C3C3C3] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-table-head focus:border-transparent placeholder-gray-400 resize-none"
              />
              <div className="flex flex-col text-medium text-[12px]">
                <p>Se le recordará al cliente:</p>
                <p>
                  -Sí acepta levantar las observaciones, será redirigido a la
                  vista editar los datos de la solicitud.
                </p>
                <p>
                  -Si rechaza levantar observaciones, se terminará el proceso.
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Modal para ver observaciones */}
      <Modal
        isOpen={viewObservationsModalOpen}
        onClose={
          isProcessingObservation ? () => {} : handleCancelViewObservations
        }
        title="Observaciones de la solicitud"
        position="center"
        width="600px"
        className="dark:text-white"
        footer={
          <div className="flex gap-3 justify-end">
            {isProcessingObservation ? (
              <Loader isLoading={true} />
            ) : (
              <>
                <Button
                  type="secondary"
                  handleClick={handleRejectFromObservations}
                  description="Rechazar"
                />
                <Button
                  type="primary"
                  handleClick={handleAcceptFromObservations}
                  description="Aceptar"
                />
              </>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {requestToViewObservations !== null &&
            requests[requestToViewObservations] && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[12px]">
                    Las observaciones planteadas fueron descritas por:
                  </p>
                  <div className="flex gap-2">
                    <p className="text-[12px] font-[500]">Reclutador:</p>
                    <p className="text-[12px]">
                      {requests[requestToViewObservations].Users[0].username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-[12px] font-[500]">Contacto:</p>
                    <p className="text-[12px]">
                      {requests[requestToViewObservations].Users[0].email}
                    </p>
                  </div>
                </div>

                <div className="text-[14px] border border-[#C3C3C3] p-4 rounded-[4px]">
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                    {requests[requestToViewObservations].observations ||
                      "No hay observaciones disponibles."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-medium">
                  <p>
                    Sí acepta levantar las observaciones, será redirigido a la
                    vista editar los datos de la solicitud.
                  </p>

                  <p>
                    Si rechaza levantar observaciones, se terminará el proceso.
                  </p>
                </div>
              </div>
            )}
        </div>
      </Modal>

      {/* Modal de Correcciones */}
      <Modal
        isOpen={correctionsModalOpen}
        title="Correcciones de Recursos"
        onClose={isSendingCorrections ? () => {} : handleCancelCorrections}
        position="center"
        width="800px"
        className=""
        footer={
          <div className="flex gap-3 justify-end">
            <>
              <Button
                type="secondary"
                handleClick={handleCancelCorrections}
                description="Cancelar"
                disabled={isSendingCorrections}
              />
              <Button
                type="primary"
                description="Enviar correcciones"
                handleClick={handleSendCorrections}
                disabled={isSendingCorrections}
              />
            </>
          </div>
        }
      >
        {requestToCorrect !== null && requests[requestToCorrect] && (
          <>
            {isSendingCorrections ? (
              <div className="flex items-center justify-center py-12">
                <Loader isLoading={true} />
                <span className="ml-3 text-gray-600">
                  Enviando correcciones...
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Información del solicitante */}
                <div className="text-[12px] flex flex-col gap-4">
                  <div
                    className="p-2 flex items-center justify-between cursor-pointer bg-white-2 border border-medium rounded-[12px]"
                    onClick={toggleRequestDataExpansion}
                  >
                    <h2 className="text-[16px]">Información del Solicitante</h2>
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
                        <div className="col-span-5 p-2">Estado</div>
                        <div className="col-span-5 p-2">Teléfono</div>
                      </div>
                      <div className="grid grid-cols-25 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
                        <div className="col-span-5 p-2">{requests[requestToCorrect].dni}</div>
                        <div className="col-span-10 p-2">{requests[requestToCorrect].fullname}</div>
                        <div className="col-span-5 p-2 ">
                          <span>
                            {STATUS[requests[requestToCorrect].status as keyof typeof STATUS]}
                          </span>
                        </div>
                        <div className="col-span-5 p-2">{requests[requestToCorrect].phone}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documentos y Recursos */}
                <div className="space-y-4">
                  <h2 className="text-[16px] font-semibold">Documentos y Recursos</h2>
                  {requests[requestToCorrect].documents
                    .sort((a, b) => {
                      // Ordenar para que "Pendiente" aparezca primero
                      if (a.status === "Pendiente" && b.status !== "Pendiente") return -1;
                      if (a.status !== "Pendiente" && b.status === "Pendiente") return 1;
                      return 0;
                    })
                    .map((document, docIndex) => {
                    const isExpanded = expandedDocuments[docIndex] ?? false;
                    const canExpand = document.status !== "Realizado";

                    return (
                      <div key={docIndex} className="px-3 flex flex-col gap-4 text-[14px]">
                        {/* Header del documento */}
                        <div
                          className={`p-2 flex justify-between items-center border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10 ${
                            canExpand ? "cursor-pointer" : "cursor-default"
                          }`}
                          onClick={() => canExpand && toggleDocumentExpansion(docIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <h3 className="">{document.name}</h3>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span
                              className={`text-[12px] px-3 py-1 rounded-full ${
                                document.status === "Pendiente"
                                  ? "bg-warning"
                                  : document.status === "Realizado"
                                  ? "bg-success"
                                  : "bg-medium"
                              }`}
                            >
                              {document.status}
                            </span>
                            {canExpand && (
                              <div
                                className={`transition-all duration-300 transform ${
                                  isExpanded ? "rotate-180" : "rotate-0"
                                }`}
                              >
                                <MdExpandMore className="w-[20px] h-[20px] text-black-2 dark:text-white-1" />
                              </div>
                            )}
                          </div>
                        </div>

                        {isExpanded && canExpand && (
                          <div className="flex flex-col gap-3">
                            {/* Recursos del documento */}
                            <div className="p-3 border border-white-1 rounded-[12px]">
                              <p className="mb-2 font-[500] text-gray-900 dark:text-white">
                                Recursos requeridos para corrección:
                              </p>
                              {document.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="mb-4">
                                  <ResourceField
                                    name={resource.name}
                                    value={resource.value}
                                    allowedFileTypes={resource.allowedFileTypes || []}
                                    isEditable={true}
                                    onChange={(value: string | File[] | null) =>
                                      handleResourceCorrectionChange(resource.id, value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

enum HeaderType {
  LOADING = "LOADING",
  ERROR = "ERROR",
}

interface HeaderProps {
  type: HeaderType;
  description: string;
}

const Header = ({ type, description }: HeaderProps) => {
  const styles = {
    main: "px-4 py-2 mb-4 font-light text-[14px] rounded-sidebar text-center",
    [HeaderType.LOADING]:
      "bg-white-1 dark:bg-black-2 text-black dark:text-white",
    [HeaderType.ERROR]: "bg-error hover:bg-error-1 text-white",
  };
  return (
    <div className={`${styles["main"]} ${styles[type]}`}>{description}</div>
  );
};
