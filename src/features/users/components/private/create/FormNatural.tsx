import { useState } from "react";
import { FormInput } from "../../shared/FormInput";
import { ReusableButton } from "../../shared/ReusableButton";
import { ConfirmationModal } from "../../shared/ConfirmationModal";
import { UsersService } from "@/features/users/service/usersService";
import { UserProps } from "@/features/users/types/UserListResponse";
import { useNavigate } from "react-router";
import { Loader } from "@/shared/components/Loader";
import { UsersListResponse } from "@/features/users/types/UserListResponse";

interface FormErrors {
  documentNumber: { error: boolean; message: string };
  firstName: { error: boolean; message: string };
  paternalSurname: { error: boolean; message: string };
  maternalSurname: { error: boolean; message: string };
  email: { error: boolean; message: string };
  address: { error: boolean; message: string };
  phone: { error: boolean; message: string };
}

export const FormNatural = ({userEdit, isUpdate, isReadOnly, onCancelEdit}:Readonly<{
  userEdit?:UsersListResponse, 
  isUpdate?:boolean,
  isReadOnly?:boolean,
  onCancelEdit?:() => void
}>) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<UserProps>({
    documentNumber: userEdit?.documentNumber || '',
    firstName: userEdit?.firstName || '',
    paternalSurname: userEdit?.paternalSurname || '',
    maternalSurname: userEdit?.maternalSurname || '',
    email:userEdit?.user.email || '',
    address:userEdit?.address || '',
    phone: userEdit?.phone || '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    documentNumber: { error: false, message: '' },
    firstName: { error: false, message: '' },
    paternalSurname: { error: false, message: '' },
    maternalSurname: { error: false, message: '' },
    email: { error: false, message: '' },
    address: { error: false, message: '' },
    phone: { error: false, message: '' },
  });

  // Validación para DNI (8 dígitos)
  const validateDocumentNumber = (value: string) => {
    const isValid = /^\d{8}$/.test(value);
    setErrors(prev => ({
      ...prev,
      documentNumber: {
        error: !isValid,
        message: isValid ? '' : 'El DNI debe tener 8 dígitos numéricos'
      }
    }));
    return isValid;
  };

  // Validación para nombres y apellidos (solo letras y espacios)
  const validateName = (value: string, field: keyof FormErrors) => {
    const isValid = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value);
    setErrors(prev => ({
      ...prev,
      [field]: {
        error: !isValid && value.length > 0,
        message: isValid ? '' : 'Solo se permiten letras y espacios'
      }
    }));
    return isValid;
  };

  // Validación para email
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

  // Validación para teléfono (9 dígitos)
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

  // Validación para dirección (no vacía)
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

  const validateForm = () => {
    const isDocumentValid = validateDocumentNumber(user.documentNumber);
    const isFirstNameValid = validateName(user.firstName || '', 'firstName');
    const isPaternalSurnameValid = validateName(user.paternalSurname || '', 'paternalSurname');
    const isMaternalSurnameValid = validateName(user.maternalSurname || '', 'maternalSurname');
    const isEmailValid = validateEmail(user.email);
    const isAddressValid = validateAddress(user.address);
    const isPhoneValid = validatePhone(user.phone);

    return isDocumentValid && isFirstNameValid && isPaternalSurnameValid && 
           isMaternalSurnameValid && isEmailValid && isAddressValid && isPhoneValid;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    const payload = {
      ...user,
      type: "NATURAL",
    };
    setOpenModal(false);
    setLoading(true);
    const response = await UsersService.createUser(payload);
    setLoading(false);
    navigate('/users');
    console.log(response);
  };

  const hanldeUpdateUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    const payload = {
      ...user,
      type: userEdit?.type,
    };
    setOpenModal(false);
    setLoading(true);
    const response = await UsersService.updateUser(userEdit?.id || 0, payload);
    setLoading(false);
    navigate('/users');
    console.log(response);
  };

  const handleButtonToConfirm = () => {
    if(isUpdate){
      hanldeUpdateUser();
    }else{
      handleCreateUser();
    }
  }

  return (
    <>
      <Loader isLoading={loading} />

      <div className="p-6 flex-1 flex flex-col gap-4 text-black dark:text-white border border-[#C3C3C3] rounded-[12px]">
        <p className="text-[14px] text-black dark:text-white mb-4">
          Ingresa los datos en los campos correspondientes:
        </p>
      
        <FormInput
          fieldName="DNI"
          value={user.documentNumber}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, documentNumber: value });
            validateDocumentNumber(value);
          }}
          error={errors.documentNumber.error}
          errorMessage={errors.documentNumber.message}
          disabled={isReadOnly}
        />

        <FormInput
          fieldName="Nombres"
          value={user.firstName || ""}
          handleOnChange={(e) => {
            const value = e.target.value;
            setUser({ ...user, firstName: value });
            validateName(value, 'firstName');
          }}
          error={errors.firstName.error}
          errorMessage={errors.firstName.message}
          disabled={isReadOnly}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            fieldName="Apellido Paterno"
            value={user.paternalSurname || ""}
            handleOnChange={(e) => {
              const value = e.target.value;
              setUser({ ...user, paternalSurname: value });
              validateName(value, 'paternalSurname');
            }}
            error={errors.paternalSurname.error}
            errorMessage={errors.paternalSurname.message}
            disabled={isReadOnly}
          />
          <FormInput
            fieldName="Apellido Materno"
            value={user.maternalSurname || ""}
            handleOnChange={(e) => {
              const value = e.target.value;
              setUser({ ...user, maternalSurname: value });
              validateName(value, 'maternalSurname');
            }}
            error={errors.maternalSurname.error}
            errorMessage={errors.maternalSurname.message}
            disabled={isReadOnly}
          />
        </div>

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
            handleClick={() => {
              if (validateForm()) {
                setOpenModal(true);
              }
            }}
            text="Confirmar registro"
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={() => handleButtonToConfirm()}
        title="Detalles del nuevo cliente"
        fields={[
          { label: "DNI", value: user.documentNumber },
          { label: "Nombres", value: user.firstName },
          { label: "Ap. Paterno", value: user.paternalSurname },
          { label: "Ap. Materno", value: user.maternalSurname },
          { label: "Dirección", value: user.address },
          { label: "Telefono", value: user.phone },
          { label: "Correo", value: user.email }
        ]}
      />

    </>
  );
};
