import { useState } from "react";
import { UsersService } from "@/features/users/service/usersService";
import { FormInput } from "../../shared/FormInput";
import { ReusableButton } from "../../shared/ReusableButton";
import { ConfirmationModal } from "../../shared/ConfirmationModal";
import { Loader } from "@/shared/components/Loader";
import { Modal } from "@/shared/components/Modal";
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

export const FormJuridica = ({
  userEdit,
  isUpdate,
  isReadOnly,
  onCancelEdit,
}: Readonly<{
  userEdit?: UsersListResponse;
  isUpdate?: boolean;
  isReadOnly?: boolean;
  onCancelEdit?: () => void;
}>) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [localUsers, setLocalUsers] = useState(userEdit?.users || []);

  const [user, setUser] = useState<UserProps>({
    documentNumber: userEdit?.documentNumber || "",
    businessName: userEdit?.businessName || "",
    email: userEdit?.users?.[0]?.email || "",
    address: userEdit?.address || "",
    phone: userEdit?.phone || "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    documentNumber: { error: false, message: "" },
    businessName: { error: false, message: "" },
    email: { error: false, message: "" },
    address: { error: false, message: "" },
    phone: { error: false, message: "" },
  });

  const validateRUC = (value: string) => {
    const isValid = /^\d{11}$/.test(value);
    setErrors((prev) => ({
      ...prev,
      documentNumber: {
        error: !isValid,
        message: isValid ? "" : "El RUC debe tener 11 dígitos numéricos",
      },
    }));
    return isValid;
  };

  const validateBusinessName = (value: string) => {
    const isValid = value.trim().length > 0;
    setErrors((prev) => ({
      ...prev,
      businessName: {
        error: !isValid,
        message: isValid ? "" : "La razón social no puede estar vacía",
      },
    }));
    return isValid;
  };

  const validateEmail = (value: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setErrors((prev) => ({
      ...prev,
      email: {
        error: !isValid && value.length > 0,
        message: isValid ? "" : "Formato de correo electrónico inválido",
      },
    }));
    return isValid;
  };

  const validateAddress = (value: string) => {
    const isValid = value.trim().length > 0;
    setErrors((prev) => ({
      ...prev,
      address: {
        error: !isValid && value.length > 0,
        message: isValid ? "" : "La dirección no puede estar vacía",
      },
    }));
    return isValid;
  };

  const validatePhone = (value: string) => {
    const isValid = /^\d{9}$/.test(value);
    setErrors((prev) => ({
      ...prev,
      phone: {
        error: !isValid && value.length > 0,
        message: isValid ? "" : "El teléfono debe tener 9 dígitos numéricos",
      },
    }));
    return isValid;
  };

  const validateForm = () => {
    const isDocumentValid = validateRUC(user.documentNumber);
    const isBusinessNameValid = validateBusinessName(user.businessName || "");
    const isEmailValid = validateEmail(user.email);
    const isAddressValid = validateAddress(user.address);
    const isPhoneValid = validatePhone(user.phone);

    return (
      isDocumentValid &&
      isBusinessNameValid &&
      isEmailValid &&
      isAddressValid &&
      isPhoneValid
    );
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    const payload = { ...user, type: "JURIDICA" };
    setOpenModal(false);
    setLoading(true);
    const response = await UsersService.createUser(payload);
    setLoading(false);
    navigate("/users");
    console.log(response);
  };

  const handleUpdateUser = async () => {
    if (!validateForm()) return;
    const payload = { ...user, type: userEdit?.type };
    setOpenModal(false);
    setLoading(true);
    const response = await UsersService.updateUser(userEdit?.id || 0, payload);
    setLoading(false);
    navigate("/users");
    console.log(response);
  };

  const handleDisableUser = (userId: string) => {
    // TODO: Implement disable user logic
    console.log("Disable user:", userId);
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !newUserUsername.trim()) {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (!userEdit?.id) {
      alert("No se puede agregar usuario: ID de entidad no encontrado");
      return;
    }

    setIsAddingUser(true);
    try {
      await UsersService.addUserToJuridica(userEdit.id, {
        email: newUserEmail,
        username: newUserUsername,
      });

      // Create new user object to add to the list
      const newUser = {
        id: Date.now(), // Temporary ID until refresh
        entityId: 0, // Default value
        email: newUserEmail,
        username: newUserUsername,
        active: true,
        isPrimary: false,
        Roles: [] // Empty roles array
      };

      // Update userEdit state to include the new user
      if (userEdit && userEdit.users) {
        userEdit.users.push(newUser);
      }
      
      // Update local users state
      setLocalUsers(prevUsers => [...prevUsers, newUser]);

      // Reset form and close modal
      setNewUserEmail("");
      setNewUserUsername("");
      setShowAddUserModal(false);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error al agregar usuario");
    } finally {
      setIsAddingUser(false);
    }
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
          value={user.businessName || ""}
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
      </div>

      {/* Sección de usuarios - Solo en detail y edit */}
      {(isReadOnly) &&
        userEdit?.users &&
        userEdit.users.length > 0 && (
          <div className="p-6 flex flex-col gap-4 text-black dark:text-white border border-[#C3C3C3] rounded-[12px]">
            <div className="flex justify-between">
              <h3 className="text-[16px] font-semibold mb-2">
                Usuarios asociados
              </h3>
              {/* Botón agregar usuario - Solo en edit */}
              {isReadOnly && (
                <div className="flex justify-end">
                  <ReusableButton
                    handleClick={() => setShowAddUserModal(true)}
                    text="Agregar user"
                    variant="secondary"
                    justify="center"
                  />
                </div>
              )}
            </div>
            <div className="space-y-3">
              {localUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-[8px] border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-medium">
                      {user.username}
                    </span>
                    <span className="text-[12px] text-gray-600 dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                  {isReadOnly && (
                    <button
                      className="text-[12px] hover:text-blue-600 transition-colors"
                      onClick={async () => {
                         try {
                           await UsersService.updateStatusUser(user.id);
                           // Actualizar el estado local del usuario
                           setLocalUsers(prevUsers => 
                             prevUsers.map(u => 
                               u.id === user.id ? { ...u, active: !u.active } : u
                             )
                           );
                         } catch (error) {
                           console.error("Error al actualizar estado del usuario:", error);
                           alert("Error al actualizar el estado del usuario");
                         }
                       }}
                    >
                      {user.active ? "Deshabilitar" : "Habilitar"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
          <ReusableButton handleClick={handleClick} text="Confirmar registro" />
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
        ]}
      />

      {/* Modal para agregar usuario */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => {
          setShowAddUserModal(false);
          setNewUserEmail("");
          setNewUserUsername("");
        }}
        title="Agregar Usuario"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el email del usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={newUserUsername}
              onChange={(e) => setNewUserUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ingrese el username del usuario"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <ReusableButton
              handleClick={() => {
                setShowAddUserModal(false);
                setNewUserEmail("");
                setNewUserUsername("");
              }}
              text="Cancelar"
              variant="tertiary"
              disabled={isAddingUser}
            />
            <ReusableButton
              handleClick={handleAddUser}
              text={isAddingUser ? "Agregando..." : "Agregar Usuario"}
              variant="primary"
              disabled={isAddingUser || !newUserEmail.trim() || !newUserUsername.trim()}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
