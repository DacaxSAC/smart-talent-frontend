import * as XLSX from "xlsx-js-style";

interface DocumentStatus {
  name: string;
  numberDocsCompleted: number;
}

export interface DataItem {
  id: number;
  date: string;
  owner: string;
  dni: string;
  fullname: string;
  status: string;
  documents: DocumentStatus[];
}

type ExcelCellStyle = {
  font?: {
    bold?: boolean;
    color?: { rgb: string };
    sz?: number;
  };
  fill?: {
    fgColor?: { rgb: string };
  };
  alignment?: {
    horizontal?: string;
    vertical?: string;
    wrapText?: boolean;
  };
  border?: {
    top?: { style: string; color: { rgb: string } };
    bottom?: { style: string; color: { rgb: string } };
    left?: { style: string; color: { rgb: string } };
    right?: { style: string; color: { rgb: string } };
  };
};

export function exportToExcel(
  data: DataItem[],
  fileName: string = "exportacion"
): void {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No hay datos para exportar.");
    return;
  }

  const allDocumentNames: string[] = [
    ...new Set(data.flatMap(item => item.documents?.map(doc => doc.name) || []))
  ];

  const flatData = data.map(item => {
    const docStatuses: Record<string, number> = {};
    allDocumentNames.forEach(docName => {
      const doc = item.documents?.find(d => d.name === docName);
      docStatuses[docName] = doc && doc.numberDocsCompleted !== undefined ? doc.numberDocsCompleted : 0;
    });

    return {
      ID: item.id,
      Fecha: new Date(item.date).toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      Propietario: item.owner,
      DNI: item.dni,
      Nombre_Completo: item.fullname,
      Estado: item.status,
      ...docStatuses
    };
  });

  const headers = Object.keys(flatData[0]);

  const headerStyle: ExcelCellStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
    fill: { fgColor: { rgb: "4F81BD" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  const styledData = [
    headers.map(h => ({ v: h, s: headerStyle })),
    ...flatData.map(row =>
      headers.map((key, colIndex) => {
        const value = (row as Record<string, any>)[key];
        let cellStyle: ExcelCellStyle = {
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };

        // Columna "Estado"
        if (key === "Estado" && typeof value === "string") {
          if (value.toLowerCase() === "realizado") {
            cellStyle.fill = { fgColor: { rgb: "C6EFCE" } };
            cellStyle.font = { color: { rgb: "006100" }, bold: true };
          } else if (value.toLowerCase() === "pendiente") {
            cellStyle.fill = { fgColor: { rgb: "FFC7CE" } };
            cellStyle.font = { color: { rgb: "9C0006" }, bold: true };
          }
        }

        // Columnas después de Estado (documentos: 1 verde, 0 gris)
        const estadoIndex = headers.indexOf("Estado");
        if (colIndex > estadoIndex && typeof value === "number") {
          if (value === 1) {
            cellStyle.fill = { fgColor: { rgb: "C6EFCE" } };
            cellStyle.font = { color: { rgb: "006100" }, bold: true };
          } else if (value === 0) {
            cellStyle.fill = { fgColor: { rgb: "E0E0E0" } };
            cellStyle.font = { color: { rgb: "555555" }, bold: true };
          }
        }

        return { v: value, s: cellStyle };
      })
    )
  ];

  const ws = XLSX.utils.aoa_to_sheet(styledData);

  // Ajustar ancho de columnas
  ws["!cols"] = headers.map(header => {
    if (header === "Nombre_Completo") return { wch: 30 };
    if (header === "Propietario") return { wch: 25 };
    return { wch: 15 };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");

  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
