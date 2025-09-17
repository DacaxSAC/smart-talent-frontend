import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../shared/store/modalStore';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { X } from 'lucide-react';

interface RecruitmentTypeModalProps {
  onSelectType?: (type: string) => void;
}

export const RecruitmentTypeModal: React.FC<RecruitmentTypeModalProps> = ({ onSelectType }) => {
  const navigate = useNavigate();
  const { isActiveRecruitmentTypeModal, closeRecruitmentTypeModal } = useModalStore();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelectType?.(selectedType);
      closeRecruitmentTypeModal();
      navigate('/profile-up');
      setSelectedType(null);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    closeRecruitmentTypeModal();
  };

  const recruitmentTypes = [
    {
      id: 'regular',
      title: 'Reclutamiento Regular',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
      id: 'executive',
      title: 'Hunting Ejecutivo',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.'
    },
    {
      id: 'massive',
      title: 'Reclutamiento Masivo',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.'
    }
  ];

  return (
    <Modal 
         isOpen={isActiveRecruitmentTypeModal} 
         onClose={handleClose} 
         position="center"
         title="Tipo de reclutamiento"
       >
      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-6 text-center">
          Selecciona el tipo de reclutamiento a solicitar:
        </p>

        <div className="space-y-4">
          {recruitmentTypes.map((type) => (
            <div
               key={type.id}
               className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                 selectedType === type.id 
                   ? 'border-orange-500 bg-orange-50' 
                   : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
               }`}
               onClick={() => handleSelectType(type.id)}
             >
              <h3 className="font-medium text-gray-900 mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6">
          <Button
             type="primary"
             handleClick={handleConfirm}
             disabled={!selectedType}
           >
             Confirmar
           </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RecruitmentTypeModal;