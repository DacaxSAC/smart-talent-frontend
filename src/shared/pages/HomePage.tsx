import { useState, useEffect, useCallback } from "react";
import { PageLayout } from "@/features/users/components/shared/PageLayout";
import { PageTitle } from "@/features/users/components/shared/PageTitle";
import { RequestsService, Request } from "@/features/requests/services";
import { useHasRole, useUser } from "@/features/auth/hooks/useUser";
import { ROLES } from "@/features/auth/constants/roles";
import { Loader } from "@/shared/components/Loader";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const HomePage = () => {
  const { user } = useUser();
  const isAdmin = useHasRole(ROLES.ADMIN);
  const isRecruiter = useHasRole(ROLES.RECRUITER);

  // Estados para las solicitudes y estadísticas
  const [requests, setRequests] = useState<Request[]>([]);
  const [allRequests, setAllRequests] = useState<Request[]>([]); // Guardar todas las solicitudes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterType, setFilterType] = useState<"manual" | "monthly">("monthly"); // Tipo de filtro - Por defecto mensual
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }); // Formato: "2025-01" - Inicializado con el mes actual
  const [isOnlyUser, setIsOnlyUser] = useState(false);

  /**
   * Obtiene las solicitudes del servidor
   */
  const handleGetRequests = async () => {
    try {
      setLoading(true);
      setError(false);

      const data =
        isAdmin || isRecruiter
          ? await RequestsService.getAllPeople(
              statusFilter,
              isOnlyUser ? user?.id : undefined
            )
          : await RequestsService.getAllPeopleByEntityId(
              user?.entityId as number
            );

      setAllRequests(data.people); // Guardar todas las solicitudes
      console.log(data.people);

      // Los datos se han cargado correctamente

      setLoading(false);
    } catch (err) {
      console.error("Error al obtener solicitudes:", err);
      setError(true);
      setLoading(false);
    }
  };

  /**
   * Filtra las solicitudes según el tipo de filtro seleccionado
   */
  const filterRequests = useCallback(() => {
    let filteredRequests = [...allRequests];

    if (filterType === "manual" && (startDate || endDate)) {
      // Filtro manual por fechas específicas
      filteredRequests = allRequests.filter((request) => {
        // Validar que createdAt existe
        if (!request.createdAt) {
          console.warn(`Solicitud ${request.id} sin fecha de creación`);
          return false;
        }
        
        const requestDate = new Date(request.createdAt);
        
        // Verificar que la fecha es válida
        if (isNaN(requestDate.getTime())) {
          console.warn(`Fecha inválida para solicitud ${request.id}: ${request.createdAt}`);
          return false;
        }
        
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
    
        if (start && end) {
          return requestDate >= start && requestDate <= end;
        } else if (start) {
          return requestDate >= start;
        } else if (end) {
          return requestDate <= end;
        }
        return true;
      });
    } else if (filterType === "monthly" && selectedMonth) {
      // Filtro por mes/año
      const [year, month] = selectedMonth.split("-");
      filteredRequests = allRequests.filter((request) => {
        // Validar que createdAt existe
        if (!request.createdAt) {
          console.warn(`Solicitud ${request.id} sin fecha de creación`);
          return false;
        }
        
        const requestDate = new Date(request.createdAt);
        
        // Verificar que la fecha es válida
        if (isNaN(requestDate.getTime())) {
          console.warn(`Fecha inválida para solicitud ${request.id}: ${request.createdAt}`);
          return false;
        }
        
        return (
          requestDate.getFullYear() === parseInt(year) &&
          requestDate.getMonth() === parseInt(month) - 1
        ); // getMonth() es 0-indexed
      });
    } else {
      // Si no hay filtros activos, mostrar todas las solicitudes
      filteredRequests = [...allRequests];
    }
  
    console.log('Filtros aplicados:', { filterType, selectedMonth, startDate, endDate });
    console.log('Solicitudes originales:', allRequests.length);
    console.log('Solicitudes filtradas:', filteredRequests.length);
    console.log('Ejemplo de fecha de solicitud:', allRequests[0]?.createdAt);
    setRequests(filteredRequests);
  }, [allRequests, filterType, startDate, endDate, selectedMonth]);

  /**
   * Calcula estadísticas básicas del dashboard
   */
  const getStatistics = () => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(
      (req) => req.status === "PENDING"
    ).length;
    const onprocessRequests = requests.filter(
      (req) => req.status === "IN_PROGRESS" || req.status === "OBSERVED"
    ).length;
    const approvedRequests = requests.filter(
      (req) => req.status === "COMPLETED"
    ).length;
    const rejectedRequests = requests.filter(
      (req) => req.status === "REJECTED"
    ).length;

    return {
      total: totalRequests,
      pending: pendingRequests,
      onprocess: onprocessRequests,
      approved: approvedRequests,
      rejected: rejectedRequests,
    };
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedMonth("");
    setRequests(allRequests);
  };

  /**
   * Procesa los datos de estados de solicitudes para el gráfico de dona
   */
  const getStatusData = () => {
    const statusCount: { [key: string]: number } = {};
    
    requests.forEach((request) => {
      statusCount[request.status] = (statusCount[request.status] || 0) + 1;
    });

    const statusColors: { [key: string]: string } = {
      'COMPLETED': '#1ABC9C',
      'PENDING': '#FA8D28',
      'IN_PROGRESS': '#3B82F6',
      'OBSERVED': '#6366F1',
      'REJECTED': '#E74C3C'
    };

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      color: statusColors[status] || '#6B7280'
    }));
  };

  /**
   * Procesa los datos de tipos de documentos para el gráfico de barras
   */
  const getDocumentTypesData = () => {
    const documentTypes: { [key: string]: number } = {};
    
    requests.forEach((request) => {
      request.documents.forEach((doc) => {
        documentTypes[doc.name] = (documentTypes[doc.name] || 0) + 1;
      });
    });

    return Object.entries(documentTypes)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 tipos de documentos
  };

  /**
   * Procesa los datos de progreso de documentos para el gráfico de área
   */
  const getDocumentProgressData = () => {
    const statusCount: { [key: string]: number } = {};
    
    requests.forEach((request) => {
      request.documents.forEach((doc) => {
        const status = doc.status || 'Sin Estado';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count
    }));
  };

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    if (user) {
      handleGetRequests();
    }
  }, [user, statusFilter, isOnlyUser]);

  // Aplicar filtros cuando cambien las fechas o el tipo de filtro
  useEffect(() => {
    if (allRequests.length > 0) {
      filterRequests();
    }
  }, [allRequests, filterRequests]);

  const statistics = getStatistics();

  if (loading) {
    return (
      <PageLayout>
        <Loader isLoading={loading} />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center text-red-500">
          Error al cargar las estadísticas del dashboard
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-center md:justify-between">
        <PageTitle
          title="PANEL DE CONTROL"
          description="Bienvenido al panel de control."
        />
        {/* Filtros mejorados */}
        <div className="text-[12px] my-2 mx-6 h-full flex items-center justify-center">
          {/* Selector de tipo de filtro */}
          <div className="flex gap-4 ">
            <button
              onClick={() => setFilterType("monthly")}
              className={`px-2 py-1 rounded-lg transition-colors ${
                filterType === "monthly"
                  ? "bg-main"
                  : "border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
              }`}
            >
              Por Mes/Año
            </button>
            <button
              onClick={() => setFilterType("manual")}
              className={`px-2 py-1 rounded-lg transition-colors ${
                filterType === "manual"
                  ? "bg-main"
                  : "border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
              }`}
            >
              Filtro Manual
            </button>
            {/* Botón para reiniciar filtros */}
            {/*<div className="flex flex-col justify-end gap-2">
              <div className="px-2 py-1 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium">
                <button onClick={clearFilters} className="w-full cursor-pointer">Reiniciar filtros</button>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
      {/* Filtros según el tipo seleccionado */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end text-[12px]">
        {filterType === "manual" ? (
          // Filtros manuales
          <>
            <div className="flex flex-col gap-1 w-full md:w-auto scheme-light dark:scheme-dark">
              <label
                htmlFor="start-date"
                className="text-neutral-7 dark:text-neutral-3"
              >
                Fecha de inicio
              </label>
              <input
                type="date"
                id="start-date"
                className="px-4 py-2 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1 w-full md:w-auto scheme-light dark:scheme-dark">
              <label
                htmlFor="end-date"
                className="text-neutral-7 dark:text-neutral-3"
              >
                Fecha de fin
              </label>
              <input
                type="date"
                id="end-date"
                className="px-4 py-2 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        ) : (
          // Filtro por mes/año
          <div className="flex flex-col gap-1 w-full md:w-auto scheme-light dark:scheme-dark">
            <label
              htmlFor="month-year"
              className="text-neutral-7 dark:text-neutral-3"
            >
              Seleccionar Mes/Año
            </label>
            <input
              type="month"
              id="month-year"
              className="px-4 py-2 border border-white-1 rounded-[8px] hover:bg-white-1 text-medium"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Lista de solicitudes */}
      <div className="w-full flex-1 p-4 rounded-sidebar shadow-doc-options bg-white dark:bg-black dark:border dark:border-black-1 text-[12px] overflow-x-auto relative">
        <div className="flex justify-between">
          <h3 className="text-[14px] font-[500] mb-4 text-neutral-7 dark:text-neutral-3">
            Estadísticas de solicitudes
          </h3>
          {filterType === "manual" && (startDate || endDate) && (
            <span className=" ">
              (
              {startDate && `desde ${new Date(startDate).toLocaleDateString()}`}
              {startDate && endDate && " "}
              {endDate && `hasta ${new Date(endDate).toLocaleDateString()}`})
            </span>
          )}
          {filterType === "monthly" && selectedMonth && (
            <span className="">
              (
              {(() => {
                const [year, month] = selectedMonth.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                return date.toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                });
              })()}
              )
            </span>
          )}
        </div>

        {/* Estadísticas del Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            {
              title: 'Total',
              value: statistics.total,
              color: 'text-primary-500'
            },
            {
              title: 'Pendientes',
              value: statistics.pending,
              color: 'text-yellow-500'
            },
            {
              title: 'En Proceso',
              value: statistics.onprocess,
              color: 'text-blue-500'
            },
            {
              title: 'Completadas',
              value: statistics.approved,
              color: 'text-green-500'
            },
            {
              title: 'Rechazadas',
              value: statistics.rejected,
              color: 'text-red-500'
            }
          ].map((card, index) => (
            <div key={index} className="border border-white-1 rounded-sidebar shadow-doc-options hover:bg-white-1 text-medium px-4 py-2 flex justify-between">
              <h3 className="text-[16px] font-[500] text-black dark:text-white">
                {card.title}
              </h3>
              <p className={`text-end text-[16px] font-[500] ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico de Estados de Solicitudes */}
            <div className="bg-white dark:bg-neutral-8 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4 text-neutral-7 dark:text-neutral-3">
                Estados de Solicitudes
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={getStatusData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {getStatusData().map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-neutral-6 dark:text-neutral-4">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Tipos de Documentos */}
            <div className="bg-white dark:bg-neutral-8 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4 text-neutral-7 dark:text-neutral-3">
                Tipos de Documentos
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getDocumentTypesData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Progreso de Documentos */}
            <div className="bg-white dark:bg-neutral-8 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold mb-4 text-neutral-7 dark:text-neutral-3">
                Progreso de Documentos
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={getDocumentProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-center text-neutral-5 dark:text-neutral-4">
            {allRequests.length === 0
              ? "No hay solicitudes disponibles"
              : "No hay solicitudes que coincidan con los filtros seleccionados"}
          </p>
        )}
      </div>
    </PageLayout>
  );
};
