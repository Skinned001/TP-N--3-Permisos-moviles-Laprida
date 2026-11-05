import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FotoReporteScreen() {
  const router = useRouter();

  const elegirFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        const fotoUri = result.assets[0]?.uri;
        if (fotoUri) {
          router.navigate({
            pathname: "/reporte/nuevo",
            params: { fotoUri },
          });
        }
      }
    } catch (error: unknown) {
      console.error("No se pudo seleccionar la foto del reporte.", error);
      Alert.alert(
        "No se pudo adjuntar la foto",
        "Intentá seleccionar la imagen nuevamente.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foto del desperfecto</Text>
      <Text style={styles.description}>
        Elegí una imagen para adjuntar al reporte.
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => void elegirFoto()}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Elegir de la galería</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#1E293B",
    flex: 1,
    gap: 16,
    padding: 24,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "600",
  },
  description: {
    color: "#CBD5E1",
    fontSize: 15,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#06B6D4",
    borderRadius: 8,
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
