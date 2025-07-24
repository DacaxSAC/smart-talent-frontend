import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { UserTypeButton } from "../components/private/create/UserTypeButton";
import { FormNatural } from "../components/private/create/FormNatural";
import { FormJuridica } from "../components/private/create/FormJuridica";
import { motion } from "framer-motion";
import { ReusableButton } from "../components/shared/ReusableButton";
import { UsersListResponse } from "../types/UserListResponse";

export function DetailUserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user:UsersListResponse = location.state?.user;
  const [isEditMode, setIsEditMode] = useState(false);

  if (!user) {
    return <div>No se encontró información del usuario</div>;
  }

  return (
    <div className="h-full flex flex-col px-5 md:px-8 py-15 gap-5 font-karla font-light">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-center
                    w-full mt-5 mb-5 md:mt-0
                    text-black dark:text-white">
        <div className="flex flex-col text-start">
          <p className="text-[32px] md:text-[36px] xl:text-[36px]">
            DATOS DE USUARIO
          </p>
          <p className="text-[14px] font-light">
            Edita los datos del cliente seleccionado y completa sus datos personales o empresariales.
          </p>
        </div>
        <ReusableButton
          handleClick={() => navigate("/users")}
          text="Regresar a la lista de usuarios"
          variant="tertiary"
          justify="start"
        />
      </div>
      <div className="flex gap-6">
        <UserTypeButton
          expectedType="NATURAL"
          userType={user.type}
          hanldeUserType={() => {}}
          isUpdate={true}
        />
        <UserTypeButton
          expectedType="JURIDICA"
          userType={user.type}
          hanldeUserType={() => {}}
          isUpdate={true}
        />
      </div>

      {user.type === "NATURAL" ? (
        <FormNatural 
          isUpdate={isEditMode} 
          userEdit={user} 
          isReadOnly={!isEditMode}
          onCancelEdit={() => setIsEditMode(false)}
        />
      ) : (
        <FormJuridica 
          isUpdate={isEditMode} 
          userEdit={user} 
          isReadOnly={!isEditMode}
          onCancelEdit={() => setIsEditMode(false)}
        />
      )}
      {!isEditMode && (
        <div className="flex justify-end">
          <ReusableButton
            handleClick={() => setIsEditMode(true)}
            text="Editar usuario"
            justify="center"
          />
        </div>
      )}
    </div>
  );
}
