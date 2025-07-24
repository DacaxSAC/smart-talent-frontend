import { useState } from "react";
import { useNavigate } from "react-router";
import { UserTypeButton } from "../components/private/create/UserTypeButton";
import { FormNatural } from "../components/private/create/FormNatural";
import { FormJuridica } from "../components/private/create/FormJuridica";
import { ReusableButton } from "../components/shared/ReusableButton";
import { PageTitle } from "../components/shared/PageTitle";
import { PageLayout } from "../components/shared/PageLayout";

export function CreateUserPage() {
  const [userType, setUserType] = useState<"NATURAL" | "JURIDICA">("JURIDICA");
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="w-full flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-center text-black dark:text-white">
        
        <PageTitle 
          title="Creación de clientes"
          description="Añade clientes y completa sus datos personales o empresariales."
        />
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

    </PageLayout>
  );
}
