// React imports
import { Fragment } from "react";

// Component imports
import { RecruitmentsListBase } from "../components/shared/RecruitmentsListBase";

/**
 * Página principal de lista de reclutamientos
 * Muestra todos los reclutamientos sin filtros de estado específicos
 */
export function RecruitmentsListPage() {
  return (
    <Fragment>
      <RecruitmentsListBase
        title="Lista de reclutamientos"
        description="Revisa aquí los procesos de reclutamiento solicitados."
        showAddButton={true}
      />
    </Fragment>
  );
}