import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { UserTypeButton } from "../components/private/create/UserTypeButton";
import { FormNatural } from "../components/private/create/FormNatural";
import { FormJuridica } from "../components/private/create/FormJuridica";
import { ReusableButton } from "../components/shared/ReusableButton";
import { PageTitle } from "../components/shared/PageTitle";
import { UsersListResponse } from "../types/UserListResponse";
import { PageLayout } from "../components/shared/PageLayout";
import { UsersService } from "../service/usersService";
import { Loader } from "@/shared/components/Loader";

export function DetailUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UsersListResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene los datos del usuario por ID
   */
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError("ID de usuario no válido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userData = await UsersService.getUser(parseInt(id));
        console.log(userData);
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        setError("Error al cargar los datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
     return (
       <PageLayout>
         <Loader isLoading={isLoading} />
       </PageLayout>
     );
   }

  if (error || !user) {
    return (
      <PageLayout>
        <div className="text-center text-red-500">
          {error || "No se encontró información del usuario"}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="w-full pt-5 pb-5 md:pt-0 flex flex-col gap-6 md:gap-0 md:flex-row justify-between items-center text-black dark:text-white">

        <PageTitle 
          title="Detalles del cliente"
          description="Visualiza y edita los datos personales o empresariales del cliente."
        />

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
    </PageLayout>
  );
}
