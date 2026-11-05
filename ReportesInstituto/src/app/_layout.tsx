import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { ReportesProvider } from "../context/ReportesContext";

export default function RootLayout() {
  return (
    <ReportesProvider>
      <Stack
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: "#F8FAFC",
          headerTitleStyle: styles.headerTitle,
          contentStyle: styles.content,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reporte" options={{ headerShown: false }} />
        <Stack.Screen
          name="ajustes-app"
          options={{ title: "Ajustes de la app" }}
        />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{ title: "Permiso", presentation: "modal" }}
        />
      </Stack>
    </ReportesProvider>
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
