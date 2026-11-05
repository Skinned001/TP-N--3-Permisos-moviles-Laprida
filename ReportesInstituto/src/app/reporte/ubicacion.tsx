import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PermisoFallback from "../../components/PermisoFallback";
import { usePermiso } from "../../hooks/usePermiso";

export default function UbicacionReporteScreen() {
  const router = useRouter();
  const permisoNativo = Location.useForegroundPermissions();
  const { estado, parcial, pedir, abrirAjustes } = usePermiso(permisoNativo);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);

  useEffect(() => {
    if (estado !== "concedido") {
      return;
    }

    let cancelado = false;

    Location.getCurrentPositionAsync()
      .then(() => {
        if (!cancelado) {
          router.navigate({
            pathname: "/reporte/nuevo",
            params: { sector: "Coordenadas capturadas" },
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelado) {
          console.error("No se pudo obtener la ubicación del dispositivo.", error);
          setErrorUbicacion("No se pudo obtener la ubicación actual.");
        }
      });

    return () => {
      cancelado = true;
    };
  }, [estado, parcial, router]);

  if (estado !== "concedido") {
    return (
      <PermisoFallback
        titulo="Ubicación opcional"
        mensaje="Podés compartir la ubicación para identificar el sector del desperfecto o elegir un sector manualmente."
        estado={estado}
        onPedir={pedir}
        onAbrirAjustes={abrirAjustes}
      >
        <View style={styles.sectors}>
          <Text style={styles.sectionTitle}>Elegí el sector manualmente</Text>
          {["Aula 1", "Laboratorio 2", "Pañol", "Baños PB"].map((sector) => (
            <Pressable
              accessibilityRole="button"
              key={sector}
              onPress={() =>
                router.navigate({
                  pathname: "/reporte/nuevo",
                  params: { sector },
                })
              }
              style={({ pressed }) => [
                styles.sectorButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.sectorText}>{sector}</Text>
            </Pressable>
          ))}
        </View>
      </PermisoFallback>
    );
  }

  return (
    <View style={[styles.container, styles.content]}>
      <Text style={styles.title}>Ubicación del desperfecto</Text>
      {parcial ? (
        <Text accessibilityRole="alert" style={styles.approximate}>
          Ubicación aproximada
        </Text>
      ) : errorUbicacion !== null ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {errorUbicacion}
        </Text>
      ) : (
        <ActivityIndicator color="#06B6D4" size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E293B",
  },
  sectors: {
    gap: 10,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectorButton: {
    backgroundColor: "#334155",
    borderColor: "#475569",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectorText: {
    color: "#F8FAFC",
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
  },
  approximate: {
    color: "#FBBF24",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#FDA4AF",
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
});
