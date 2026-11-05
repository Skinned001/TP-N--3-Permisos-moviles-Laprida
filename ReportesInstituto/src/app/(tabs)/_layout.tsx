import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: "#F8FAFC",
        headerTitleStyle: styles.headerTitle,
        sceneStyle: styles.scene,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#06B6D4",
        tabBarInactiveTintColor: "#94A3B8",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Reportes" }} />
      <Tabs.Screen name="avisos" options={{ title: "Avisos" }} />
      <Tabs.Screen name="permisos" options={{ title: "Permisos" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E293B",
  },
  headerTitle: {
    color: "#F8FAFC",
  },
  scene: {
    backgroundColor: "#0F172A",
  },
  tabBar: {
    backgroundColor: "#1E293B",
    borderTopColor: "#334155",
  },
});
