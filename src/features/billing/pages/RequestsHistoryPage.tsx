import { Fragment } from "react/jsx-runtime";

import { LayoutPage } from "@/shared/components/LayoutPage";
import { Loader } from "@/shared/components/Loader";
// import { useHasRole } from "@/features/auth/hooks/useUser";
// import { ROLES } from "@/features/auth/constants/roles";
import { RequestsHistory } from "../types/RequestsHistory";
import { useEffect, useState } from "react";
import { BillingService } from "../service/billingService";
import { RequestsHistoryList } from "../components/private/RequestsHistoryList";

import { exportToExcel } from "@/shared/utils/xlsx/exportToExcel";

export function ResquestsHistoryPage() {
  // Hooks
  // const isAdmin = useHasRole([ROLES.ADMIN]);
  // const isUser = useHasRole([ROLES.USER]);

  // States
  const [requestsHistory, setRequestsHistory] = useState<RequestsHistory[]>([]);

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  async function getRequestsHistory(params?: { dateFrom?: string; dateTo?: string }) {
    const response = await BillingService.getRequestsHistory({
      page: 1,
      limit: 10,
      dateFrom: params?.dateFrom,
      dateTo: params?.dateTo,
    });
    if (response.success) {
      setRequestsHistory(response.data.requests);
    } else {
      console.error(response.message);
    }
  }

  // Effects
  useEffect(() => {
    getRequestsHistory();
  }, []);

  const handleFilter = () => {
    getRequestsHistory({ dateFrom, dateTo });
  };

  return (
    <LayoutPage
      title="HISTORIAL DE SOLICITUDES"
      description="Reporte de solicitudes por fecha"
      buttonsHeader={
        <Fragment>
          <button 
            onClick={() => exportToExcel(requestsHistory, "reporte_solicitudes")} 
            className="px-2 py-1 border border-success rounded-[8px] hover:bg-white-1 text-[12px] text-success"
          > 
            Exportar a Excel 
          </button>
        </Fragment>
      }
      footer={
        <Fragment>
          
        </Fragment>
      }
    >
      <Fragment>
        <Loader isLoading={false} />
        {/* aqui agregar dos filtros de fecha desde hasta */}
        <div className="flex items-end gap-4 mb-4">
          <div className="flex flex-col gap-1 w-full md:w-auto scheme-light dark:scheme-dark">
            <label
              htmlFor="dateFrom"
              className="text-neutral-7 dark:text-neutral-3"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              id="dateFrom"
              className="px-2 py-1 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 w-full md:w-auto scheme-light dark:scheme-dark">
            <label
              htmlFor="dateTo"
              className="text-neutral-7 dark:text-neutral-3"
            >
              Fecha de fin
            </label>
            <input
              type="date"
              id="dateTo"
              className="px-2 py-1 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button
            onClick={handleFilter}
            className="px-2 py-1 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
          >
            Filtrar
          </button>
        </div>
        <RequestsHistoryList requestsHistory={requestsHistory} />
      </Fragment>
    </LayoutPage>
  )
}