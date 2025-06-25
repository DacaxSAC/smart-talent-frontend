import { Fragment, useState } from "react";
import { CreationTable } from "../components/private/creation/CreationTable";
import { RequestsType } from "../types/RequestsListType";
import { IDocumentType } from "../interfaces/IDocumentTypeResponse";
import { useUpload } from "@/shared/hooks/useUpload";
import { apiClient } from "@/lib/axios/client";
import { useNavigate } from "react-router";
import { Loader } from "@/shared/components/Loader";
import { useUser } from "@/features/auth/hooks/useUser";
import { Modal } from "@/shared/components/Modal";
import { Notify } from "notiflix";
import { LayoutPage } from "./LayoutPage";
import { Button } from "./Button";

export function RequestsCreationPage() {
  // Hooks
  const navigate = useNavigate();
  const { user } = useUser();
  const { uploadFile } = useUpload();

  // States
  const [requests, setRequests] = useState<RequestsType[]>([emptyRequest]);
  const [openOptionsIndex, setOpenOptionsIndex] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleOpenOptions = (rowIndex: number) => {
    setOpenOptionsIndex(openOptionsIndex === rowIndex ? null : rowIndex);
  };

  const handleSetOpenOptions = () => {
    setOpenOptionsIndex(null);
  };

  const handleRequests = (newRequests: RequestsType[]) => {
    setRequests(newRequests);
  };

  const handleBackToList = () => {
    requests.length > 0 ? setShowConfirmModal(true) : navigate("/requests")
  };

  const handleDocCheckbox = (rowIndex: number, docType: IDocumentType, checked: boolean) => {
    const newRequests = [...requests];
    const docs = requests[rowIndex].documents;

    if (checked) {
      if (!docs.some((doc) => doc.name === docType.name)) {
        docs.push({
          documentTypeId: docType.id,
          name: docType.name,
          state: true,
          resourceTypes: docType.resourceTypes,
          resources: [],
        });
      }
    } else {
      newRequests[rowIndex].documents = docs.filter(
        (doc) => doc.name !== docType.name
      );
    }
    setRequests(newRequests);
  };

  const handleSaveRequests = async () => {
    try {
      setLoading(true);

      if (requests.length === 0) {
        Notify.warning("Debe agregar al menos una solicitud");
        return;
      }

      const hasIncompleteRequests = requests.some(
        (request) =>
          !request.dni ||
          !request.fullname ||
          !request.phone ||
          request.documents.length === 0
      );

      if (hasIncompleteRequests) {
        Notify.warning(
          "Todas las solicitudes deben tener datos completos y al menos un documento seleccionado"
        );
        return;
      }

      // Procesar todos los archivos de los informes
      const processedRequests = await Promise.all(
        requests.map(async (request) => {
          const processedDocuments = await Promise.all(
            request.documents.map(async (doc) => {
              const processedResources = [];

              for (const resource of doc.resources) {
                if (Array.isArray(resource.value)) {
                  // Procesar cada archivo en el array
                  for (const file of resource.value) {
                    if (file instanceof File) {
                      try {
                        // Obtener URL firmada del backend
                        const signedUrlResponse = await apiClient.post('/upload/write-signed-url', {
                          fileName: file.name,
                          contentType: file.type
                        });

                        const signedUrl = signedUrlResponse.data.signedUrl;

                        // Subir el archivo usando el hook
                        await uploadFile(file, signedUrl);

                        // Agregar nuevo recurso con la URL
                        processedResources.push({
                          ...resource,
                          value: file.name
                        });
                      } catch (error) {
                        console.error("Error al procesar archivo:", error);
                        throw error;
                      }
                    }
                  }
                } else {
                  processedResources.push(resource);
                }
              }

              return {
                ...doc,
                resources: processedResources,
              };
            })
          );

          return {
            ...request,
            documents: processedDocuments,
          };
        })
      );

      // Enviar las solicitudes procesadas al backend
      const response = await apiClient.post('/requests', {
        entityId: user?.entityId,
        people: processedRequests
      });


      if (response.status === 200) {
        throw new Error("Error al guardar las solicitudes");
      }

      setRequests([]);
      Notify.success("Solicitudes guardadas exitosamente");
      navigate("/requests");
    } catch (error) {
      console.error("Error:", error);
      Notify.failure("Ocurrió un error al guardar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPage
      title="CREACIÓN DE SOLICITUDES"
      description="Registrar personas por DNI y nombre para solicitar informes."
      buttonsHeader={
        <Fragment>
          <Button type="secondary" handleClick={handleBackToList} description="Regresar a solicitudes" />
        </Fragment>
      }
      footer={
        <div className="flex justify-end items-center">
          <Button type="primary" handleClick={handleSaveRequests} description="Crear solicitudes" />
        </div>
      }
    >
      <Fragment>
        <CreationTable
          requests={requests}
          openIndex={openOptionsIndex}
          handleRequests={handleRequests}
          toggleOpenOptions={toggleOpenOptions}
          handleOpenOptionsIndex={handleSetOpenOptions}
          handleDocCheckbox={handleDocCheckbox}
        />
        
        <Loader isLoading={loading} />

        <ConfirmBackModal
          isOpen={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleBackToList}
        />
      </Fragment>
    </LayoutPage>
  )
}

interface propsConfirmBackModal {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmBackModal = ({ isOpen, onCancel, onConfirm }: propsConfirmBackModal) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} position="center" width="400px">
      <div className="py-2 px-8 text-lg text-center">
        <p>Hay registros pendientes ¿Está seguro que desea regresar?</p>
        <div className="flex justify-center gap-6 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-main-1plus hover:bg-main text-white rounded-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// CONSTANTS

const emptyRequest = {
  fullname: "",
  dni: "",
  phone: "",
  isConfirmed: false,
  documents: [],
}