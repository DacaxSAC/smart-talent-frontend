import { useState } from "react";
import { useNavigate } from "react-router";
import { UserTypeButton } from "../components/private/create/UserTypeButton";
import { FormNatural } from "../components/private/create/FormNatural";
import { FormJuridica } from "../components/private/create/FormJuridica";
import { ReusableButton } from "../components/shared/ReusableButton";

export function CreateUserPage() {
  const [userType, setUserType] = useState<"NATURAL" | "JURIDICA">("JURIDICA");
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col px-5 md:px-8 py-15 gap-5 font-karla font-light">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-center
                    w-full
                    text-black dark:text-white">
        <div className="flex flex-col text-start">
          <p className="text-[32px] md:text-[36px] xl:text-[36px]">
            CREACIÓN DE USUARIOS
          </p>
          <p className="text-[14px] font-light">
            Añade clientes y completa sus datos personales o empresariales.
          </p>
        </div>
        <ReusableButton
          handleClick={() => navigate("/users")}
          text="Regresar a la lista de usuarios"
          variant="tertiary"
          justify="start"
        />
      </div>
      {/** User Type Buttons */}
      <div className="flex gap-6">
        <UserTypeButton
          expectedType="NATURAL"
          userType={userType}
          hanldeUserType={() => setUserType("NATURAL")}
        />
        <UserTypeButton
          expectedType="JURIDICA"
          userType={userType}
          hanldeUserType={() => setUserType("JURIDICA")}
        />
      </div>
     
        {userType === "NATURAL" ? <FormNatural /> : <FormJuridica />}

    </div>
  );
}
