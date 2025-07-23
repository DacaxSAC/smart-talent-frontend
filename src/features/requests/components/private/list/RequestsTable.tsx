// External libraries
import { Notify } from "notiflix";
import { useEffect, useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";

// Internal services and utilities
import { apiClient } from "@/lib/axios/client";
import { STATUS } from "@/features/auth/constants/status";
import { ROLES } from "@/features/auth/constants/roles";
import { Request, RequestsService } from "@/features/requests/services/requestsService";

// Components
import { Modal } from "@/shared/components/Modal";
import { ResourceOutput } from "../../public/ResourceOutput";

// Hooks
import { useUpload } from '@/shared/hooks/useUpload';
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";

import { Loader } from "@/shared/components/Loader";

interface requestsTableProps {
  data: Request[];
  isLoading: boolean;
  isError: boolean;
  loadingText: string;
  errorText: string;
  onRefresh: () => Promise<void>;
}

export const RequestsTable = ({ data, isLoading, isError, loadingText, errorText, onRefresh }: requestsTableProps) => {
  // Hooks
  const isAdmin = useHasRole([ROLES.ADMIN]);
  const isUser = useHasRole([ROLES.USER]);
  const isRecruiter = useHasRole([ROLES.RECRUITER]);
  const { uploadFile } = useUpload();
  const { user } = useUser();

  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [requestToAccept, setRequestToAccept] = useState<number | null>(null);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);

  useEffect(() => { 
    setRequests(data);
    console.log('data', data);
  }, [data]);

  const handleRequests = (newRequests: Request[]) => {
    setRequests(newRequests);
  };

  const handleConfirmRequest = async () => {
    if (selectedRequest === null) return;

    if (isUser) {
      setModalOpen(false);
      return;
    }

    try {
      Notify.info('Procesando informes...');
      
      const selectedRequestData = requests[selectedRequest];
      const documentsToUpdate = await processDocuments(selectedRequestData.documents, uploadFile);

      await RequestsService.updateDocuments(documentsToUpdate);
      
      // En lugar de actualizar el estado local, recargamos los datos
      await onRefresh();
      setModalOpen(false);
      Notify.success('Informes actualizados correctamente');

    } catch (error) {
      console.error('Error al actualizar los informes:', error);
      Notify.failure('Error al actualizar los informes. Por favor, inténtelo de nuevo.');
    }

    setModalOpen(false);
  };

  const handleToggleRow = (index: number) => {
    setOpenRows((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]);
  };

  const openResourceModal = (index: number) => {
    setSelectedRequest(index);
    setModalOpen(true);
  };

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
        
        Notify.success('Solicitud aceptada exitosamente');
      } catch (error) {
        console.error('Error al aceptar la solicitud:', error);
        Notify.failure('Error al aceptar la solicitud. Por favor, inténtelo de nuevo.');
      } finally {
        setIsAcceptingRequest(false);
      }
    }
  };

  if (isLoading && !isError) {
    return <Header type={HeaderType.LOADING} description={loadingText} />
  }

  if (isError) {
    return <Header type={HeaderType.ERROR} description={errorText} />
  }

  return (
    <div className="w-full text-[14px] font-karla font-light">
      {/* Header */}
      <div className="px-2 grid grid-cols-12 gap-0 bg-main-3plus dark:bg-main-1plus text-black dark:text-white rounded-sidebar mb-4">
        {isAdmin &&
          <div className="col-span-1 p-2">Propietario</div>
        }
        <div className="col-span-1 p-2">DNI</div>
        <div className="col-span-3 p-2 hidden md:block">Nombre Completo</div>
        <div className="col-span-1 p-2 hidden md:block">Estado</div>
        <div className="col-span-5 p-2 hidden md:block">Informes</div>
        <div className="col-span-1 p-2 hidden md:block">Acciones</div>
        <div className="col-span-1 p-2 md:hidden">Acciones</div>
      </div>

      {/* Rows */}
      <div className="text-black dark:text-white flex flex-col gap-2">
        {requests.map((request, index) => (
          <div key={index}>
            {/* Main Row */}
            <div className="px-2 grid grid-cols-12 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
              {isAdmin &&
                <div className="col-span-1 p-2">
                  {request.owner}
                </div>
              }
              <div className="col-span-1 p-2 ">
                {request.dni}
              </div>
              <div className="col-span-3 p-2 ">
                {request.fullname}
              </div>
              <div className="col-span-1 p-2  hidden md:block">
                <span>{STATUS[request.status as keyof typeof STATUS]}</span>
              </div>
              <div className="col-span-5 p-2  hidden md:block">
                <div className="flex flex-wrap gap-1">
                  {request.documents.map((doc: any, docIndex: number) => (
                    <span
                      key={docIndex}

                      className={`${doc.state
                        ? "bg-success text-white"
                        : "border border-white-1 dark:border-black-1 text-black dark:text-white"
                        } py-0.5 px-2 rounded-[5px]`}
                    >
                      {doc.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 p-2  hidden md:block text-center">
                <button
                  title="Ver detalles de solicitud"
                  className="cursor-pointer text-center hover:text-main-2plus border border-white-1 px-1 rounded-[5px]"
                  onClick={() => openResourceModal(index)}
                >
                  <p>Ver</p>
                </button>
                {isRecruiter && request.status === 'PENDING' && (
                  <button 
                    className="cursor-pointer bg-success text-white py-0.5 px-1 rounded-[5px] ml-2"
                    onClick={() => handleOpenAcceptModal(index)}
                  >
                    Aceptar solicitud
                  </button>
                )}
                {isRecruiter && request.status === 'IN_PROGRESS' && (
                  <button 
                    className="cursor-pointer bg-success text-white py-0.5 px-1 rounded-[5px] ml-2"
                    onClick={() => {}}
                  >
                    Agregar observacion
                  </button>
                )}
              </div>
              <div className="col-span-1 p-2  md:hidden text-center">
                <button
                  className="text-center"
                  onClick={() => handleToggleRow(index)}
                >
                  <FaChevronCircleDown
                    className={`w-[20px] h-[20px] transform origin-center transition-all duration-500 ease-in-out ${openRows.includes(index) ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Expanded Row (Mobile) */}
            {openRows.includes(index) && (
              <div className="md:hidden col-span-12">
                <div className="p-2 border border-black-05 dark:border-shadow-dark">
                  <div className="flex flex-col gap-2 mx-4 my-2">
                    <p>
                      Estado: <strong>{STATUS[request.status as keyof typeof STATUS]}</strong>
                    </p>
                    <p>Informes solicitados:</p>
                    <div className="flex flex-col gap-1 items-center">
                      {request.documents.map((doc: any, docIndex: number) => (
                        <span
                          key={docIndex}
                          className={`w-full ${doc.state
                            ? "bg-success text-white"
                            : "bg-transparent border border-black-05 dark:border-shadow-dark text-black dark:text-white"
                            } py-0.5 px-2 rounded-[5px] text-center`}
                        >
                          {doc.name}
                        </span>
                      ))}
                    </div>
                    <div className="w-full flex justify-end mt-2">
                      <button
                        onClick={() => openResourceModal(index)}
                        className="py-0.5 px-2 bg-black-15 dark:bg-white-20 rounded-[5px]"
                      >
                        Ver Informes
                      </button>
                      {isRecruiter && request.status === 'PENDING' && (
                        <button 
                          className="bg-success text-white py-0.5 px-2 rounded-[5px] ml-2"
                          onClick={() => handleOpenAcceptModal(index)}
                        >
                          Aceptar solicitud
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>


      {/* Modal de confirmación para aceptar solicitud */}
      <Modal 
        isOpen={confirmModalOpen} 
        onClose={isAcceptingRequest ? () => {} : handleCancelAccept} 
        position="center" 
        width="400px"
      >
        <div className="py-2 px-8 text-lg text-center">
          {isAcceptingRequest ? (
             <div className="flex flex-col items-center gap-4">
               <Loader isLoading={true}  />
               <p>Procesando solicitud...</p>
             </div>
           ) : (
            <>
              <p>¿Está seguro que desea aceptar esta solicitud?</p>
              <div className="flex justify-center gap-6 pt-4">
                <button
                  onClick={handleCancelAccept}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmAccept}
                  className="px-4 py-2 bg-main-1plus hover:bg-main text-white rounded-md"
                >
                  Confirmar
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen}
        title={isUser ? "Visualización y descarga de archivos" : "Carga de informes solicitados"}
        onClose={() => {
          setModalOpen(false);
          if (selectedRequest !== null && requests[selectedRequest]?.documents) {
            const newRequests = [...requests];
            newRequests[selectedRequest].documents = newRequests[selectedRequest].documents.filter((doc: any) => doc.resources && doc.resources.length > 0);
            handleRequests(newRequests);
          }
        }}
        position="center"
        width="800px"
        className="dark:text-white"
        footer={<>{          
          isUser ? null :
            selectedRequest !== null && requests[selectedRequest]?.documents.some((doc: any) => doc.status === 'Pendiente') ? (
              <button
                className="px-4 py-2 text-sm bg-main text-white rounded-md hover:bg-opacity-90"
                onClick={handleConfirmRequest}
              >
                Confirmar
              </button>
            ) : (
              <button
                className="px-4 py-2 text-sm bg-main text-white rounded-md hover:bg-opacity-90"
                onClick={() => setModalOpen(false)}
              >
                OK
              </button>
            )
        }</>
        }
      >
        <div className="flex flex-col">
          {selectedRequest !== null && requests[selectedRequest] && (
            <div className="text-sm">
              {requests[selectedRequest]?.documents.map((doc: any, i: any) => (
                <div key={i} className="gap-2 border-b border-gray-300 px-[32px] py-[15px] px-[32px]">
                  <div className="flex w-full justify-between">
                    <h2 className="text-[24px]">{doc.name}</h2>
                    <span className={doc.status == 'Pendiente' ? "text-yellow-500 text-[16px]" : "text-green-500 text-[16px]"}>{doc.status}</span>
                  </div>
                  {isAdmin ?
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between align-center py-[14px]">
                        <div className="text-[16px] text-black-2 dark:text-white">
                          Resultado
                        </div>
                        <input
                          type="text"
                          placeholder="Agregar una descripción"
                          value={doc.result || ''}
                          onChange={(e) => {
                            if (selectedRequest !== null) {
                              const newRequests = [...requests];
                              newRequests[selectedRequest].documents[i].result = e.target.value;
                              handleRequests(newRequests);
                            }
                          }}
                          disabled={doc.status !== 'Pendiente'}
                          className={`w-full max-w-[400px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                        rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                        placeholder-gray-400 dark:placeholder-gray-300
                        transition-all duration-200 ${doc.status !== 'Pendiente' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div className="flex w-full justify-between align-center py-[14px]">
                        <div className="text-[16px] text-black-2">
                          Documento
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0 && selectedRequest !== null) {
                                const file = e.target.files[0];
                                const newRequests = [...requests];
                                newRequests[selectedRequest].documents[i].filename = file;
                                handleRequests(newRequests);
                              }
                            }}
                            disabled={doc.status !== 'Pendiente'}
                            className={`w-full max-w-[200px] text-sm
                              file:mr-0 file:py-[6px] file:px-[68px]
                              file:rounded-[6px] file:border-[1px] file:border-black-2
                              file:text-[10px] file:font-medium
                              file:bg-white file:text-black-2
                              hover:file:bg-black-2 hover:file:text-white hover:file:border-transparent
                              file:w-full
                              [&:not(:placeholder-shown)::file-selector-button]:content-none
                              text-black-2 text-center
                              cursor-pointer
                              transition-all duration-200 ${doc.status !== 'Pendiente' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                        </div>
                      </div>

                      {doc.resources.map((resource: any, j: any) => (
                        <ResourceOutput key={j} {...resource} />
                      ))}
                    </div> :
                    <div>
                      <ResourceOutput key={Date.now() - 1} name="Comentarios" value={doc.result as string} />
                      <ResourceOutput key={Date.now() - 2} name="Documento" value={doc.filename as string} />
                    </div>
                  }
                </div>
              )
              )}
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

const processDocuments = async (documents: any[], uploadFile: (file: File, signedUrl: string) => Promise<any>) => {
  const documentsToUpdate = [];

  for (const doc of documents) {
    if (doc.filename instanceof File) {
      const fileKey = await handleFileUpload(doc.filename, uploadFile);
      if (fileKey) {
        documentsToUpdate.push({
          id: doc.id,
          result: doc.result || '',
          filename: fileKey
        });
      }
    }
  }

  return documentsToUpdate;
};

const handleFileUpload = async (file: File, uploadFile: (file: File, signedUrl: string) => Promise<any>) => {
  try {

    const response = await apiClient.post('upload/write-signed-url', {
      fileName: file.name,
      contentType: file.type
    });

    if (response.status !== 200) {
      throw new Error('No se pudo obtener la URL firmada para subir el archivo');
    }

    const { signedUrl } = response.data;

    await uploadFile(file, signedUrl);

    return file.name;
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    Notify.failure('Error al subir el archivo. Por favor, inténtelo de nuevo.');
    return null;
  }
};

enum HeaderType {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
}

interface HeaderProps {
  type: HeaderType;
  description: string;
}

const Header = ({ type, description }: HeaderProps) => {
  const styles = {
    'main': 'px-4 py-2 mb-4 font-light text-[14px] rounded-sidebar text-center',
    [HeaderType.LOADING]: 'bg-white-1 dark:bg-black-2 text-black dark:text-white',
    [HeaderType.ERROR]: 'bg-error hover:bg-error-1 text-white',
  }
  return (
    <div className={`${styles['main']} ${styles[type]}`}>
      {description}
    </div>
  )
}