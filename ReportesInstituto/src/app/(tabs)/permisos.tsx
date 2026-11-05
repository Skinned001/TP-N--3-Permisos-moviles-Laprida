import { useEffect, useState } from "react";
import { useCameraPermissions } from "expo-camera";
import { useForegroundPermissions } from "expo-location";
import * as Notifications from "expo-notifications";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { usePermiso } from "../../hooks/usePermiso";
import type {
  EstadoPermiso,
  RespuestaPermiso,
  TuplaPermiso,
} from "../../hooks/usePermiso";

type PermisoFila = {
  nombre: string;
  estado: EstadoPermiso;
  parcial: boolean;
  pedir: () => Promise<unknown>;
  abrirAjustes: () => Promise<void>;
};

async function consultarNotificaciones(): Promise<RespuestaPermiso> {
  const permiso = await Notifications.getPermissionsAsync();
  return {
    granted: permiso.granted,
    canAskAgain: permiso.canAskAgain,
  };
}

async function pedirPermisoNotificaciones(): Promise<RespuestaPermiso> {
  const permiso = await Notifications.requestPermissionsAsync();
  return {
    granted: permiso.granted,
    canAskAgain: permiso.canAskAgain,
  };
}

function usePermisoNotificacionesNativo(): TuplaPermiso {
  const [permiso, setPermiso] = useState<RespuestaPermiso | null>(null);

  useEffect(() => {
    let cancelado = false;
    void consultarNotificaciones()
      .then((respuesta) => {
        if (!cancelado) {
          setPermiso(respuesta);
        }
      })
      .catch((error: unknown) => {
        console.error(
          "No se pudo consultar el permiso de notificaciones.",
          error,
        );
        Alert.alert(
          "No se pudo consultar el permiso",
          "El estado de notificaciones no está disponible en este momento.",
        );
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return [permiso, pedirPermisoNotificaciones, consultarNotificaciones];
}

function nombreEstado(estado: EstadoPermiso): string {
  switch (estado) {
    case "cargando":
      return "Cargando";
    case "concedido":
      return "Concedido";
    case "preguntable":
      return "Preguntable";
    case "bloqueado":
      return "Bloqueado";
  }
}

export default function PermisosScreen() {
  const permisoCamaraNativo = useCameraPermissions();
  const permisoUbicacionNativo = useForegroundPermissions();
  const permisoNotificacionesNativo = usePermisoNotificacionesNativo();
  const permisoCamara = usePermiso(permisoCamaraNativo);
  const permisoUbicacion = usePermiso(permisoUbicacionNativo);
  const permisoNotificaciones = usePermiso(permisoNotificacionesNativo);
  const permisos: PermisoFila[] = [
    {
      nombre: "Cámara",
      ...permisoCamara,
    },
    {
      nombre: "Ubicación",
      ...permisoUbicacion,
    },
    {
      nombre: "Notificaciones",
      ...permisoNotificaciones,
    },
  ];

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={permisos}
      keyExtractor={(item) => item.nombre}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Estado de permisos</Text>
          <Text style={styles.platform}>Plataforma: {Platform.OS}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.permissionCard}>
          <View style={styles.permissionText}>
            <Text style={styles.permissionName}>{item.nombre}</Text>
            <Text style={styles.permissionState}>
              {nombreEstado(item.estado)}
            </Text>
            {item.nombre === "Ubicación" && item.parcial && (
              <Text style={styles.reducedAccuracy}>Precisión reducida</Text>
            )}
            {item.estado !== "concedido" &&
              item.estado !== "cargando" && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    const accion =
                      item.estado === "preguntable"
                        ? item.pedir
                        : item.abrirAjustes;
                    void accion().catch((error: unknown) => {
                      console.error(
                        `No se pudo actualizar el permiso de ${item.nombre}.`,
                        error,
                      );
                      Alert.alert(
                        "No se pudo actualizar el permiso",
                        `No se pudo actualizar el permiso de ${item.nombre}.`,
                      );
                    });
                  }}
                  style={({ pressed }) => [
                    styles.actionButton,
                    pressed && styles.actionButtonPressed,
                  ]}
                >
                  <Text style={styles.actionButtonText}>
                    {item.estado === "preguntable"
                      ? "Pedir permiso"
                      : "Abrir Ajustes"}
                  </Text>
                </Pressable>
              )}
          </View>
          <View
            accessibilityLabel={nombreEstado(item.estado)}
            style={[
              styles.statusIndicator,
              item.estado === "concedido"
                ? styles.grantedIndicator
                : item.estado === "bloqueado"
                  ? styles.blockedIndicator
                  : styles.pendingIndicator,
            ]}
          />
        </View>
      )}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
    flex: 1,
  },
  content: {
    gap: 12,
    padding: 20,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "700",
  },
  platform: {
    color: "#94A3B8",
    fontSize: 14,
  },
  permissionCard: {
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  permissionText: {
    flex: 1,
    gap: 4,
  },
  permissionName: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "600",
  },
  permissionState: {
    color: "#CBD5E1",
    fontSize: 14,
  },
  actionButton: {
    alignSelf: "flex-start",
    backgroundColor: "#0E7490",
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  reducedAccuracy: {
    color: "#FBBF24",
    fontSize: 13,
    fontWeight: "600",
  },
  statusIndicator: {
    borderRadius: 8,
    height: 12,
    marginLeft: 12,
    width: 12,
  },
  grantedIndicator: {
    backgroundColor: "#22C55E",
  },
  blockedIndicator: {
    backgroundColor: "#EF4444",
  },
  pendingIndicator: {
    backgroundColor: "#FBBF24",
  },
});
