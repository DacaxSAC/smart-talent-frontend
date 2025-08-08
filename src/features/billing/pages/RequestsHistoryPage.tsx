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
            style={{ 
              padding: "8px 12px", 
              backgroundColor: "#4CAF50", 
              color: "#fff", 
              border: "none", 
              borderRadius: "4px" 
            }} 
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
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="dateFrom">Desde:</label>
            <input
              type="date"
              id="dateFrom"
              className="border border-gray-300 rounded-md p-2"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dateTo">Hasta:</label>
            <input
              type="date"
              id="dateTo"
              className="border border-gray-300 rounded-md p-2"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Filtrar
          </button>
        </div>
        <RequestsHistoryList requestsHistory={requestsHistory} />
      </Fragment>
    </LayoutPage>
  )
}