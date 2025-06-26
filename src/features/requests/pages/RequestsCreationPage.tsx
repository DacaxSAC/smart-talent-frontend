// React imports
import { Fragment, useState } from "react";

// Third-party imports
import { Notify } from "notiflix";
import { useNavigate } from "react-router";

// Component imports
import { Button } from "../../../shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { Modal } from "@/shared/components/Modal";
import { LayoutPage } from "../../../shared/components/LayoutPage";
import { CreationTable } from "../components/private/creation/CreationTable";

// Type imports
import { RequestsType } from "../types/RequestsListType";
import { IDocumentType } from "../interfaces/IDocumentTypeResponse";

// Hook imports
import { useUser } from "@/features/auth/hooks/useUser";
import { useUpload } from "@/shared/hooks/useUpload";

// Utility imports
import { apiClient } from "@/lib/axios/client";
import { RequestsService } from "../services/requestsService";

export function RequestsCreationPage() {
  // Hooks
  const navigate = useNavigate();
  const { user } = useUser();

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

      const processedRequests = await Promise.all(
        requests.map(async (request) => {
          const processedDocuments = await processDocuments(request.documents);
          return {
            ...request,
            documents: processedDocuments,
          };
        })
      );

      const response = await RequestsService.postRequest({
        entityId: user?.entityId as number,
        people: processedRequests
      })

      handleRequestResponse(response)
    } catch (error) {
      Notify.failure("Ocurrió un error al guardar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = (response: any) => {
    if (response.status !== 200) {
      Notify.failure("Error al guardar las solicitudes");
    } else {
      setRequests([]);
      Notify.success("Solicitudes guardadas exitosamente");
      navigate("/requests");
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

// Helper function to process document resources
const processDocuments = async (documents: any[]) => {
  return Promise.all(
    documents.map(async (doc) => {
      const processedResources = await processResources(doc.resources);
      return {
        ...doc,
        resources: processedResources,
      };
    })
  );
};

// Helper function to process resources and handle file uploads
const processResources = async (resources: any[]) => {
  const { uploadFile } = useUpload();

  const processedResources = [];

  for (const resource of resources) {
    if (Array.isArray(resource.value)) {
      await Promise.all(
        resource.value.map(async (file: File) => {
          if (file instanceof File) {
            try {
              const signedUrl = await getSignedUrl(file);
              await uploadFile(file, signedUrl);
              processedResources.push({
                ...resource,
                value: file.name
              });
            } catch (error) {
              console.error("Error al procesar archivo:", error);
              throw error;
            }
          }
        })
      );
    } else {
      processedResources.push(resource);
    }
  }

  return processedResources;
};

// Helper function to get signed URL for file upload
const getSignedUrl = async (file: File) => {
  const response = await apiClient.post('/upload/write-signed-url', {
    fileName: file.name,
    contentType: file.type
  });
  return response.data.signedUrl;
};

// CONSTANTS

const emptyRequest = {
  fullname: "",
  dni: "",
  phone: "",
  isConfirmed: false,
  documents: [],
}