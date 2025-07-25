import { UsersListResponse } from "@/features/users/types/UserListResponse";
import { useNavigate } from "react-router";

export const UsersList = ({
  users,
  handleDelete,
  handleReactivate,
}: Readonly<{
  users: UsersListResponse[];
  handleDelete: (user: UsersListResponse) => Promise<void>;
  handleReactivate: (user: UsersListResponse) => Promise<void>;
}>) => {
  const navigate = useNavigate();

  const handleEdit = (user:UsersListResponse) => {
    navigate(`/users/detail/${user.id}`, { state: { user } });
  };

  return (
    <div className="w-full text-[14px] font-karla font-light">
      <div className="px-2 grid grid-cols-7 gap-0 bg-table-head  text-black dark:text-white rounded-sidebar mb-4">
        <div className="col-span-1 p-2">Tipo</div>
        <div className="col-span-1 p-2">Nro Doc</div>
        <div className="col-span-2 p-2">Nombre o Razon Social</div>
        <div className="col-span-1 p-2">Estado</div>
        <div className="col-span-2 p-2">Acciones</div>
      </div>
      <div className="text-black dark:text-white flex flex-col gap-2">
        {users.map((request, index) => (
          <div key={index}>
            {/* Main Row */}
            <div className="px-2 grid grid-cols-7 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10">
              <div className="col-span-1 p-2 ">
                {request.type}
              </div>
              <div className="col-span-1 p-2 ">
                {request.documentNumber}
              </div>
              <div className="col-span-2 p-2 ">
                {request.type === 'NATURAL' ? `${request.firstName} ${request.paternalSurname} ${request.maternalSurname}` : request.businessName}
              </div>
              <div className="col-span-1 p-2 ">
                {request.active ? 'Activo' : 'Inactivo'}
              </div>
              <div className="col-span-2 p-2 flex gap-4 justify-start">
                <button onClick={()=>handleEdit(request)} className="cursor-pointer hover:text-table-head">Ver detalles</button>
                <button onClick={()=>request.active ? handleDelete(request) : handleReactivate(request)} className="cursor-pointer hover:text-table-head">{request.active ? 'Dehabilitar' : 'Habilitar'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
