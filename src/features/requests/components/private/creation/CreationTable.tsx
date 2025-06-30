import { Fragment, useEffect, useRef, useState } from "react";
import { AddButton } from "./AddButton";
import { DocsChecklist } from "./DocsChecklist";
import { IDocumentType } from "@/features/requests/interfaces/IDocumentTypeResponse";
import { Modal } from "@/shared/components/Modal";
import { Notify } from 'notiflix';
import { RequestsType } from "@/features/requests/types/RequestsListType";
import { ResourceInput } from "../../public/ResourceInput";

interface InputErrors {
  dni: Record<number, boolean>;
  phone: Record<number, boolean>;
  fullname: Record<number, boolean>;
}

interface CreationTableProps {
  requests: RequestsType[];
  openIndex: number | null;
  handleRequests: (newRequests: RequestsType[]) => void;
  toggleOpenOptions: (rowIndex: number) => void;
  handleOpenOptionsIndex: () => void;
  handleDocCheckbox: (rowIndex: number, doc: IDocumentType, checked: boolean) => void;
}

// Main Component
export const CreationTable = ({
  requests, openIndex, handleRequests, toggleOpenOptions, handleOpenOptionsIndex, handleDocCheckbox,
}: CreationTableProps) => {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [inputErrors, setInputErrors] = useState<InputErrors>(EMPTY_ERROR);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requests.length > 0) {
      const lastInput = inputRefs.current[requests.length - 1];
      lastInput?.focus();
    }
  }, [requests.length]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [requests]);

  const handleConfirm = (index: number) => {
    if (!requests[index].isConfirmed) {
      if (requests[index].documents.length === 0) {
        Notify.warning('Debe agregar al menos un tipo de documento');
        return;
      }
      setSelectedRequest(index);
      setModalOpen(true);
    }
  };

  const handleConfirmRequest = () => {
    if (selectedRequest === null) return;

    const allResourcesHaveValues = requests[selectedRequest].documents.every(doc => {
      const totalRequiredResources = doc.resourceTypes.length;
      const resourcesWithValues = doc.resources.filter(resource =>
        resource.value && resource.value !== ''
      ).length;
      return resourcesWithValues >= totalRequiredResources;
    });

    if (!allResourcesHaveValues) {
      Notify.warning("Debe completar todos los recursos requeridos");
      return;
    }

    const newRequests = [...requests];
    newRequests[selectedRequest].isConfirmed = true;
    handleRequests(newRequests);
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const addRow = () => handleRequests([...requests, EMPTY_REQUEST]);

  return (
    <Fragment>
      <TableHeader />

      <div className="text-black dark:text-white flex flex-col gap-2">
        {requests.map((request, index) => (
          <div key={index}>
            <div className="grid grid-cols-40 h-full border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05">
              {/* DNI Field */}
              <div className="col-span-5 p-2">
                <div className="w-full overflow-hidden">
                  <InputField
                    value={request.dni}
                    error={inputErrors.dni[index]}
                    onChange={(value) => {
                      const hasInvalidChars = /[^0-9]/.test(value);
                      const length = value.length;

                      setInputErrors((prev) => ({
                        ...prev,
                        dni: {
                          ...prev.dni,
                          [index]: hasInvalidChars || length >= 9 || length <= 7,
                        },
                      }));

                      const newRequests = [...requests];
                      newRequests[index].dni = value;
                      handleRequests(newRequests);
                    }}
                  />
                  {inputErrors.dni[index] && (
                    <p className="text-error text-[8px] font-bold mt-1">
                      Formato incorrecto
                    </p>
                  )}
                </div>
              </div>

              {/* Fullname Field */}
              <div className="col-span-8 p-2">
                <div className="w-full overflow-hidden">
                  <InputField
                    type="textarea"
                    value={request.fullname}
                    error={inputErrors.fullname[index]}
                    onChange={(value) => {
                      const hasNumbers = /[0-9]/.test(value);

                      setInputErrors((prev) => ({
                        ...prev,
                        fullname: { ...prev.fullname, [index]: hasNumbers },
                      }));

                      const newRequests = [...requests];
                      newRequests[index].fullname = value;
                      handleRequests(newRequests);
                    }}
                  />
                  {inputErrors.fullname[index] && (
                    <p className="text-error text-[8px] font-bold mt-1">
                      Formato incorrecto
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="col-span-5 p-2">
                <div className="w-full h-full overflow-hidden">
                  <InputField
                    value={request.phone}
                    error={inputErrors.phone[index]}
                    onChange={(value) => {
                      const hasInvalidChars = /[^0-9]/.test(value);
                      const length = value.length;

                      setInputErrors((prev) => ({
                        ...prev,
                        phone: {
                          ...prev.phone,
                          [index]: hasInvalidChars || length >= 10 || length <= 8,
                        },
                      }));
                      const newRequests = [...requests];
                      newRequests[index].phone = value;
                      handleRequests(newRequests);
                    }}
                  />
                  {inputErrors.phone[index] && (
                    <p className="text-error text-[8px] font-bold mt-1">
                      Formato incorrecto
                    </p>
                  )}
                </div>
              </div>

              {/* Documents Section */}
              <div className="col-span-16 p-2 relative">
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-wrap gap-1 flex-1">
                    {request.documents.map((doc, docIndex) => (
                      <span
                        key={docIndex}
                        className="border border-white-1 dark:border-black-2 py-0.5 px-2 rounded-[5px]"
                      >
                        {doc.name}
                      </span>
                    ))}
                  </div>
                  <AddButton
                    type="document"
                    onClick={() => toggleOpenOptions(index)}
                  />
                </div>
                <DocsChecklist
                  index={index}
                  open={openIndex === index}
                  request={request}
                  handleOpen={handleOpenOptionsIndex}
                  handleDocCheckbox={handleDocCheckbox}
                />
              </div>

              {/* Actions Section */}
              <div className="col-span-6 px-1 py-2 flex justify-around items-start gap-1">
                <button
                  className={`${
                    requests[index].isConfirmed
                      ? "bg-success rounded-[5px] py-1 px-1.5 text-white cursor-not-allowed"
                      : "border border-white-1 rounded-[5px] py-1 px-1.5 hover:text-main transition-colors"
                  } text-[12px]`}
                  onClick={() => handleConfirm(index)}
                >
                  {requests[index].isConfirmed ? 'Confirmado' : 'Confirmar'}
                </button>
                <button
                  className="text-[12px] py-1 px-1.5 border border-white-1 rounded-[5px] hover:border-error hover:text-error transition-colors"
                  onClick={() => setDeleteConfirmModal(true)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
              isOpen={deleteConfirmModal}
              onClose={() => setDeleteConfirmModal(false)}
              position="center"
              width="400px"
            >
              <div className="py-2 px-8 text-lg text-center">
                <p>¿Estás seguro que deseas eliminar este registro?</p>
                <div className="flex justify-center gap-6 pt-4">
                  <button
                    onClick={() => setDeleteConfirmModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setDeleteConfirmModal(false);
                      const newRequests = [...requests];
                      newRequests.splice(index, 1);
                      handleRequests(newRequests);
                    }}
                    className="px-4 py-2 bg-main-1plus hover:bg-main text-white rounded-md"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        ))}
      </div>

      {/* Add Row Button */}
      <div ref={listEndRef} className="flex justify-start p-4">
        <AddButton type="request" onClick={addRow} />
      </div>

      {/* Resources Modal */}
      <Modal
        isOpen={modalOpen}
        title="Recursos Necesarios"
        onClose={() => {
          setModalOpen(false);
          const newRequests = [...requests];
          if (selectedRequest !== null) {
            newRequests[selectedRequest].documents = newRequests[
              selectedRequest
            ].documents.map((doc) => ({
              ...doc,
              resources: [],
            }));
          }
          handleRequests(newRequests);
        }}
        position="center"
        width="800px"
        className=""
        footer={
          <button
            className="bg-main text-black rounded-[12px] text-[16px] color-black font-[300] px-[54px] py-[15px] hover:bg-main-2 transition-colors"
            onClick={handleConfirmRequest}
          >
            Subir recursos necesarios
          </button>
        }
      >
        {selectedRequest !== null && (
          <ResourceModalContent
            selectedRequest={selectedRequest}
            requests={requests}
            handleRequests={handleRequests}
          />
        )}
      </Modal>
    </Fragment>
  );
};

// Input Validation Component
interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  type?: string;
  className?: string;
  rows?: number;
}

const InputField = ({ value, onChange, error, type = 'text', className = '', rows = 1 }: InputFieldProps) => {
  const baseClassName = `w-full rounded-[5px] py-0.5 px-1 focus:outline-none ${
    error ? "border border-error" : "border border-white-1 dark:border-black-2"
  }`;

  if (type === 'textarea') {
    return (
      <textarea
        className={`${baseClassName} resize-none ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        onInput={(e) => {
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
        }}
      />
    );
  }

  return (
    <input
      className={`${baseClassName} number-input-hide-arrows ${className}`}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

// Table Header Component
const TableHeader = () => (
  <div className="px-2 grid grid-cols-40 items-center min-w-[800px] sticky top-0 z-10 bg-main-3plus dark:bg-main rounded-sidebar mb-4">
    {HEADERS.map((header, index) => (
      <div
        key={index}
        className={`p-2 ${
          index === 0 ? 'col-span-5' :
          index === 1 ? 'col-span-8' :
          index === 2 ? 'col-span-5' :
          index === 3 ? 'col-span-16' :
          'col-span-6'
        }`}
      >
        {header}
      </div>
    ))}
  </div>
);

// Resource Modal Content Component
interface ResourceModalProps {
  selectedRequest: number;
  requests: RequestsType[];
  handleRequests: (newRequests: RequestsType[]) => void;
}

const ResourceModalContent = ({ selectedRequest, requests, handleRequests }: ResourceModalProps) => (
  <div className="flex flex-col">
    <div className="text-sm">
      {requests[selectedRequest]?.documents.map((doc, i) => (
        <div key={i} className="gap-2 border-b border-gray-300 px-[32px] py-[15px]">
          <h2 className="text-[24px]">{doc.name}</h2>
          {doc.resourceTypes.map((resourceType, j) => (
            <ResourceInput
              key={j}
              {...resourceType}
              onChange={(value) => {
                const newRequests = [...requests];
                const currentDoc = newRequests[selectedRequest].documents[i];
                const existingResourceIndex = currentDoc.resources.findIndex(
                  r => r.resourceTypeId === resourceType.id
                );

                if (existingResourceIndex >= 0) {
                  currentDoc.resources[existingResourceIndex].value = value;
                } else {
                  currentDoc.resources.push({
                    resourceTypeId: resourceType.id,
                    name: resourceType.name,
                    value: value,
                  });
                }
                handleRequests(newRequests);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Constants
const HEADERS = ["DNI", "Nombres completos", "Teléfono", "Informes", "Acciones"];

const EMPTY_ERROR = {
  dni: {},
  phone: {},
  fullname: {},
};

const EMPTY_REQUEST = {
  dni: "",
  fullname: "",
  phone: "",
  isConfirmed: false,
  documents: [],
};