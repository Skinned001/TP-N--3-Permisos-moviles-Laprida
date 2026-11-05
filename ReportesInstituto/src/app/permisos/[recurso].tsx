import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const detallesPorRecurso: Record<
  string,
  { nombre: string; icono: string; beneficio: string }
> = {
  camara: {
    nombre: "la cámara",
    icono: "📷",
    beneficio:
      "Para escanear el QR y adjuntar fotos, necesitamos acceso a tu cámara",
  },
  ubicacion: {
    nombre: "la ubicación",
    icono: "📍",
    beneficio:
      "Para ubicar el desperfecto en el instituto, necesitamos acceder a tu ubicación",
  },
  notificaciones: {
    nombre: "las notificaciones",
    icono: "🔔",
    beneficio:
      "Para avisarte sobre el estado de tus reportes, necesitamos enviarte notificaciones",
  },
};

const detallePredeterminado = {
  nombre: "este recurso",
  icono: "🔐",
  beneficio: "Necesitamos este permiso para continuar",
};

export default function PermisoRecursoScreen() {
  const { recurso: recursoParam, estado: estadoParam } =
    useLocalSearchParams<{ recurso?: string; estado?: string }>();
  const router = useRouter();
  const recurso = Array.isArray(recursoParam)
    ? recursoParam[0]
    : recursoParam;
  const estado = Array.isArray(estadoParam) ? estadoParam[0] : estadoParam;
  const detalle = (recurso && detallesPorRecurso[recurso]) || detallePredeterminado;
  const bloqueado = estado === "bloqueado";

  const abrirAjustes = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error("No se pudieron abrir los ajustes del sistema.", error);
      Alert.alert(
        "No se pudieron abrir los ajustes",
        "Abrí los ajustes del dispositivo para cambiar este permiso.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View accessibilityLabel={detalle.nombre} style={styles.iconContainer}>
          <Text style={styles.icon}>{detalle.icono}</Text>
        </View>
        <Text style={styles.title}>
          Acceso a {detalle.nombre}
        </Text>
        <Text style={styles.benefit}>{detalle.beneficio}</Text>
        {bloqueado && (
          <Text accessibilityRole="alert" style={styles.blockedMessage}>
            Este permiso está desactivado en el sistema. Para habilitarlo, abrí
            los ajustes del dispositivo.
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (bloqueado) {
              void abrirAjustes();
            } else {
              router.back();
            }
          }}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {bloqueado ? "Abrir Ajustes" : "Continuar"}
          </Text>
        </Pressable>
        <Text style={styles.secondaryText}>
          Podés cambiar tus preferencias en cualquier momento desde los Ajustes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#0F172A",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    gap: 20,
    maxWidth: 420,
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: "#164E63",
    borderRadius: 36,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  benefit: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  blockedMessage: {
    color: "#FBBF24",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#06B6D4",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonPressed: {
    backgroundColor: "#0891B2",
  },
  buttonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
