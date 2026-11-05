import type { ReactNode } from "react";
import {
  Alert,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export type EstadoPermisoFallback = "cargando" | "preguntable" | "bloqueado";

type CampoAlternativo = {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
};

export type PermisoFallbackProps = {
  titulo: string;
  mensaje: string;
  estado?: EstadoPermisoFallback;
  campoAlternativo?: CampoAlternativo;
  textoAccionAlternativa?: string;
  accionAlternativaDeshabilitada?: boolean;
  onAccionAlternativa?: () => void;
  onPedir?: () => void | Promise<unknown>;
  onAbrirAjustes?: () => void | Promise<unknown>;
  children?: ReactNode;
};

async function ejecutarAccion(
  accion: () => void | Promise<unknown>,
  mensajeError: string,
) {
  try {
    await accion();
  } catch (error: unknown) {
    console.error(mensajeError, error);
    Alert.alert("No se pudo completar la acción", mensajeError);
  }
}

export default function PermisoFallback({
  titulo,
  mensaje,
  estado,
  campoAlternativo,
  textoAccionAlternativa,
  accionAlternativaDeshabilitada = false,
  onAccionAlternativa,
  onPedir,
  onAbrirAjustes,
  children,
}: PermisoFallbackProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.message}>{mensaje}</Text>

        {estado === "cargando" && (
          <ActivityIndicator color="#06B6D4" size="large" />
        )}

        {estado === "preguntable" && onPedir && (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              void ejecutarAccion(
                onPedir,
                "No se pudo solicitar el permiso.",
              )
            }
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Permitir acceso</Text>
          </Pressable>
        )}

        {estado === "bloqueado" && onAbrirAjustes && (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              void ejecutarAccion(
                onAbrirAjustes,
                "No se pudieron abrir los ajustes del dispositivo.",
              )
            }
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Abrir Ajustes</Text>
          </Pressable>
        )}

        {campoAlternativo && (
          <View style={styles.alternativeField}>
            <Text style={styles.fieldLabel}>{campoAlternativo.label}</Text>
            <TextInput
              accessibilityLabel={campoAlternativo.label}
              autoCapitalize={campoAlternativo.autoCapitalize}
              onChangeText={campoAlternativo.onChangeText}
              onSubmitEditing={campoAlternativo.onSubmitEditing}
              placeholder={campoAlternativo.placeholder}
              placeholderTextColor="#94A3B8"
              returnKeyType="send"
              style={styles.input}
              value={campoAlternativo.value}
            />
          </View>
        )}

        {children}

        {onAccionAlternativa && (
          <Pressable
            accessibilityState={{ disabled: accionAlternativaDeshabilitada }}
            accessibilityRole="button"
            disabled={accionAlternativaDeshabilitada}
            onPress={onAccionAlternativa}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && !accionAlternativaDeshabilitada && styles.buttonPressed,
              accionAlternativaDeshabilitada && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {textoAccionAlternativa ?? "Continuar sin permiso"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#334155",
    borderColor: "#475569",
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  message: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },
  alternativeField: {
    gap: 8,
  },
  fieldLabel: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E293B",
    borderColor: "#06B6D4",
    borderRadius: 8,
    borderWidth: 1,
    color: "#FFFFFF",
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#06B6D4",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#06B6D4",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#67E8F9",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
