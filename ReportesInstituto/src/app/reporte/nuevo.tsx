import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useReportes } from "../../context/ReportesContext";

const adjuntos = [
  { titulo: "Escanear QR de Aula", ruta: "/reporte/escanear" as const },
  { titulo: "Adjuntar Foto", ruta: "/reporte/foto" as const },
  { titulo: "Marcar Ubicación", ruta: "/reporte/ubicacion" as const },
];

export default function NuevoReporteScreen() {
  const router = useRouter();
  const { qr, fotoUri, sector } = useLocalSearchParams<{
    qr?: string;
    fotoUri?: string;
    sector?: string;
  }>();
  const { agregarReporte } = useReportes();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert(
        "Datos incompletos",
        "Completá el título y la descripción del problema.",
      );
      return;
    }

    setGuardando(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    } finally {
      setGuardando(false);
    }

    Alert.alert("Éxito", "Reporte enviado correctamente");
    agregarReporte(titulo, descripcion, sector || qr);
    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.heading}>Describí el problema</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            accessibilityLabel="Título del problema"
            onChangeText={setTitulo}
            placeholder="Ej.: Proyector sin imagen"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={titulo}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            accessibilityLabel="Descripción del problema"
            multiline
            onChangeText={setDescripcion}
            placeholder="Contanos qué ocurrió..."
            placeholderTextColor="#94A3B8"
            style={[styles.input, styles.descriptionInput]}
            textAlignVertical="top"
            value={descripcion}
          />
        </View>

        <View style={styles.attachmentsSection}>
          <Text style={styles.heading}>Adjuntos y Datos</Text>
          {adjuntos.map((adjunto) => (
            <View key={adjunto.ruta}>
              <Link asChild href={adjunto.ruta}>
                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>
                    {adjunto.titulo}
                  </Text>
                </Pressable>
              </Link>
              {adjunto.ruta === "/reporte/escanear" && qr && (
                <Text style={styles.attachmentInfo}>
                  📍 Aula/Sector: {qr}
                </Text>
              )}
              {adjunto.ruta === "/reporte/foto" && fotoUri && (
                <Text style={styles.attachmentInfo}>📸 Foto adjuntada</Text>
              )}
              {adjunto.ruta === "/reporte/ubicacion" && sector && (
                <Text style={styles.attachmentInfo}>🗺️ Ubicación: {sector}</Text>
              )}
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: guardando }}
          disabled={guardando}
          onPress={handleGuardar}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && !guardando && styles.buttonPressed,
          ]}
        >
          {guardando ? (
            <ActivityIndicator color="#1E293B" />
          ) : (
            <Text style={styles.primaryButtonText}>Guardar Reporte</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  form: {
    gap: 20,
  },
  heading: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  field: {
    gap: 8,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#334155",
    borderColor: "#475569",
    borderRadius: 10,
    borderWidth: 1,
    color: "#FFFFFF",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  descriptionInput: {
    minHeight: 120,
  },
  attachmentsSection: {
    gap: 12,
  },
  secondaryButton: {
    alignItems: "center",
    alignSelf: "stretch",
    borderColor: "#06B6D4",
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#67E8F9",
    fontSize: 15,
    fontWeight: "600",
  },
  attachmentInfo: {
    color: "#67E8F9",
    fontSize: 14,
    marginTop: 8,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#06B6D4",
    borderRadius: 10,
    marginTop: 4,
    minHeight: 54,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
