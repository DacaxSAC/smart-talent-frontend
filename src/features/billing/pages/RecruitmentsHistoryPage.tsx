import { Fragment } from "react/jsx-runtime";

import { LayoutPage } from "@/shared/components/LayoutPage";
import { Loader } from "@/shared/components/Loader";
import { useUser } from "@/features/auth/hooks/useUser";

export function RecruitmentsHistoryPage() {
  // Hooks
  const { user } = useUser();

  // States
  

  return (
    <LayoutPage
      title="HISTORIAL DE RECLUTAMIENTOS"
      description="Reporte de reclutamientos por fecha"
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
      </Fragment>
    </LayoutPage>
  )
}