import { useState } from "react";
import { UsersService } from "@/features/users/service/usersService";
import { FormInput } from "../../shared/FormInput";
import { ReusableButton } from "../../shared/ReusableButton";
import { ConfirmationModal } from "../../shared/ConfirmationModal";
import { Loader } from "@/shared/components/Loader";
import { useNavigate } from "react-router-dom";
import { UsersListResponse } from "@/features/users/types/UserListResponse";

interface UserProps {
  documentNumber: string;
  businessName?: string;
  email: string;
  address: string;
  phone: string;
}

interface FormErrors {
  documentNumber: { error: boolean; message: string };
  businessName: { error: boolean; message: string };
  email: { error: boolean; message: string };
  address: { error: boolean; message: string };
  phone: { error: boolean; message: string };
}

export const FormJuridica = ({ userEdit, isUpdate, isReadOnly, onCancelEdit }: Readonly<{ 
  userEdit?: UsersListResponse, 
  isUpdate?: boolean,
  isReadOnly?: boolean,
  onCancelEdit?: () => void 
}>) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [user, setUser] = useState<UserProps>({
    documentNumber: userEdit?.documentNumber || "",
    businessName: userEdit?.businessName || "",
    email: userEdit?.user.email || "",
    address: userEdit?.address || "",
    phone: userEdit?.phone || "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    documentNumber: { error: false, message: '' },
    businessName: { error: false, message: '' },
    email: { error: false, message: '' },
    address: { error: false, message: '' },
    phone: { error: false, message: '' },
  });

  const validateRUC = (value: string) => {
    const isValid = /^\d{11}$/.test(value);
    setErrors(prev => ({
      ...prev,
      documentNumber: {
        error: !isValid,
        message: isValid ? '' : 'El RUC debe tener 11 dígitos numéricos'
      }
    }));
    return isValid;
  };

  const validateBusinessName = (value: string) => {
    const isValid = value.trim().length > 0;
    setErrors(prev => ({
      ...prev,
      businessName: {
        error: !isValid,
        message: isValid ? '' : 'La razón social no puede estar vacía'
      }
    }));
    return isValid;
  };

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setErrors(prev => ({
      ...prev,
      email: {
        error: !isValid && value.length > 0,
        message: isValid ? '' : 'Formato de correo electrónico inválido'
      }
    }));
    return isValid;
  };

  const validateAddress = (value: string) => {
    const isValid = value.trim().length > 0;
    setErrors(prev => ({
      ...prev,
      address: {
        error: !isValid && value.length > 0,
        message: isValid ? '' : 'La dirección no puede estar vacía'
      }
    }));
    return isValid;
  };

  const validatePhone = (value: string) => {
    const isValid = /^\d{9}$/.test(value);
    setErrors(prev => ({
      ...prev,
      phone: {
        error: !isValid && value.length > 0,
        message: isValid ? '' : 'El teléfono debe tener 9 dígitos numéricos'
      }
    }));
    return isValid;
  };

  const validateForm = () => {
    const isDocumentValid = validateRUC(user.documentNumber);
    const isBusinessNameValid = validateBusinessName(user.businessName || '');
    const isEmailValid = validateEmail(user.email);
    const isAddressValid = validateAddress(user.address);
    const isPhoneValid = validatePhone(user.phone);

    return isDocumentValid && isBusinessNameValid && isEmailValid && isAddressValid && isPhoneValid;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    const payload = { ...user, type: "JURIDICA" };
    setOpenModal(false);
    setLoading(true);
    const response = await UsersService.createUser(payload);
    setLoading(false);
    navigate('/users');
    console.log(response);
  };

  const handleUpdateUser = async () => {
    if (!validateForm()) return;
    const payload = { ...user, type: userEdit?.type };
    setOpenModal(false);
    setLoading(true);
    const response = await UsersService.updateUser(userEdit?.id || 0, payload);
    setLoading(false);
    navigate('/users');
    console.log(response);
  };

  const handleClick = () => {
    if (validateForm()) setOpenModal(true);
  };

  const handleConfirm = () => {
    if (isUpdate) {
      handleUpdateUser();
    } else {
      handleCreateUser();
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
       <div className="p-6 flex-1 flex flex-col gap-4 text-black dark:text-white border border-[#C3C3C3] rounded-[12px]">
        <p className="text-[14px] text-black dark:text-white mb-4">
          Ingresa los datos en los campos correspondientes:
        </p>
      
        <FormInput
          fieldName="RUC"
          value={user.documentNumber}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, documentNumber: value });
            validateRUC(value);
          }}
          error={errors.documentNumber.error}
          errorMessage={errors.documentNumber.message}
          disabled={isReadOnly}
        />
        <FormInput
          fieldName="Razón social"
          value={user.businessName || ''}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, businessName: value });
            validateBusinessName(value);
          }}
          error={errors.businessName.error}
          errorMessage={errors.businessName.message}
          disabled={isReadOnly}
        />
        <FormInput
          fieldName="Dirección"
          value={user.address}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, address: value });
            validateAddress(value);
          }}
          error={errors.address.error}
          errorMessage={errors.address.message}
          disabled={isReadOnly}
        />
        <FormInput
          fieldName="Teléfono"
          value={user.phone}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, phone: value });
            validatePhone(value);
          }}
          error={errors.phone.error}
          errorMessage={errors.phone.message}
          disabled={isReadOnly}
        />
        <FormInput
          fieldName="Correo"
          value={user.email}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, email: value });
            validateEmail(value);
          }}
          error={errors.email.error}
          errorMessage={errors.email.message}
          disabled={isReadOnly}
        />
        
      </div>
      {!isReadOnly && (
        <div className="flex gap-4 justify-end">
          {isUpdate && onCancelEdit && (
            <ReusableButton
              handleClick={onCancelEdit}
              text="Cancelar edición"
              variant="tertiary"
              justify="start"
            />
          )}
          <ReusableButton 
            handleClick={handleClick}
            text="Confirmar registro"
          />
        </div>
      )}
      <ConfirmationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirm}
        title="Detalles del nuevo cliente"
        fields={[
          { label: "RUC", value: user.documentNumber },
          { label: "Razón social", value: user.businessName },
          { label: "Dirección", value: user.address },
          { label: "Teléfono", value: user.phone },
          { label: "Correo", value: user.email }
        ]}
      />
    </>
  );
};
