import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function ReporteLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: "#F8FAFC",
        headerTitleStyle: styles.headerTitle,
        contentStyle: styles.content,
      }}
    >
      <Stack.Screen name="nuevo" options={{ title: "Nuevo reporte" }} />
      <Stack.Screen name="escanear" options={{ title: "Escanear aula" }} />
      <Stack.Screen name="foto" options={{ title: "Foto del desperfecto" }} />
      <Stack.Screen name="ubicacion" options={{ title: "Ubicación" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalle del reporte" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E293B",
  },
  headerTitle: {
    color: "#F8FAFC",
  },
  content: {
    backgroundColor: "#0F172A",
  },
});
