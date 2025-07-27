import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { UsersService } from "../service/usersService";
import { UsersList } from "../components/private/list/UsersList";
import { UsersListResponse } from "../types/UserListResponse";
import { ReusableButton } from "../components/shared/ReusableButton";
import { PageTitle } from "../components/shared/PageTitle";
import { PageLayout } from "../components/shared/PageLayout";
import { NoData } from "@/shared/components/NoData";

export function ListUsersPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UsersListResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | "all"
  >("active");
  const [typeFilter, setTypeFilter] = useState<"NATURAL" | "JURIDICA" | "all">(
    "all"
  );
  const [searchFilter, setSearchFilter] = useState<string>("");
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

  /**
   * Filtra los usuarios según los criterios seleccionados
   */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filtro por estado
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active);

      // Filtro por tipo
      const typeMatch = typeFilter === "all" || user.type === typeFilter;

      // Filtro por búsqueda (nombre o DNI)
      const searchMatch =
        searchFilter === "" ||
        user.documentNumber
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) ||
        (user.type === "NATURAL" &&
          `${user.firstName} ${user.paternalSurname} ${user.maternalSurname}`
            .toLowerCase()
            .includes(searchFilter.toLowerCase())) ||
        (user.type === "JURIDICA" &&
          user.businessName
            ?.toLowerCase()
            .includes(searchFilter.toLowerCase()));

      return statusMatch && typeMatch && searchMatch;
    });
  }, [users, statusFilter, typeFilter, searchFilter]);

  /**
   * Reinicia todos los filtros a sus valores por defecto
   */
  const handleResetFilters = () => {
    setStatusFilter("active");
    setTypeFilter("all");
    setSearchFilter("");
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
            text="Registrar nuevo cliente"
            justify="start"
          />
        </div>
      </div>

      {/** USERS FILTER */}
      <div className="flex flex-wrap justify-start gap-6 p-4 rounded text-[14px]">
        {/* Filtro por estado */}
        <div className="flex flex-col gap-2">
          <label htmlFor="status-filter" className="text-medium">Filtrar por estado:</label>
          <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "active" | "inactive" | "all")
              }
              className="w-full"
            >
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        {/* Filtro por tipo */}
        <div className="flex flex-col gap-2">
          <label htmlFor="type-filter" className="text-medium">Filtrar por tipo:</label>
          <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "NATURAL" | "JURIDICA" | "all")
              }
              className="w-full"
            >
              <option value="all">Todos</option>
              <option value="NATURAL">Natural</option>
              <option value="JURIDICA">Jurídica</option>
            </select>
          </div>
        </div>

        {/* Búsqueda por nombre o DNI */}
        <div className="flex flex-col gap-2">
          <label htmlFor="search-filter" className="text-medium">Buscar por nombre o DNI:</label>
          <div className="px-2 py-1 border border-white-1 rounded-[8px] text-medium">
            <input
              id="search-filter"
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Ingrese nombre o DNI"
              className="w-full"
            />
          </div>
        </div>

        {/* Botón para reiniciar filtros */}
        <div className="flex flex-col justify-end gap-2">
          <div className="px-2 py-1 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium">
            <button onClick={handleResetFilters} className="w-full cursor-pointer">Reiniciar filtros</button>
          </div>
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
                Cargando lista de clientes...
              </p>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <UsersList
            users={filteredUsers}
            handleDelete={handleDelete}
            handleReactivate={handleReactivate}
          />
        ) : (
          <NoData />
        )}
      </div>
    </PageLayout>
  );
}
