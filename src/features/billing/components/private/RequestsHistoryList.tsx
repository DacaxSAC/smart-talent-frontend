import { RequestsHistory } from "../../types/RequestsHistory";

export interface RequestsHistoryListProps {
  requestsHistory: RequestsHistory[];
}
export const RequestsHistoryList = ({ requestsHistory }: Readonly<RequestsHistoryListProps>) => {

  const columnTemplate = `repeat(6, minmax(0, 1fr))`;

  return (
    <div className="w-full text-[14px] font-karla font-light overflow-x-auto">
      <div className="px-2 grid gap-0 bg-main-3plus dark:bg-main-1plus text-black dark:text-white rounded-sidebar mb-4" style={{ gridTemplateColumns: columnTemplate }}>
        <div className="col-span-1 p-2">Fecha</div>
        <div className="col-span-1 p-2">Propietario</div>
        <div className="col-span-1 p-2">DNI</div>
        <div className="col-span-1 p-2">Nombre Completo</div>
        <div className="col-span-1 p-2">Estado</div>
        {requestsHistory[0]?.documents.map((doc, docIndex) => (
          <div className="col-span-1 p-2" key={docIndex}>
            {doc.name}
          </div>
        ))}
      </div>
      <div className="text-black dark:text-white flex flex-col gap-2">
        {requestsHistory.map((request) => (
          <div key={request.id}>
            <div className="px-2 grid gap-0 border border-white-1 dark:border-black-1 rounded-sidebar hover:bg-black-05 dark:hover:bg-white-10" style={{ gridTemplateColumns: columnTemplate }}>
              <div className="col-span-1 p-2">
                {new Date(request.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
              </div>
              <div className="col-span-1 p-2">
                {request.owner}
              </div>
              <div className="col-span-1 p-2">
                {request.dni}
              </div>
              <div className="col-span-1 p-2">
                {request.fullname}
              </div>
              <div className="col-span-1 p-2">
                <span className={`px-2 py-1 rounded text-xs ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : request.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
>
                  {request.status === 'PENDING' ? 'PENDIENTE' : request.status === 'PAID' ? 'Pagado' : 'Cancelado'}
                </span>
              </div>
              {request.documents.map((doc, docIndex) => (
                <div key={docIndex} className="col-span-1 p-2 text-xs">
                  <span className={`px-1 py-0.5 rounded text-xs ${doc.status === 'Realizado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {doc.status === 'Realizado' ? 'Realizado' : 'No realizado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
