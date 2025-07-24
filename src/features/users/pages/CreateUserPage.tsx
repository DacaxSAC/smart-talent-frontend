import { useState } from "react";
import { useNavigate } from "react-router";
import { UserTypeButton } from "../components/private/create/UserTypeButton";
import { FormNatural } from "../components/private/create/FormNatural";
import { FormJuridica } from "../components/private/create/FormJuridica";
import { motion } from "framer-motion";

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
        <motion.button
          whileHover={{
            scale: 1.01,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/users")}
          className="
          bg-white-2 dark:bg-black-2 hover:bg-white-1 dark:hover:bg-black-1 
          border border-medium rounded-sidebar 
           py-2 px-16 
          text-[14px] font-light
          cursor-pointer
        "
        >
          Regresar a la lista de usuarios
        </motion.button>
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
