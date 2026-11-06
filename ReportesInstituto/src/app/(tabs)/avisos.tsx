import { FlatList, StyleSheet, Text, View } from "react-native";

const mockAvisos = [
  {
    id: "1",
    titulo: "Corte de agua programado",
    fecha: "Hoy, 10:00 AM",
    mensaje: "Se cortará el suministro en el sector de laboratorios por reparaciones.",
    leido: false,
  },
  {
    id: "2",
    titulo: "Mantenimiento de servidores",
    fecha: "Ayer, 3:30 PM",
    mensaje: "Los sistemas institucionales estarán en mantenimiento durante la tarde.",
    leido: true,
  },
  {
    id: "3",
    titulo: "Reunión de personal",
    fecha: "Ayer, 9:00 AM",
    mensaje: "Se convoca al personal a una reunión en el salón de actos.",
    leido: false,
  },
];

export default function AvisosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Avisos Institucionales</Text>
      <FlatList
        data={mockAvisos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.leido && styles.unreadCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.date}>{item.fecha}</Text>
            </View>
            <Text style={styles.message}>{item.mensaje}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E293B",
  },
  header: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  card: {
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#06B6D4",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  date: {
    color: "#94A3B8",
    fontSize: 12,
    marginLeft: 8,
  },
  message: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 8,
  },
});
