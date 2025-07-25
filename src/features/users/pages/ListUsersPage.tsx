import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UsersService } from "../service/usersService";
import { UsersList } from "../components/private/list/UsersList";
import { UsersListResponse } from "../types/UserListResponse";
import { ReusableButton } from "../components/shared/ReusableButton";
import { PageTitle } from "../components/shared/PageTitle";
import { PageLayout } from "../components/shared/PageLayout";

export function ListUsersPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UsersListResponse[]>([]);
  const navigate = useNavigate();

  const handleGetUsers = async () => {
    setLoading(true);
    const response = await UsersService.getUsers();
    console.log(response);
    setUsers(response);
    setLoading(false);
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  const handleDelete = async (user: UsersListResponse) => {
    try {
      await UsersService.deleteUser(user.id);
      handleGetUsers();
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };

  const handleReactivate = async (user: UsersListResponse) => {
    try {
      await UsersService.reactivateUser(user.id);
      handleGetUsers();
    } catch (error: any) {
      if (error.message === "Unauthorized") {
        navigate("/login");
      }
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-center md:justify-between">
        <PageTitle 
          title="Gestión de clientes"
          description="Gestiona y visualiza los clientes registrados."
        />
        
        <div className="my-5">
          <ReusableButton
            handleClick={() => navigate("/users/create")}
            text="Crear nuevo usuario"
            justify="start"
          />
        </div>
      </div>

      {/** USERS TABLE */}
      <div className="w-full flex-1 p-3 rounded-sidebar shadow-doc-options bg-white dark:bg-black dark:border dark:border-black-1 text-[12px] overflow-x-auto relative">
        {loading ? (
          <div className="w-full text-[14px] font-karla font-light">
            <div
              className="px-2 bg-white-1 dark:bg-black-2
                  text-black dark:text-white font-light text-[14px] rounded-sidebar mb-4"
            >
              <p className="p-2 w-full text-center">
                Cargando lista de empleados...
              </p>
            </div>
          </div>
        ) : (
          <UsersList users={users} handleDelete={handleDelete} handleReactivate={handleReactivate} />
        )}
      </div>
    </PageLayout>
  );
}
