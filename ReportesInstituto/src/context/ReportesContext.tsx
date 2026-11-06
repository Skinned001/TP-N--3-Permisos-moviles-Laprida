import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type EstadoReporte = "Pendiente" | "En curso" | "Resuelto";

export interface Reporte {
  id: string;
  titulo: string;
  descripcion?: string;
  aula_sector: string;
  estado: EstadoReporte;
}

const mockReportes: Reporte[] = [
  {
    id: "1",
    titulo: "Proyector sin imagen",
    aula_sector: "Aula 3",
    estado: "Pendiente",
  },
  {
    id: "2",
    titulo: "Canilla perdiendo agua",
    aula_sector: "Baños PB",
    estado: "En curso",
  },
  {
    id: "3",
    titulo: "Luz quemada",
    aula_sector: "Laboratorio de Química",
    estado: "Resuelto",
  },
  {
    id: "4",
    titulo: "Ventilador con ruido",
    aula_sector: "Aula 5",
    estado: "Pendiente",
  },
  {
    id: "5",
    titulo: "Cerradura trabada",
    aula_sector: "Taller de Informática",
    estado: "En curso",
  },
];

type ReportesContextValue = {
  reportes: Reporte[];
  agregarReporte: (
    titulo: string,
    descripcion: string,
    aulaSector?: string,
  ) => void;
  actualizarEstado: (id: string, estado: EstadoReporte) => void;
};

const ReportesContext = createContext<ReportesContextValue | null>(null);

type ReportesProviderProps = {
  children: ReactNode;
};

export function ReportesProvider({ children }: ReportesProviderProps) {
  const [reportes, setReportes] = useState(mockReportes);

  const agregarReporte = (
    titulo: string,
    descripcion: string,
    aulaSector?: string,
  ) => {
    const nuevoReporte: Reporte = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      aula_sector: aulaSector?.trim() || "A designar",
      estado: "Pendiente",
    };

    setReportes((reportesActuales) => [nuevoReporte, ...reportesActuales]);
  };

  const actualizarEstado = (id: string, estado: EstadoReporte) => {
    setReportes((reportesActuales) =>
      reportesActuales.map((reporte) =>
        reporte.id === id ? { ...reporte, estado } : reporte,
      ),
    );
  };

  return (
    <ReportesContext.Provider
      value={{ reportes, agregarReporte, actualizarEstado }}
    >
      {children}
    </ReportesContext.Provider>
  );
}

export function useReportes() {
  const context = useContext(ReportesContext);
  if (context === null) {
    throw new Error("useReportes debe usarse dentro de ReportesProvider.");
  }
  return context;
}
