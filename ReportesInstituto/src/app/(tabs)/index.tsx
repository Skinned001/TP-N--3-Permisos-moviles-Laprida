import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useReportes } from '../../context/ReportesContext';

export default function IndexScreen() {
  const { reportes } = useReportes();

  // Función auxiliar para el color del punto de estado
  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'resuelto': return '#22C55E'; // Verde
      case 'en curso': return '#06B6D4'; // Cian
      default: return '#F59E0B'; // Amarillo (Pendiente)
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Link href={`/reporte/${item.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.titulo}</Text>
          <Text style={styles.subtitle}>{item.aula_sector}</Text>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.estado) }]} />
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reportes del Instituto</Text>
      <Text style={styles.subHeader}>Instituto Politécnico Formosa</Text>
      
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <Link href="/reporte/nuevo" asChild>
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+ Nuevo Reporte</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B', // Dark slate
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subHeader: {
    color: '#94A3B8',
    fontSize: 14,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espacio para que el FAB no tape el último elemento
  },
  card: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    marginTop: 4,
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#06B6D4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});