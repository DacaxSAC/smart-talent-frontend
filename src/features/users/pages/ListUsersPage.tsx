import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UsersService } from "../service/usersService";
import { UsersList } from "../components/private/list/UsersList";
import { UsersListResponse } from "../types/UserListResponse";
import { ReusableButton } from "../components/shared/ReusableButton";

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

  return (
    <div className="h-full flex flex-col px-5 md:px-8 py-15 gap-11 font-karla font-light">
      <div className="flex flex-col md:flex-row justify-center md:justify-between">
        <div className="flex flex-col text-black dark:text-white">
          <p className="text-[32px] md:text-[36px] xl:text-[36px]">
            LISTA DE USUARIOS
          </p>
          <p className="text-[14px] font-light">
            Visualiza todos los clientes registrados.
          </p>
        </div>
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
          <UsersList users={users} />
        )}
      </div>
    </div>
  );
}
