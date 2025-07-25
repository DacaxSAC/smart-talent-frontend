import { Modal } from "@/shared/components/Modal"
import { ReusableButton } from "./ReusableButton";

/**
 * Modal de confirmación que muestra una pregunta de sí o no al usuario
 * @param isOpen - Estado de apertura del modal
 * @param onClose - Función para cerrar el modal
 * @param handleDecision - Función que se ejecuta cuando el usuario confirma
 */
export const YesOrNotModal = ({
  isOpen,
  onClose,
  handleDecision,
  isDelete
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  handleDecision: () => void;
  isDelete: boolean;
}>) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="400px"
      showOverlay={true}
      closeOnClickOutside={true}
      title={isDelete ? '¿Estás seguro de deshabilitar este cliente y sus credenciales?' : '¿Estás seguro de habilitar este cliente y sus credenciales?'}
    >    
        <p className="px-3 pb-4 text-medium text-[14px]">
          {isDelete ? 'Al deshabilitar este cliente, sus credenciales y todos los datos personales asociados a este cliente se eliminarán de forma permanente.' : 'Al habilitar este cliente, podrá acceder a la plataforma y realizar solicitudes.'}
        </p>

        <div className="px-3 flex justify-center gap-2">
          <ReusableButton
            text="Regresar"
            handleClick={onClose}
            variant="tertiary"
          />
          <ReusableButton
            text="Confirmar"
            handleClick={() => {
              handleDecision();
            }}
            />
        </div>
    </Modal>
  )
}