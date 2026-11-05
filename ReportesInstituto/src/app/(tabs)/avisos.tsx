import { StyleSheet, Text, View } from "react-native";

export default function AvisosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bandeja de avisos</Text>
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
  text: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "600",
  },
});
