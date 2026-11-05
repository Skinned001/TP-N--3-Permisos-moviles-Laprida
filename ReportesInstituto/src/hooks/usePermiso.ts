import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

export type EstadoPermiso =
  | "cargando"
  | "concedido"
  | "preguntable"
  | "bloqueado";

export type RespuestaPermiso = {
  granted: boolean;
  canAskAgain: boolean;
  android?: {
    accuracy?: string | null;
  } | null;
  accessPrivileges?: string | null;
};

export type TuplaPermiso = readonly [
  RespuestaPermiso | null,
  () => Promise<RespuestaPermiso>,
  () => Promise<RespuestaPermiso>,
];

export function usePermiso([
  permisoInicial,
  pedirPermiso,
  consultarPermisoNativo,
]: TuplaPermiso) {
  const [permiso, setPermiso] = useState<RespuestaPermiso | null>(
    permisoInicial,
  );

  useEffect(() => {
    setPermiso(permisoInicial);
  }, [permisoInicial]);

  const consultarPermiso = useCallback(async () => {
    const respuesta = await consultarPermisoNativo();
    setPermiso(respuesta);
    return respuesta;
  }, [consultarPermisoNativo]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (estado) => {
      if (estado === "active") {
        void consultarPermiso().catch((error: unknown) => {
          console.error("No se pudo actualizar el estado del permiso.", error);
        });
      }
    });

    return () => subscription.remove();
  }, [consultarPermiso]);

  const pedir = useCallback(async () => {
    const respuesta = await pedirPermiso();
    setPermiso(respuesta);
    return respuesta;
  }, [pedirPermiso]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  let estado: EstadoPermiso;
  if (permiso === null) {
    estado = "cargando";
  } else if (permiso.granted) {
    estado = "concedido";
  } else if (permiso.canAskAgain) {
    estado = "preguntable";
  } else {
    estado = "bloqueado";
  }

  const parcial =
    permiso?.android?.accuracy === "coarse" ||
    permiso?.accessPrivileges === "limited";

  return {
    estado,
    parcial,
    pedir,
    abrirAjustes,
  };
}
