import { Modal } from "@/shared/components/Modal";

interface ObservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ObservationModal = ({ isOpen, onClose }: ObservationModalProps) => {


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Observación">
            <p>Observaciones</p>
        </Modal>
    )
}


