import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  Alert,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function AjustesAppScreen() {
  const [avisosActivados, setAvisosActivados] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    Notifications.getPermissionsAsync()
      .then((permiso) => {
        if (!cancelado) {
          setAvisosActivados(permiso.granted);
        }
      })
      .catch((error: unknown) => {
        console.error("No se pudo consultar el permiso de notificaciones.", error);
        Alert.alert(
          "No se pudo consultar el permiso",
          "Intentá volver a abrir los ajustes de notificaciones.",
        );
      })
      .finally(() => {
        if (!cancelado) {
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const cambiarAvisos = async (activar: boolean) => {
    if (!activar) {
      setAvisosActivados(false);
      return;
    }

    setCargando(true);
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("reportes", {
          name: "Resolución",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const permiso = await Notifications.requestPermissionsAsync();
      setAvisosActivados(permiso.granted);

      if (!permiso.granted) {
        Alert.alert(
          "Notificaciones desactivadas",
          "No se habilitaron las notificaciones. Podés cambiar el permiso desde los ajustes del dispositivo.",
        );
      }
    } catch (error: unknown) {
      console.error("No se pudieron activar las notificaciones.", error);
      setAvisosActivados(false);
      Alert.alert(
        "No se pudieron activar las notificaciones",
        "Intentá nuevamente en unos momentos.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes de la aplicación</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>
          Avisarme cuando se resuelva mi reporte
        </Text>
        <Switch
          accessibilityLabel="Avisarme cuando se resuelva mi reporte"
          disabled={cargando}
          onValueChange={cambiarAvisos}
          thumbColor={avisosActivados ? "#06B6D4" : "#CBD5E1"}
          trackColor={{ false: "#475569", true: "#155E75" }}
          value={avisosActivados}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F172A",
    flex: 1,
    gap: 24,
    padding: 24,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "700",
  },
  settingRow: {
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderColor: "#334155",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    padding: 16,
  },
  settingLabel: {
    color: "#F8FAFC",
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});
