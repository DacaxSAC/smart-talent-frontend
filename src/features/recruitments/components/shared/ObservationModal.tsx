import { Modal } from "@/shared/components/Modal";

interface ObservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ObservationModal = ({ isOpen, onClose }: ObservationModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div
                className="fixed inset-0 z-50 flex items-center justify-center "
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
            >
                <div className="bg-white rounded-xl shadow-lg w-full max-w-[24rem] h-[30rem] relative flex flex-col">
                    {/* Header con título y botón cerrar */}
                    <div className="flex items-center justify-between bg-gray-100 rounded-t-xl px-3 py-2 border-b border-gray-400">
                        <h2 className="text-xs font-semibold text-gray-900">
                            Observaciones planteadas
                        </h2>
                        <button
                            className="text-xl text-gray-700 hover:text-black"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                    </div>
                    {/* Contenido principal */}
                    <div className="flex-1 px-3 pt-2 pb-2 flex flex-col">
                        {/* Subtítulo */}
                        <p className="text-[10px] font-normal text-gray-700 mb-2 leading-tight">
                            Las observaciones planteadas fueron descritas por:
                            <br />
                            <span className="font-semibold">Micaela Gonzales Rivera</span>
                        </p>
                        {/* Observaciones */}
                        <div className="mb-3 flex-1">
                            <textarea
                                className="w-full h-full text-gray-800 text-[11px] font-normal border border-gray-300 rounded-md p-3 leading-none bg-white  focus:outline-none" value={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa unde iste ratione dicta quisquam explicabo ullam cumque laboriosam rem corrupti voluptate, consectetur sunt at eos voluptatem asperiores quo minima quis!"}>
                            </textarea>
                    </div>
                    {/* Avisos */}
                    <div className="mb-3">
                        <p className="text-[9px] text-gray-400 mb-1 leading-tight">
                            Si acepta levantar las observaciones, será redirigido a la vista editar el levantamiento de perfil.
                        </p>
                        <p className="text-[9px] text-gray-400 leading-tight">
                            Si rechaza levantar observaciones, se terminará el progreso.
                        </p>
                    </div>
                    </div>
                    <div className="flex items-center justify-center bg-gray-100 rounded-b-xl px-3 py-2 border-t border-gray-400 gap-x-6">
                        {/* Botones centrados */}
                        <button
                            className="min-w-[100px] max-w-[100px] border border-gray-300 rounded-lg py-1 text-[15px] font-medium text-gray-800 bg-white hover:bg-gray-100 transition"
                            onClick={onClose}
                        >
                            Rechazar
                        </button>
                        <button
                            className="min-w-[100px] max-w-[100px] rounded-lg py-1 text-[15px] font-medium text-white bg-orange-500 hover:bg-orange-600 transition shadow"
                            onClick={() => alert('Aceptar')}
                        >
                            Aceptar
                        </button>
                </div>
                </div>
                
            </div>
        </Modal >
    );
};