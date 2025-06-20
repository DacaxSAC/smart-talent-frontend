import { useState, useRef, useEffect } from "react";
import { DocsChecklist } from "./DocsChecklist";
import { RequestsType } from "@/features/requests/types/RequestsListType";
import { AddButton } from "./AddButton";
import { Modal } from "@/shared/components/Modal";
import { IDocumentType } from "@/features/requests/interfaces/IDocumentTypeResponse";
import { ResourceInput } from "../../public/ResourceInput";

const headers = [
  "DNI",
  "Nombres completos",
  "Teléfono",
  "Informes",
  "Acciones",
];

interface InputErrors {
  dni: Record<number, boolean>;
  phone: Record<number, boolean>;
  fullname: Record<number, boolean>;
}

export const CreationTable = ({
  requests,
  openIndex,
  handleRequests,
  toggleOpenOptions,
  handleOpenOptionsIndex,
  handleDocCheckbox,
}: Readonly<{
  requests: RequestsType[];
  openIndex: number | null;
  handleRequests: (newRequests: RequestsType[]) => void;
  toggleOpenOptions: (rowIndex: number) => void;
  handleOpenOptionsIndex: () => void;
  handleDocCheckbox: (      
    rowIndex: number,     
    doc: IDocumentType,
    checked: boolean
  ) => void;
}>) => {
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    dni: {},
    phone: {},
    fullname: {},
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addRow = () => {
    handleRequests([
      ...requests,
      {
        dni: "",
        fullname: "",
        phone: "",
        isConfirmed: false,
        documents: [],
      },
    ]);
  };
  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    inputRefs.current[index] = el;
  };

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
        alert("Debe agregar al menos un tipo de documento")
        return
      }
      setSelectedRequest(index);
      setModalOpen(true);
    }
  };

  const handleConfirmRequest = () => {
    const newRequests = [...requests];
    if (selectedRequest !== null) {

      const allResourcesHaveValues = requests[selectedRequest].documents.every(doc => {
        const totalRequiredResources = doc.resourceTypes.length;

        const resourcesWithValues = doc.resources.filter(resource =>
          resource.value && resource.value !== ''
        ).length;
        return resourcesWithValues >= totalRequiredResources;
      });

      if (!allResourcesHaveValues) {
        alert("Debe completar todos los recursos requeridos");
        return;
      }

      newRequests[selectedRequest].isConfirmed = true;
      handleRequests(newRequests);
      setModalOpen(false);
    }
    setSelectedRequest(null);
  };

  const handleDelete = (index: number) => {
    if (confirm('¿Está seguro que desea eliminar este registro?')) {
      const newRequests = [...requests];
      newRequests.splice(index, 1);
      handleRequests(newRequests);
    }
  };


  return (
    <div className="p-3 w-full h-[500px] dark:border dark:border-black-1 shadow-doc-options text-[14px] overflow-x-auto relative text-black dark:text-white rounded-sidebar font-karla font-light">
      <div className="px-2 grid grid-cols-40 items-center min-w-[800px] sticky top-0 z-10 bg-main-3plus dark:bg-main rounded-sidebar mb-4">
        <div className="col-span-5 p-2">{headers[0]}</div>
        <div className="col-span-8 p-2">{headers[1]}</div>
        <div className="col-span-5 p-2">{headers[2]}</div>
        <div className="col-span-16 p-2">{headers[3]}</div>
        <div className="col-span-6 p-2">{headers[4]}</div>
      </div>

      <div className="text-black dark:text-white flex flex-col gap-2">
        {requests.map((request, index) => (
          <div key={index}>
            <div className=" grid grid-cols-40 h-full border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 ">
              <div className="col-span-5 p-2 ">
                <div className="w-full overflow-hidden">
                  <input
                    ref={(el) => setInputRef(el, index)}
                    className={`w-full  rounded-[5px] py-0.5 px-1 focus:outline-none number-input-hide-arrows ${inputErrors.dni[index]
                        ? "border border-error"
                        : "border border-white-1 dark:border-black-2"
                      }`}
                    type="text"
                    value={request.dni}
                    onChange={(e) => {
                      const value = e.target.value;
                      const hasInvalidChars = /[^0-9]/.test(value);
                      const length = value.length;

                      setInputErrors((prev) => ({
                        ...prev,
                        dni: {
                          ...prev.dni,
                          [index]:
                            hasInvalidChars || length >= 9 || length <= 7,
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

              <div className="col-span-8 p-2 ">
                <div className="w-full overflow-hidden">
                  <textarea
                    className={`w-full resize-none rounded-[5px] py-0.5 px-1 focus:outline-none ${inputErrors.fullname[index]
                        ? "border border-error"
                        : "border border-white-1 dark:border-black-2"
                      }`}
                    value={request.fullname}
                    onChange={(e) => {
                      const value = e.target.value;
                      const hasNumbers = /[0-9]/.test(value);

                      setInputErrors((prev) => ({
                        ...prev,
                        fullname: { ...prev.fullname, [index]: hasNumbers },
                      }));

                      const newRequests = [...requests];
                      newRequests[index].fullname = value;
                      handleRequests(newRequests);
                    }}
                    rows={1}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height =
                        e.currentTarget.scrollHeight + "px";
                    }}
                  />
                  {inputErrors.fullname[index] && (
                    <p className="text-error text-[8px] font-bold mt-1">
                      Formato incorrecto
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-5 p-2 ">
                <div className="w-full h-full overflow-hidden">
                  <input
                    className={`w-full rounded-[5px] py-0.5 px-1 focus:outline-none number-input-hide-arrows ${inputErrors.phone[index]
                        ? "border border-error"
                        : "border border-white-1 dark:border-black-2"
                      }`}
                    type="text"
                    value={request.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      const hasInvalidChars = /[^0-9]/.test(value);
                      const length = value.length;

                      setInputErrors((prev) => ({
                        ...prev,
                        phone: {
                          ...prev.phone,
                          [index]:
                            hasInvalidChars || length >= 10 || length <= 8,
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

              {/* Informes - 2 columnas */}
              <div className="col-span-16 p-2  relative">
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
                  openIndex={openIndex}
                  index={index}
                  request={request}
                  handleOpen={handleOpenOptionsIndex}
                  handleDocCheckbox={handleDocCheckbox}
                />
              </div>

              {/* Modificar la sección de acciones */}
              <div className="col-span-6 px-1 py-2 flex justify-around items-start gap-1">
                <button
                  className={`${requests[index].isConfirmed
                      ? "bg-success rounded-[5px] py-1 px-1.5 text-white cursor-not-allowed"
                      : "border border-white-1 rounded-[5px] py-1 px-1.5 hover:text-main transition-colors"
                    } text-[12px]`}
                  onClick={() => handleConfirm(index)}
                >
                  {requests[index].isConfirmed ? 'Confirmado' : 'Confirmar'}
                </button>
                <button
                  className="text-[12px] py-1 px-1.5 border border-white-1 rounded-[5px] hover:border-error hover:text-error transition-colors"
                  onClick={() => handleDelete(index)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Botón para agregar fila */}
      <div ref={listEndRef} className="flex justify-start p-4">
        <AddButton type="request" onClick={addRow} />
      </div>

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
            })); // Limpiar los recursos de la solicitud seleccionada
          }
          handleRequests(newRequests);
        }}
        position="center"
        width="800px"
        className=""
        footer={
          <>
            <button
              className="bg-main text-black rounded-[12px] text-[16px] color-black font-[300] px-[54px] py-[15px] hover:bg-main-2 transition-colors"
              onClick={handleConfirmRequest}
            >
              Subir recursos necesarios
            </button>
          </>
        }
      >
        <div className="flex flex-col">
          {selectedRequest !== null && (
            <div className="text-sm">
              {requests[selectedRequest]?.documents.map((doc, i) => (
                <div key={i} className="gap-2 border-b border-gray-300 px-[32px] py-[15px] px-[32px]">
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
                          // Update existing resource
                          currentDoc.resources[existingResourceIndex].value = value;
                        } else {
                          // Add new resource
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
          )}
        </div>
      </Modal>
    </div>
  );
};
