import { Fragment } from "react/jsx-runtime";

import { LayoutPage } from "@/shared/components/LayoutPage";
import { Loader } from "@/shared/components/Loader";
// import { useHasRole } from "@/features/auth/hooks/useUser";
// import { ROLES } from "@/features/auth/constants/roles";
import { RequestsHistory } from "../types/RequestsHistory";
import { useEffect, useState } from "react";
import { BillingService } from "../service/billingService";
import { RequestsHistoryList } from "../components/private/RequestsHistoryList";

export function ResquestsHistoryPage() {
  // Hooks
  // const isAdmin = useHasRole([ROLES.ADMIN]);
  // const isUser = useHasRole([ROLES.USER]);

  // States
  const [requestsHistory, setRequestsHistory] = useState<RequestsHistory[]>([]);

  // Effects
  useEffect(() => {
    async function getRequestsHistory() {
      const response = await BillingService.getRequestsHistory({
        page: 1,
        limit: 10,
      });
      if (response.success) {
        setRequestsHistory(response.data.requests);
      } else {
        console.error(response.message);
      }
    }
    getRequestsHistory();
  }, []);

  return (
    <LayoutPage
      title="HISTORIAL DE SOLICITUDES"
      description="Reporte de solicitudes por fecha"
      buttonsHeader={
        <Fragment>
          
        </Fragment>
      }
      footer={
        <Fragment>
          
        </Fragment>
      }
    >
      <Fragment>
        <Loader isLoading={false} />

        <RequestsHistoryList requestsHistory={requestsHistory} />
      </Fragment>
    </LayoutPage>
  )
}